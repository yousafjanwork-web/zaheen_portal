import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Send, Heart, BookOpen, Star, Wand2, Trash2, Trophy } from 'lucide-react';
import { lessons } from '../data/lessons';

const STORY_PROMPTS = [
  { id: 'p1', emoji: '🚀', title: 'A Space Adventure', prompt: 'You wake up in a rocket ship heading to Mars. What happens next?', theme: 'Space' },
  { id: 'p2', emoji: '🐉', title: 'The Friendly Dragon', prompt: 'A baby dragon crashes into your backyard. How do you help it get home?', theme: 'Fantasy' },
  { id: 'p3', emoji: '🏝️', title: 'Lost on an Island', prompt: 'You wake up on a mysterious island. What do you find? Who lives there?', theme: 'Adventure' },
  { id: 'p4', emoji: '🤖', title: 'My Robot Friend', prompt: 'You invent a robot that can do one magic thing. What does it do?', theme: 'Sci-Fi' },
  { id: 'p5', emoji: '🦄', title: 'Unicorn Magic', prompt: 'You find a unicorn in the school playground. What adventure do you have?', theme: 'Fantasy' },
  { id: 'p6', emoji: '🕵️', title: 'The Mystery', prompt: 'A treasure map falls out of a book at the library. Where does it lead?', theme: 'Mystery' },
  { id: 'p7', emoji: '🌊', title: 'Under the Sea', prompt: 'You can breathe underwater for one day. What is your ocean adventure?', theme: 'Ocean' },
  { id: 'p8', emoji: '🌳', title: 'The Talking Tree', prompt: 'The oldest tree in the forest starts talking to you. What does it say?', theme: 'Nature' },
  { id: 'p9', emoji: '🎭', title: 'Free Style', prompt: 'Write whatever story your imagination dreams up today!', theme: 'Open' },
];

export default function StoryStudio() {
  const { user, stories, publishStory, likeStory, addXP, addCoins, updateQuestProgress, updateChallengeProgress } = useAuth();
  const [selectedPrompt, setSelectedPrompt] = useState<typeof STORY_PROMPTS[0] | null>(null);
  const [story, setStory] = useState('');
  const [published, setPublished] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');
  const [title, setTitle] = useState('');

  if (!user) return null;

  const allWords = lessons.flatMap(l => l.words);

  const evaluateStory = (text: string) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const usedWordCount = allWords.filter(w => text.toLowerCase().includes(w.word.toLowerCase())).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const hasDialogue = /"[^"]+"/.test(text) || /'[^']+'/.test(text);
    const adventureWords = ['suddenly', 'mysterious', 'magical', 'brave', 'adventure', 'amazing', 'incredible'];
    const hasAdventureWords = adventureWords.some(w => text.toLowerCase().includes(w));

    const vocab = Math.min(40, usedWordCount * 10);
    const creativity = Math.min(35, (hasDialogue ? 15 : 0) + (hasAdventureWords ? 10 : 0) + Math.min(10, wordCount / 15));
    const grammar = Math.min(25, sentences > 2 ? 25 : 15);
    return Math.round(vocab + creativity + grammar);
  };

  const handlePublish = () => {
    if (!selectedPrompt || story.trim().length < 20) return;
    const score = evaluateStory(story);
    publishStory({
      title: title.trim() || selectedPrompt.title,
      prompt: selectedPrompt.prompt,
      theme: selectedPrompt.theme,
      submittedAt: new Date().toISOString(),
      storyText: story,
      wordCount: story.split(/\s+/).filter(Boolean).length,
      score,
      feedback: `Wonderful story! You earned ${score} points.`,
    });
    addXP(50, 'Story published');
    addCoins(20);
    updateQuestProgress('q-daily-3', 1);
    updateChallengeProgress(`dc-${new Date().toISOString().split('T')[0]}-3`, story.split(/\s+/).filter(Boolean).length);
    setPublished(true);
    setTimeout(() => {
      setPublished(false);
      setStory('');
      setTitle('');
      setSelectedPrompt(null);
    }, 3000);
  };

  const myStories = stories.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 p-6 md:p-8 text-white shadow-xl shadow-pink-200/40"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-yellow-200/30 blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-fuchsia-200/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30 mb-2">
              📖 Story Studio
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Where your words come alive!
            </h1>
            <p className="text-white/85 mt-1">
              Pick a prompt, write a story, and share it with the world! ✨
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center min-w-[180px]">
            <p className="text-xs text-white/80 uppercase tracking-wider font-bold">Stories Published</p>
            <p className="text-4xl font-black">{stories.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Mode switcher */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
          {(['write', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t === 'write' ? 'mine' : 'all')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                (t === 'write' ? filter === 'mine' : filter === 'all')
                  ? 'bg-white dark:bg-slate-700 text-pink-700 dark:text-pink-300 shadow-md'
                  : 'text-slate-500'
              }`}
            >
              {t === 'write' ? '✍️ Write' : '📚 Library'}
            </button>
          ))}
        </div>
      </div>

      {filter === 'mine' ? (
        /* Story Library */
        <div className="space-y-3">
          {stories.length === 0 ? (
            <div className="text-center py-16 bg-white/60 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-bold text-lg">No stories yet!</p>
              <p className="text-slate-400 text-sm">Write your first story to see it here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {stories.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-700/50 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold uppercase tracking-wider">
                      {s.theme}
                    </span>
                    <button
                      onClick={() => likeStory(s.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" /> {s.likes}
                    </button>
                  </div>
                  <h3 className="font-black text-lg text-slate-800 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-500 italic mb-3 line-clamp-1">{s.prompt}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed">
                    {s.storyText}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{s.wordCount} words</span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Trophy className="w-3 h-3" /> {s.score} pts
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Writing studio */
        <div className="space-y-6">
          {!selectedPrompt ? (
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                <Wand2 className="w-5 h-5 text-pink-500" />
                Pick a writing prompt
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Choose a story idea to begin your adventure! Each prompt gives 50 XP + 20 coins 🪙
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {STORY_PROMPTS.map((p, i) => (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => { setSelectedPrompt(p); setTitle(p.title); }}
                    className="group text-left p-5 rounded-2xl bg-white dark:bg-slate-800/60 border-2 border-slate-200/70 dark:border-slate-700/50 hover:border-pink-400 dark:hover:border-pink-600 hover:shadow-xl hover:shadow-pink-100/50 transition-all overflow-hidden relative"
                  >
                    <div className="absolute -top-6 -right-6 text-7xl opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all">
                      {p.emoji}
                    </div>
                    <div className="relative">
                      <div className="text-3xl mb-2">{p.emoji}</div>
                      <h3 className="font-black text-base text-slate-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.prompt}</p>
                      <span className="text-[10px] mt-2 inline-block px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold uppercase tracking-wider">
                        {p.theme}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedPrompt.emoji}</div>
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold uppercase tracking-wider">
                      {selectedPrompt.theme}
                    </span>
                    <h3 className="font-black text-lg text-slate-800 dark:text-white mt-1">{selectedPrompt.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedPrompt(null); setStory(''); }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-red-100 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 mb-4 italic border border-amber-200/60 dark:border-amber-700/30">
                ✏️ {selectedPrompt.prompt}
              </p>

              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Story title..."
                className="w-full mb-3 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:border-pink-400 outline-none text-sm font-bold"
              />

              <textarea
                value={story}
                onChange={e => setStory(e.target.value)}
                placeholder="Once upon a time..."
                rows={10}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 outline-none transition-all resize-none leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    📝 {story.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    💬 {story.split(/[.!?]+/).filter(s => s.trim().length > 0).length} sentences
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {allWords.filter(w => story.toLowerCase().includes(w.word.toLowerCase())).length} vocab words
                  </span>
                </div>
                <button
                  onClick={handlePublish}
                  disabled={story.trim().length < 20}
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-pink-200/50 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" /> Publish Story
                </button>
              </div>
            </motion.div>
          )}

          {/* Recent stories preview */}
          {myStories.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" /> Your Recent Stories
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {myStories.slice(0, 3).map(s => (
                  <div key={s.id} className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                    <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{s.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.storyText}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{s.wordCount} words</span>
                      <span className="text-amber-500 font-bold">{s.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Published celebration */}
      <AnimatePresence>
        {published && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
              exit={{ scale: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-7xl mb-3">
                🎉
              </motion.div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Story Published!</h2>
              <p className="text-slate-500 mb-4">+50 XP · +20 coins</p>
              <div className="text-sm text-slate-400">Your story is now in the library</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

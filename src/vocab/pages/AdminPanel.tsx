import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { lessons } from '../data/lessons';
import {
  BarChart3, Users, BookOpen, Settings, Plus, Edit, Trash2,
  TrendingUp, Star, Sparkles, Brain,
  Search, Filter, Download, Eye
} from 'lucide-react';

type AdminTab = 'overview' | 'lessons' | 'users' | 'analytics' | 'ai-generate';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showNewLesson, setShowNewLesson] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Access Denied</h2>
        <p className="text-slate-500 mt-2">Admin access required.</p>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'ai-generate', label: 'AI Generate', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-slate-500" /> Admin Panel
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage courses, users, and content</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-800/50 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: '1,234', icon: Users, change: '+12%', color: 'from-violet-400 to-purple-500' },
              { label: 'Active Today', value: '342', icon: Eye, change: '+5%', color: 'from-emerald-400 to-teal-500' },
              { label: 'Total Lessons', value: lessons.length, icon: BookOpen, change: 'New', color: 'from-amber-400 to-orange-500' },
              { label: 'Avg. Score', value: '78%', icon: Star, change: '+3%', color: 'from-rose-400 to-pink-500' },
            ].map(({ label, value, icon: Icon, change, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-500">{change}</span>
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { user: 'Alex', action: 'completed Amazing Animals lesson', time: '2 min ago', score: '85%' },
                { user: 'Emma', action: 'earned 7-Day Streak badge', time: '15 min ago', score: '🏆' },
                { user: 'Liam', action: 'started Space Adventure', time: '32 min ago', score: '—' },
                { user: 'Sophia', action: 'passed Ocean Wonders quiz', time: '1 hour ago', score: '92%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    {item.user[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>{item.user}</strong> {item.action}
                    </p>
                    <p className="text-xs text-slate-400">{item.time}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search lessons..."
                  className="pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:border-violet-400"
                />
              </div>
              <button className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-600">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
            <button
              onClick={() => setShowNewLesson(!showNewLesson)}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 transition-all"
            >
              <Plus className="w-4 h-4" /> New Lesson
            </button>
          </div>

          {/* New Lesson Form */}
          {showNewLesson && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border-2 border-violet-200 dark:border-violet-700"
            >
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Create New Lesson</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Lesson Title</label>
                  <input className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm" placeholder="Enter title..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Theme</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                    <option>Amazing Animals</option>
                    <option>Space Adventure</option>
                    <option>Ocean Wonders</option>
                    <option>Superheroes</option>
                    <option>Friendship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Age Group</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm">
                    <option>Junior (7-9)</option>
                    <option>Senior (10-12)</option>
                    <option>Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Video URL</label>
                  <input className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm" placeholder="YouTube embed URL..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Vocabulary Words (JSON)</label>
                  <textarea rows={4} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm font-mono" placeholder='[{"word":"Example",...}]' />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700">
                  Save Lesson
                </button>
                <button
                  onClick={() => setShowNewLesson(false)}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Lesson List */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {lessons.map(lesson => (
                <div key={lesson.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="text-3xl">{lesson.words[0].imageUrl}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 dark:text-white">{lesson.title}</h4>
                    <p className="text-sm text-slate-500">{lesson.words.length} words • {lesson.theme} • {lesson.ageGroup}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-violet-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Tab */}
      {activeTab === 'ai-generate' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Generate Lesson', desc: 'AI creates a complete vocabulary lesson with theme, words, and activities', icon: BookOpen, action: 'Generate' },
              { title: 'Generate Quiz', desc: 'AI creates quiz questions from your vocabulary words', icon: Brain, action: 'Generate' },
              { title: 'Generate Activity', desc: 'AI creates interactive exercises for any lesson', icon: Sparkles, action: 'Generate' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 hover:border-violet-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">{card.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{card.desc}</p>
                <div className="space-y-2">
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm"
                    placeholder="Enter theme or topic..."
                  />
                  <button className="w-full py-2 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 transition-all">
                    <Sparkles className="w-3.5 h-3.5 inline mr-1" /> {card.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white">All Users</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search users..." className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm outline-none" />
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {[
              { name: 'Alex Johnson', email: 'alex@example.com', role: 'student', ageGroup: 'junior', xp: 150, lessons: 2 },
              { name: 'Emma Williams', email: 'emma@example.com', role: 'student', ageGroup: 'senior', xp: 320, lessons: 4 },
              { name: 'Liam Brown', email: 'liam@example.com', role: 'student', ageGroup: 'junior', xp: 85, lessons: 1 },
              { name: 'Sarah Davis', email: 'sarah@example.com', role: 'parent', ageGroup: '—', xp: 0, lessons: 0 },
            ].map((u, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {u.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">{u.name}</p>
                  <p className="text-sm text-slate-500">{u.email}</p>
                </div>
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300">
                  {u.role}
                </span>
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                  {u.xp} XP
                </span>
                <span className="text-sm text-slate-400">{u.lessons} lessons</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-500" /> Weekly Engagement
              </h3>
              <div className="flex items-end gap-2 h-40">
                {[60, 45, 70, 55, 80, 65, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-violet-500 to-indigo-500 rounded-t-lg transition-all"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-xs text-slate-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Quiz Performance
              </h3>
              <div className="space-y-3">
                {[
                  { lesson: 'Amazing Animals', avg: 82, students: 234 },
                  { lesson: 'Space Adventure', avg: 76, students: 189 },
                  { lesson: 'Ocean Wonders', avg: 88, students: 145 },
                  { lesson: 'Superheroes', avg: 71, students: 98 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 w-32 truncate">{item.lesson}</span>
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full" style={{ width: `${item.avg}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.avg}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-violet-500" /> Export Reports
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-xl text-sm font-medium hover:bg-violet-100 transition-colors">
                📊 Student Progress Report
              </button>
              <button className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors">
                📈 Quiz Performance CSV
              </button>
              <button className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors">
                🏆 Achievement Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

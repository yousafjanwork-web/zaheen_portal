import { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
 import { slugify } from '../utils/slugify';
import { fetchAllCrafts } from '../services/origamiApi'; // add to existing import
import {
  Play, Clock, Users, BookOpen, Heart, Download, Star,
  ChevronLeft, Check, Volume2, ZoomIn, Zap, Share2, ArrowRight,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { useAuth as useZaheenAuth } from '@/modules/shared/context/AuthContext';
import { useApi } from '../hooks/useApi';
import { fetchCraftById, fetchFeaturedCrafts } from '../services/origamiApi';

interface CraftDetailPageProps {
  darkMode: boolean;
}

const INITIAL_STEPS_SHOWN = 5;

const formatDuration = (seconds: number): string | null => {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
};

const CraftDetailPage = ({ darkMode }: CraftDetailPageProps) => {

  const { isLoggedIn } = useZaheenAuth();
  const location = useLocation();

const { slug } = useParams<{ slug: string }>();

const { data: allCraftsForLookup, loading: lookupLoading } = useApi(fetchAllCrafts, []);
const matchedCraft = allCraftsForLookup?.find((c) => slugify(c.title) === slug);
const realId = matchedCraft?.id;

const { data: craft, loading: craftLoading, error } = useApi(
  () => (realId ? fetchCraftById(realId) : Promise.reject(new Error('Craft not found'))),
  [realId],
);

const loading = lookupLoading || (!!realId && craftLoading);

  // Related crafts — re-use the featured endpoint and filter out current
  const { data: allCrafts } = useApi(fetchFeaturedCrafts, []);

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isFavorited, setIsFavorited] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [realDuration, setRealDuration] = useState<string | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);

  // Reset per-craft state when navigating between crafts
  useEffect(() => {
    setCompletedSteps(new Set());
    setIsPlaying(false);
    setRealDuration(null);
    setShowAllSteps(false);
  }, [slug]);

  const hasVideo = !!craft?.videoUrl && craft.videoUrl !== '#' && craft.videoUrl !== '';
  const hasPdf   = !!craft?.pdfUrl   && craft.pdfUrl   !== '#' && craft.pdfUrl   !== '';

  /** Detect URL type so we can choose the right player element */
  const getVideoType = (url: string): 'youtube' | 'vimeo' | 'direct' => {
    if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
    if (/vimeo\.com/i.test(url))             return 'vimeo';
    return 'direct';
  };

  /** Convert any YouTube URL to a proper embed URL */
  const toYouTubeEmbed = (url: string): string => {
    // already an embed URL
    if (url.includes('youtube.com/embed/')) return url;
    // youtu.be/ID or youtube.com/watch?v=ID
    const match = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url;
  };

  /** Convert any Vimeo URL to an embed URL */
  const toVimeoEmbed = (url: string): string => {
    if (url.includes('player.vimeo.com')) return url;
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : url;
  };

  useEffect(() => {
    if (!hasVideo || !craft?.videoUrl) return;
    // Only probe duration for direct (non-embed) videos
    if (getVideoType(craft.videoUrl) !== 'direct') return;
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.src = craft.videoUrl;
    videoEl.onloadedmetadata = () => setRealDuration(formatDuration(videoEl.duration));
    videoEl.onerror = () => setRealDuration(null);
    return () => { videoEl.src = ''; };
  }, [craft?.id, craft?.videoUrl, hasVideo]);

  const displayDuration = realDuration || craft?.duration;

  const visibleSteps = showAllSteps
    ? (craft?.steps ?? [])
    : (craft?.steps ?? []).slice(0, INITIAL_STEPS_SHOWN);
  const hasMoreSteps = (craft?.steps?.length ?? 0) > INITIAL_STEPS_SHOWN;
  const progress = craft?.steps?.length
    ? (completedSteps.size / craft.steps.length) * 100
    : 0;

  const toggleStep = (stepId: number) => {
    const newSet = new Set(completedSteps);
    if (newSet.has(stepId)) { newSet.delete(stepId); } else { newSet.add(stepId); }
    setCompletedSteps(newSet);
    if (craft && newSet.size === craft.steps.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleDownloadPdf = () => {
    if (!hasPdf || !craft) return;
    // Resolve relative PDF paths against the API server origin
    const pdfUrl = craft.pdfUrl.startsWith('http')
      ? craft.pdfUrl
      : `http://localhost:2023${craft.pdfUrl.startsWith('/') ? '' : '/'}${craft.pdfUrl}`;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  // ── Auth gate ───────────────────────────────────────────────────────────
  // Deep-linking straight to a craft/video page must be blocked the same
  // way the library listing is. Checked before loading/error states so a
  // logged-out visitor never sees so much as a skeleton of gated content.
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8 animate-pulse">
            <div className="lg:col-span-2 space-y-6">
              <div className={`aspect-video rounded-[1.5rem] ${darkMode ? 'bg-[#16213e]' : 'bg-gray-200'}`} />
              <div className={`h-8 rounded-xl w-2/3 ${darkMode ? 'bg-[#16213e]' : 'bg-gray-200'}`} />
              <div className={`h-4 rounded-xl w-full ${darkMode ? 'bg-[#16213e]' : 'bg-gray-200'}`} />
            </div>
            <div className={`rounded-[1.5rem] h-80 ${darkMode ? 'bg-[#16213e]' : 'bg-gray-100'}`} />
          </div>
        </div>
      </main>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !craft) {
    return (
      <main className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">😔</span>
          <h3 className="font-fredoka font-bold text-2xl mb-2">Craft not found</h3>
          <p className={`font-nunito mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {error ?? 'We couldn\'t load this craft. Please try again.'}
          </p>
          <Link to="/origami" className="text-primary font-nunito font-bold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const relatedCrafts = (allCrafts ?? []).filter((c) => c.id !== craft.id).slice(0, 3);

  return (
    <main className="relative z-10 min-h-screen">
      {/* Confetti celebration */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1, rotate: 0 }}
                animate={{ y: window.innerHeight + 50, rotate: 720, opacity: 0 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#4F46E5', '#22C55E', '#F59E0B', '#EC4899', '#38BDF8'][Math.floor(Math.random() * 5)],
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center pointer-events-auto">
                <span className="text-6xl block mb-4">🎉</span>
                <h3 className="font-fredoka font-bold text-3xl mb-2 gradient-text">Amazing!</h3>
                <p className="font-nunito text-lg text-gray-600 dark:text-gray-300 mb-2">You completed this craft!</p>
                <p className="font-nunito font-bold text-green text-lg">+50 XP Earned! ⭐</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link
            to="/origami"
            className={`inline-flex items-center gap-2 font-nunito font-semibold ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-primary'} transition-colors`}
          >
            <ChevronLeft size={20} />
            Back to Home
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="relative aspect-video rounded-[1.5rem] overflow-hidden shadow-xl bg-black">
                {isPlaying && hasVideo ? (
                  (() => {
                    const vType = getVideoType(craft.videoUrl);
                    if (vType === 'youtube') {
                      return (
                        <iframe
                          key={craft.id}
                          src={toYouTubeEmbed(craft.videoUrl)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={craft.title}
                        />
                      );
                    }
                    if (vType === 'vimeo') {
                      return (
                        <iframe
                          key={craft.id}
                          src={toVimeoEmbed(craft.videoUrl)}
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={craft.title}
                        />
                      );
                    }
                    // Direct CDN / MP4 / WebM
                    return (
                      <video
                        key={craft.id}
                        src={craft.videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                      >
                        Sorry, your browser doesn't support embedded videos.
                      </video>
                    );
                  })()
                ) : (
                  <>
                    <img src={craft.thumbnail || undefined} alt={craft.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: hasVideo ? 1.1 : 1 }}
                        whileTap={{ scale: hasVideo ? 0.95 : 1 }}
                        onClick={() => hasVideo && setIsPlaying(true)}
                        disabled={!hasVideo}
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play size={40} className="text-primary ml-2" fill="currentColor" />
                      </motion.button>
                    </div>
                    {!hasVideo && (
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg font-nunito text-xs font-semibold">
                        Video coming soon
                      </div>
                    )}
                    {hasVideo && displayDuration && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-xl font-nunito font-semibold text-sm flex items-center gap-2">
                        <Clock size={14} />
                        {displayDuration}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Title & Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="font-fredoka font-bold text-3xl sm:text-4xl mb-2">{craft.title}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg font-nunito font-bold text-sm ${
                      craft.difficulty === 'Beginner' ? 'bg-green/10 text-green' :
                      craft.difficulty === 'Intermediate' ? 'bg-amber/10 text-amber' :
                      'bg-pink/10 text-pink'
                    }`}>
                      {craft.difficulty}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Heart size={14} className="text-pink" /> {(craft.likes ?? 0).toLocaleString()}
                    </span>
                    {/* <span className={`flex items-center gap-1 text-sm font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      👁️ {craft.views} views
                    </span> */}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-xl border transition-all ${
                      isFavorited
                        ? 'bg-pink/10 border-pink text-pink'
                        : darkMode
                          ? 'border-gray-700 text-gray-400 hover:border-pink hover:text-pink'
                          : 'border-gray-200 text-gray-400 hover:border-pink hover:text-pink'
                    }`}
                  >
                    <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                  </motion.button>
                  {/* <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-xl border transition-all ${
                      darkMode
                        ? 'border-gray-700 text-gray-400 hover:border-primary hover:text-primary'
                        : 'border-gray-200 text-gray-400 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {/* <Share2 size={20} /> */}
                  {/* </motion.button> */} 
                  
                </div>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl p-6 ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-fredoka font-bold text-lg">Your Progress</h3>
                <span className="font-nunito font-bold text-primary">{Math.round(progress)}%</span>
              </div>
              <div className={`w-full h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full progress-bar rounded-full"
                />
              </div>
              <p className={`mt-2 font-nunito text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {completedSteps.size} of {craft.steps.length} steps completed
              </p>
            </motion.div>

            {/* Step-by-step Cards */}
            <div className="space-y-4">
              <h2 className="font-fredoka font-bold text-2xl">Step-by-Step Instructions</h2>
              {visibleSteps.map((step, index) => {
                const isCompleted = completedSteps.has(step.stepNumber);
                const hasStepImage = !!step.image;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-2xl overflow-hidden ${
                      darkMode ? 'bg-[#16213e]' : 'bg-white'
                    } shadow-md border-2 transition-all duration-300 ${
                      isCompleted ? 'border-green/50' : darkMode ? 'border-gray-800' : 'border-gray-100'
                    }`}
                  >
                    {hasStepImage && (
                      <div className="w-full aspect-video overflow-hidden">
                        <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleStep(step.stepNumber)}
                          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-fredoka font-bold text-lg transition-all duration-300 ${
                            isCompleted
                              ? 'bg-green text-white'
                              : 'bg-gradient-to-br from-primary/10 to-pink/10 text-primary'
                          }`}
                        >
                          {isCompleted ? <Check size={20} /> : step.stepNumber}
                        </motion.button>
                        <div className="flex-1">
                          <h3 className={`font-fredoka font-bold text-lg mb-1 ${isCompleted ? 'line-through opacity-60' : ''}`}>
                            {step.title}
                          </h3>
                          <p className={`font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-600'} ${isCompleted ? 'opacity-60' : ''}`}>
                            {step.description}
                          </p>
                        </div>
                        {/* <div className="flex items-center gap-1">
                          <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`} title="Listen">
                            <Volume2 size={16} />
                          </button>
                          <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`} title="Zoom">
                            <ZoomIn size={16} />
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {hasMoreSteps && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowAllSteps((prev) => !prev)}
                  className={`w-full py-4 rounded-2xl font-nunito font-bold flex items-center justify-center gap-2 border-2 border-dashed transition-colors ${
                    darkMode
                      ? 'border-gray-700 text-gray-300 hover:border-primary hover:text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {showAllSteps ? (
                    <><ChevronUp size={18} /> Show Less</>
                  ) : (
                    <><ChevronDown size={18} /> Show {craft.steps.length - INITIAL_STEPS_SHOWN} More Steps</>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`sticky top-24 rounded-[1.5rem] p-6 ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}
            >
              <h3 className="font-fredoka font-bold text-xl mb-4">Craft Details</h3>
              <div className="space-y-4">
                {[
                  { icon: <Zap size={18} className="text-green" />, label: 'Difficulty', value: craft.difficulty },
                  { icon: <Clock size={18} className="text-amber" />, label: 'Duration', value: displayDuration },
                  { icon: <Users size={18} className="text-sky" />, label: 'Age Range', value: craft.ageRange },
                  { icon: <BookOpen size={18} className="text-pink" />, label: 'Paper Size', value: craft.paperSize },
                  { icon: <Star size={18} className="text-amber" />, label: 'Rating', value: '4.8 / 5' },
                ].map((detail) => (
                  <div
                    key={detail.label}
                    className={`flex items-center justify-between py-2 border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      {detail.icon}
                      <span className={`font-nunito text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{detail.label}</span>
                    </div>
                    <span className="font-nunito font-bold text-sm">{detail.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: hasPdf ? 1.02 : 1 }}
                  whileTap={{ scale: hasPdf ? 0.98 : 1 }}
                  onClick={handleDownloadPdf}
                  disabled={!hasPdf}
                  title={hasPdf ? 'Download step-by-step PDF' : 'PDF not uploaded yet'}
                  className="w-full bg-gradient-to-r from-primary to-pink text-white font-fredoka font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <Download size={18} />
                  {hasPdf ? 'Download PDF' : 'PDF Coming Soon'}
                </motion.button>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <h4 className="font-nunito font-bold text-sm mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {(craft.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-lg text-xs font-nunito font-semibold ${
                        darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Related Crafts */}
            <div className={`rounded-[1.5rem] p-6 ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}>
              <h3 className="font-fredoka font-bold text-xl mb-4">You'll Also Love</h3>
              <div className="space-y-3">
                {relatedCrafts.map((related) => (
                 <Link key={related.id} to={`/origami/craft/${slugify(related.title)}`}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                      <img src={related.thumbnail || undefined} alt={related.title} className="w-16 h-16 rounded-xl object-cover" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-nunito font-bold text-sm truncate">{related.title}</h4>
                        <p className={`text-xs font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {related.difficulty} • {related.duration}
                        </p>
                      </div>
                      <ArrowRight size={16} className={darkMode ? 'text-gray-600' : 'text-gray-300'} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CraftDetailPage;
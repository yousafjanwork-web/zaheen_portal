import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, BookOpen, Heart, Award, Zap, Target } from 'lucide-react';
import { userProfile, achievements } from '../data/crafts';
import { useApi } from '../hooks/useApi';
import { fetchAllCrafts } from '../services/origamiApi';
import { useAuth } from '@/modules/shared/context/AuthContext';
import { getComputedProfile } from '../utils/progressTracking';
import { useOrigamiBase } from '../hooks/useOrigamiBase';

interface ProfilePageProps {
  darkMode: boolean;
}

const ProfilePage = ({ darkMode }: ProfilePageProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const base = useOrigamiBase();
  const { isLoggedIn } = useAuth();
  const { data: allCrafts } = useApi(fetchAllCrafts, []);

  // Stats are now derived from real activity tracked in progressTracking
  // (localStorage today; swap for a backend call once one exists).
  // Logged-out users still see 0s since nothing should be tracked for them.
  const displayProfile = isLoggedIn
    ? getComputedProfile(userProfile)
    : {
        ...userProfile,
        craftsCompleted: 0,
        totalStars: 0,
        badges: 0,
        certificates: 0,
        streak: 0,
        xp: 0,
        level: 1,
        bookmarks: [] as string[],
        certificatesList: [] as { id: string; title: string; desc: string; date: string; emoji: string }[],
        weekActivity: [false, false, false, false, false, false, false],
      };

  const tabs = [
    { id: 'overview', label: 'Overview', emoji: '📊' },
    { id: 'achievements', label: 'Achievements', emoji: '🏆' },
    { id: 'bookmarks', label: 'Bookmarks', emoji: '❤️' },
    { id: 'certificates', label: 'Certificates', emoji: '📜' },
  ];

  const bookmarkedCrafts = (allCrafts ?? []).filter(c => displayProfile.bookmarks.includes(c.id));

  return (
    <main className="relative z-10 min-h-screen">
      {/* Profile Header */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-r from-[#16213e] to-[#0f0f23]' : 'bg-gradient-to-r from-primary via-pink to-amber'} text-white py-12 sm:py-16`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 text-6xl animate-float">⭐</div>
          <div className="absolute bottom-5 right-10 text-5xl animate-float-slow">🏆</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/20 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl shadow-xl">
              {displayProfile.avatar}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-fredoka font-bold text-3xl sm:text-4xl mb-1">
                {displayProfile.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-lg font-nunito font-bold text-sm flex items-center gap-1">
                  <Zap size={14} /> Level {displayProfile.level}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-lg font-nunito font-bold text-sm flex items-center gap-1">
                  <Flame size={14} /> {displayProfile.streak} Day Streak
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-lg font-nunito font-bold text-sm flex items-center gap-1">
                  <Star size={14} /> {displayProfile.totalStars} Stars
                </span>
              </div>
              {/* XP Bar */}
              <div className="max-w-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-nunito text-white/80">XP Progress</span>
                  <span className="text-sm font-nunito font-bold">{displayProfile.xp} / {displayProfile.xpToNext}</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(displayProfile.xp / displayProfile.xpToNext) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-amber to-green rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <BookOpen size={22} className="text-primary" />, value: displayProfile.craftsCompleted, label: 'Crafts Done', gradient: 'from-primary/10 to-indigo-100' },
            { icon: <Star size={22} className="text-amber" />, value: displayProfile.totalStars, label: 'Total Stars', gradient: 'from-amber/10 to-yellow-100' },
            { icon: <Trophy size={22} className="text-green" />, value: displayProfile.badges, label: 'Badges', gradient: 'from-green/10 to-emerald-100' },
            { icon: <Award size={22} className="text-pink" />, value: displayProfile.certificates, label: 'Certificates', gradient: 'from-pink/10 to-rose-100' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-5 text-center ${
                darkMode ? 'bg-[#16213e]' : 'bg-white'
              } shadow-md`}
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="font-fredoka font-bold text-2xl">{stat.value}</div>
              <div className={`font-nunito text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-nunito font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : darkMode ? 'bg-[#16213e] text-gray-400 hover:bg-[#1a1a3e]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Daily Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[1.5rem] p-6 sm:p-8 ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}
            >
              <h3 className="font-fredoka font-bold text-xl mb-4 flex items-center gap-2">
                <Flame className="text-amber" size={24} />
                Daily Streak
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const active = displayProfile.weekActivity?.[i] ?? false;
                  return (
                    <div key={day} className="text-center flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-1 ${
                        active
                          ? 'bg-gradient-to-br from-amber to-orange-500 text-white shadow-md'
                          : darkMode ? 'bg-white/10 text-gray-600' : 'bg-gray-100 text-gray-300'
                      }`}>
                        {active ? '🔥' : '○'}
                      </div>
                      <span className={`text-xs font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Weekly Challenge */}
            <div className={`rounded-[1.5rem] p-6 sm:p-8 bg-gradient-to-r from-primary to-pink text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-fredoka font-bold text-xl mb-2 flex items-center gap-2">
                    <Target size={22} />
                    Weekly Challenge
                  </h3>
                  <p className="font-nunito text-white/80 mb-4">Complete 3 bird origami this week to earn a special badge!</p>
                 <div className="flex items-center gap-3">
                    <div className="w-full max-w-xs h-3 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: isLoggedIn ? '33%' : '0%' }} />
                    </div>
                    <span className="font-nunito font-bold text-sm">{isLoggedIn ? '1' : '0'}/3</span>
                  </div>
                </div>
                <span className="text-4xl">🎯</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-6 text-center ${
                  achievement.unlocked && isLoggedIn
                    ? darkMode ? 'bg-[#16213e]' : 'bg-white'
                    : darkMode ? 'bg-[#16213e]/50 opacity-60' : 'bg-gray-50 opacity-60'
                } shadow-md border ${
                  achievement.unlocked && isLoggedIn
                    ? 'border-amber/30'
                    : darkMode ? 'border-gray-800' : 'border-gray-200'
                }`}
              >
                <span className={`text-4xl block mb-3 ${achievement.unlocked && isLoggedIn ? '' : 'grayscale'}`}>
                  {achievement.emoji}
                </span>
                <h4 className="font-fredoka font-bold text-base mb-1">{achievement.title}</h4>
                <p className={`font-nunito text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-nunito font-bold ${
                  achievement.unlocked && isLoggedIn ? 'bg-amber/10 text-amber' : darkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Zap size={10} /> {achievement.xp} XP
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div>
            {bookmarkedCrafts.length === 0 ? (
              <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}>
                <span className="text-5xl block mb-4">❤️</span>
                <h3 className="font-fredoka font-bold text-xl mb-2">No bookmarks yet</h3>
                <p className={`font-nunito text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isLoggedIn ? 'Save your favourite crafts to find them here.' : 'Log in to save and view your bookmarked crafts.'}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedCrafts.map((craft) => (
                 <Link key={craft.id} to={`${base}/craft/${craft.id}`}>
                    <div className={`card-hover rounded-[1.5rem] overflow-hidden ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}>
                      <div className="relative aspect-video">
                        <img src={craft.thumbnail || undefined} alt={craft.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute top-3 right-3 p-2 bg-pink rounded-xl text-white">
                          <Heart size={16} fill="white" />
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-fredoka font-bold text-lg mb-1">{craft.title}</h3>
                        <p className={`text-sm font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {craft.difficulty} • {craft.duration}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div>
            {!isLoggedIn || displayProfile.certificatesList.length === 0 ? (
              <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}>
                <span className="text-5xl block mb-4">📜</span>
                <h3 className="font-fredoka font-bold text-xl mb-2">No certificates yet</h3>
                <p className={`font-nunito text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isLoggedIn ? 'Complete more crafts to earn your first certificate.' : 'Log in and complete crafts to earn certificates.'}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {displayProfile.certificatesList.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-[1.5rem] p-8 text-center ${
                      darkMode ? 'bg-gradient-to-br from-[#16213e] to-[#1a1a4e]' : 'bg-gradient-to-br from-amber-50 to-yellow-50'
                    } border-2 border-amber/30 shadow-md`}
                  >
                    <span className="text-5xl block mb-4">{cert.emoji}</span>
                    <div className="text-xs font-nunito font-bold text-amber mb-2 uppercase tracking-wider">Certificate of Achievement</div>
                    <h3 className="font-fredoka font-bold text-2xl mb-2">{cert.title}</h3>
                    <p className={`font-nunito text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cert.desc}</p>
                    <div className={`text-xs font-nunito ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{cert.date}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
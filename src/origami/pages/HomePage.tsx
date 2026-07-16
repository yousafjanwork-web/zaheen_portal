import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Star, Heart, ChevronRight, Sparkles, BookOpen, Users, Download, Zap, ArrowRight, Trophy } from 'lucide-react';
import { ageGroups, whyOrigami } from '../data/crafts';
import { useApi } from '../hooks/useApi';
import { slugify } from '../utils/slugify';
import kids from "../../assets/images/hero-kids-origami.jpg"
import {
  fetchCategories,
  fetchFeaturedCrafts,
  fetchTodaysCraft,
  fetchDifficultyLevels,
} from '../services/origamiApi';

interface HomePageProps {
  darkMode: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const childFade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const SkeletonCard = ({ darkMode }: { darkMode: boolean }) => (
  <div className={`rounded-[1.5rem] overflow-hidden ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md animate-pulse`}>
    <div className={`aspect-video ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
    <div className="p-5 space-y-2">
      <div className={`h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-3/4`} />
      <div className={`h-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-1/2`} />
    </div>
  </div>
);

const HomePage = ({ darkMode }: HomePageProps) => {
  const { data: categories, loading: catsLoading } = useApi(fetchCategories, []);
  const { data: featuredCrafts, loading: craftsLoading } = useApi(fetchFeaturedCrafts, []);
  const { data: todaysCraft, loading: todayLoading } = useApi(fetchTodaysCraft, []);
  const { data: difficultyLevels, loading: diffLoading } = useApi(fetchDifficultyLevels, []);

  return (
    <main className="relative z-10">
      {/* ===== HERO SECTION ===== */}
    <section className={`relative overflow-hidden isolate ${darkMode ? 'bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23]' : 'bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50'}`}>
       <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
<div className="absolute bottom-10 right-10 w-96 h-96 bg-pink/10 rounded-full blur-3xl" />
<div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                  darkMode ? 'bg-primary/20 text-primary-light' : 'bg-primary/10 text-primary'
                } font-nunito font-bold text-sm`}
              >
                <Sparkles size={16} />
                <span>#1 Origami Learning Platform for Kids</span>
              </motion.div>

              <h1 className="font-fredoka font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6">
                Let's Fold{' '}
                <span className="gradient-text">Amazing</span>{' '}
                Paper Creations!
              </h1>

              <p className={`font-nunito text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Learn fun Origami with easy videos, colorful pictures, and simple steps.
                Perfect for kids aged 4-14! 🎨
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/origami/library">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-dark text-white font-fredoka font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow flex items-center justify-center gap-3"
                  >
                    <Play size={22} fill="white" />
                    Start Learning
                  </motion.button>
                </Link>
                <Link to="/origami/category/animals">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full sm:w-auto font-fredoka font-bold text-lg px-8 py-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${
                      darkMode
                        ? 'border-white/20 text-white hover:bg-white/10'
                        : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                    }`}
                  >
                    🐶 Browse Animals
                  </motion.button>
                </Link>
              </div>

          
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src={kids}
                  alt="Kids making origami"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -top-6 -left-6 animate-float">
                <div className={`${darkMode ? 'bg-[#16213e]' : 'bg-white/90'} p-4 rounded-2xl shadow-lg`}>
                    <span className="text-4xl">🦢</span>
                  </div>
                </div>
                <div className="absolute -top-4 right-10 animate-float-delayed">
                  <div className={`${darkMode ? 'bg-[#16213e]' : 'bg-white'} p-3 rounded-2xl shadow-lg`}>
                    <span className="text-3xl">✈️</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 animate-float-slow">
                  <div className={`${darkMode ? 'bg-[#16213e]' : 'bg-white'} p-3 rounded-2xl shadow-lg`}>
                    <span className="text-3xl">🦋</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 right-8 animate-float">
                  <div className="bg-gradient-to-r from-green to-green-light text-white px-4 py-2 rounded-2xl shadow-lg font-nunito font-bold text-sm flex items-center gap-2">
                    <Trophy size={16} />
                    +50 XP Earned!
                  </div>
                </div>
                <div className="absolute top-1/2 -right-6 animate-wing-flap">
                  <span className="text-4xl">🐦</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 sm:h-16">
            <path
              d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z"
              fill={darkMode ? '#0f0f23' : '#F9FAFB'}
            />
          </svg>
        </div>
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-fredoka font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Explore Categories <span className="animate-wiggle inline-block">🎨</span>
            </h2>
            <p className={`font-nunito text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose from exciting categories and start folding beautiful creations!
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {catsLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`rounded-[1.5rem] aspect-square animate-pulse ${darkMode ? 'bg-[#16213e]' : 'bg-gray-200'}`} />
                ))
              : (categories ?? []).map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <Link to={`/origami/category/${cat.id}`}>
                      <div className={`card-hover rounded-[1.5rem] p-5 sm:p-6 text-center group cursor-pointer bg-gradient-to-br ${cat.gradient} text-white relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                        <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
                          {cat.emoji}
                        </div>
                        <div className="relative z-10">
                          <span className="text-4xl sm:text-5xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                            {cat.emoji}
                          </span>
                          <h3 className="font-fredoka font-bold text-base sm:text-lg mb-1">{cat.name}</h3>
                          <p className="text-white/80 font-nunito text-xs sm:text-sm mb-2">{cat.count} crafts</p>
                          <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-nunito font-semibold inline-block">
                            Ages {cat.ageRange}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR VIDEOS ===== */}
      <section className={`py-16 sm:py-24 ${darkMode ? 'bg-[#0a0a1a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-fredoka font-bold text-3xl sm:text-4xl lg:text-5xl mb-2">
                Popular Videos <span className="animate-bounce-soft inline-block">🎬</span>
              </h2>
              <p className={`font-nunito text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Most loved crafts by our young origami artists
              </p>
            </div>
            <Link to="/origami/library" className="hidden sm:flex items-center gap-2 text-primary font-nunito font-bold hover:gap-3 transition-all">
              View All <ChevronRight size={18} />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {craftsLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} darkMode={darkMode} />)
              : (featuredCrafts ?? []).slice(0, 6).map((craft, index) => (
                  <motion.div
                    key={craft.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                   <Link to={`/origami/craft/${slugify(craft.title)}`}>
                      <div className={`card-hover rounded-[1.5rem] overflow-hidden ${
                        darkMode ? 'bg-[#16213e]' : 'bg-white'
                      } shadow-md hover:shadow-xl transition-all duration-300`}>
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={craft.thumbnail || undefined}
                            alt={craft.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <Play size={24} className="text-primary ml-1" fill="currentColor" />
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-nunito font-semibold flex items-center gap-1">
                            <Clock size={12} />
                            {craft.duration}
                          </div>
                          <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-sm font-nunito font-bold ${
                            craft.difficulty === 'Beginner' ? 'bg-green text-white' :
                            craft.difficulty === 'Intermediate' ? 'bg-amber text-white' :
                            'bg-pink text-white'
                          }`}>
                            {craft.difficulty}
                          </div>
                          {craft.featured && (
                            <div className="absolute top-3 right-3 bg-amber text-white px-3 py-1 rounded-lg text-sm font-nunito font-bold flex items-center gap-1">
                              <Star size={12} fill="white" />
                              Featured
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-fredoka font-bold text-lg mb-2">{craft.title}</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`flex items-center gap-1 text-sm font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Heart size={14} className="text-pink" /> {(craft.likes ?? 0).toLocaleString()}
                              </span>
                              <span className={`flex items-center gap-1 text-sm font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                👁️ {craft.views}
                              </span>
                            </div>
                            <span className={`text-sm font-nunito font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Ages {craft.ageRange}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>

          <div className="sm:hidden text-center mt-8">
            <Link to="/origami/library" className="inline-flex items-center gap-2 text-primary font-nunito font-bold text-lg">
              View All Videos <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TODAY'S EASY CRAFT ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            {todayLoading ? (
              <div className={`rounded-[2rem] animate-pulse ${darkMode ? 'bg-[#16213e]' : 'bg-gray-100'} h-72`} />
            ) : todaysCraft ? (
              <div className={`rounded-[2rem] overflow-hidden ${
                darkMode ? 'bg-gradient-to-br from-[#16213e] to-[#1a1a3e]' : 'bg-gradient-to-br from-amber-50 to-pink-50'
              } p-6 sm:p-10 lg:p-14`}>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                      darkMode ? 'bg-amber/20 text-amber' : 'bg-amber/10 text-amber'
                    } font-nunito font-bold text-sm`}>
                      <Sparkles size={16} />
                      Today's Easy Craft
                    </div>
                    <h2 className="font-fredoka font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
                      {todaysCraft.title} <span className="animate-wiggle inline-block">🐶</span>
                    </h2>
                    <p className={`font-nunito text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      A super easy and adorable origami for young crafters. Make a cute creation in just minutes!
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      {[
                        { icon: <Zap size={18} />, label: 'Difficulty', value: todaysCraft.difficulty, color: 'text-green' },
                        { icon: <Users size={18} />, label: 'Ages', value: todaysCraft.ageRange, color: 'text-sky' },
                        { icon: <Clock size={18} />, label: 'Time', value: todaysCraft.duration, color: 'text-amber' },
                        { icon: <BookOpen size={18} />, label: 'Paper', value: todaysCraft.paperSize, color: 'text-pink' },
                      ].map((detail) => (
                        <div key={detail.label} className={`text-center p-3 rounded-2xl ${
                          darkMode ? 'bg-white/5' : 'bg-white/60'
                        }`}>
                          <div className={`${detail.color} flex justify-center mb-1`}>{detail.icon}</div>
                          <div className={`text-xs font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{detail.label}</div>
                          <div className="font-fredoka font-bold text-sm">{detail.value}</div>
                        </div>
                      ))}
                    </div>

                 <Link to={`/origami/craft/${slugify(todaysCraft.title)}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-amber to-pink text-white font-fredoka font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-amber/25 flex items-center gap-3"
                      >
                        <Play size={22} fill="white" />
                        Start Folding!
                      </motion.button>
                    </Link>
                  </div>

                  <div className="relative">
                    <img
                      src={todaysCraft.thumbnail || undefined}
                      alt={todaysCraft.title}
                      className="w-full rounded-3xl shadow-xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-3xl flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
                      >
                        <Play size={36} className="text-primary ml-1" fill="currentColor" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>

      {/* ===== LEARN BY DIFFICULTY ===== */}
      <section className={`py-16 sm:py-24 ${darkMode ? 'bg-[#0a0a1a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-fredoka font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Learn by Difficulty 🎯
            </h2>
            <p className={`font-nunito text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start where you're comfortable and level up your folding skills!
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {diffLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`rounded-[1.5rem] h-48 animate-pulse ${darkMode ? 'bg-[#16213e]' : 'bg-gray-100'}`} />
                ))
              : (difficultyLevels ?? []).map((level, index) => (
                  <motion.div
                    key={level.level}
                    {...childFade}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Link to="/origami/library">
                      <div className={`card-hover rounded-[1.5rem] p-8 text-center ${
                        darkMode ? 'bg-[#16213e]' : 'bg-white'
                      } shadow-md border ${
                        darkMode ? 'border-gray-800' : 'border-gray-100'
                      }`}>
                        <span className="text-5xl block mb-4">{level.emoji}</span>
                        <h3 className={`font-fredoka font-bold text-2xl mb-2 ${
                          level.color === 'green' ? 'text-green' :
                          level.color === 'amber' ? 'text-amber' :
                          'text-pink'
                        }`}>
                          {level.level}
                        </h3>
                        <p className={`font-nunito mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {level.description}
                        </p>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-nunito font-bold text-sm ${
                          level.color === 'green' ? 'bg-green/10 text-green' :
                          level.color === 'amber' ? 'bg-amber/10 text-amber' :
                          'bg-pink/10 text-pink'
                        }`}>
                          {level.count} Crafts <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ===== AGE GROUPS ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-fredoka font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Find Your Age Group 🧒
            </h2>
            <p className={`font-nunito text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Crafts tailored to every age — from tiny tots to teen creators!
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ageGroups.map((group, index) => (
              <motion.div
                key={group.range}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to="/origami/library">
                  <div className={`card-hover rounded-[1.5rem] p-6 sm:p-8 text-center ${
                    darkMode ? 'bg-[#16213e]' : 'bg-white'
                  } shadow-md border ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                    <span className="text-5xl sm:text-6xl block mb-3">{group.emoji}</span>
                    <h3 className="font-fredoka font-bold text-xl sm:text-2xl mb-1">{group.range}</h3>
                    <p className={`font-nunito text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {group.description}
                    </p>
                    <div className={`text-sm font-nunito font-bold ${
                      group.color === 'sky' ? 'text-sky' :
                      group.color === 'green' ? 'text-green' :
                      group.color === 'amber' ? 'text-amber' :
                      'text-primary'
                    }`}>
                      {group.count} crafts →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY KIDS LOVE ORIGAMI ===== */}
      <section className={`py-16 sm:py-24 ${darkMode ? 'bg-[#0a0a1a]' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-fredoka font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Why Kids Love Origami 💜
            </h2>
            <p className={`font-nunito text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              More than just paper folding — it's a superpower builder!
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyOrigami.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`card-hover rounded-[1.5rem] p-6 sm:p-8 ${
                  darkMode ? 'bg-[#16213e]' : 'bg-white'
                } shadow-md`}
              >
                <span className="text-4xl sm:text-5xl block mb-4 animate-pulse-soft">{reason.icon}</span>
                <h3 className="font-fredoka font-bold text-xl mb-2">{reason.title}</h3>
                <p className={`font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-fredoka font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              How It Works ✨
            </h2>
            <p className={`font-nunito text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Three simple steps to become an origami master!
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 relative">
            <div className={`hidden sm:block absolute top-20 left-[20%] right-[20%] h-1 rounded-full ${
              darkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div className="progress-bar h-full rounded-full w-2/3" />
            </div>

            {[
              { step: 1, emoji: '🎨', title: 'Choose a Craft', desc: 'Browse hundreds of crafts by category, difficulty, or age group.', color: 'from-primary to-primary-light' },
              { step: 2, emoji: '📺', title: 'Watch the Video', desc: 'Follow along with our easy step-by-step video instructions.', color: 'from-green to-green-light' },
              { step: 3, emoji: '🎉', title: 'Fold Together!', desc: 'Create amazing paper art and earn XP points and badges!', color: 'from-amber to-amber-light' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center relative z-10"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-nunito font-bold mb-3 ${
                  darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  Step {item.step}
                </div>
                <h3 className="font-fredoka font-bold text-xl sm:text-2xl mb-2">{item.title}</h3>
                <p className={`font-nunito max-w-xs mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

 

      {/* ===== NEWSLETTER ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            <div className="bg-gradient-to-br from-primary via-pink to-amber rounded-[2rem] p-8 sm:p-12 lg:p-16 text-white text-center relative overflow-hidden">
              <div className="absolute top-4 left-4 text-5xl opacity-20 animate-float">✈️</div>
              <div className="absolute bottom-4 right-4 text-5xl opacity-20 animate-float-slow">🦋</div>
              <div className="absolute top-1/2 right-10 text-4xl opacity-10 animate-float-delayed">⭐</div>

              <div className="relative z-10">
                <h2 className="font-fredoka font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
                  Join Our Paper Family! 📬
                </h2>
                <p className="font-nunito text-lg sm:text-xl mb-8 text-white/90 max-w-xl mx-auto">
                  Get weekly craft ideas, new tutorials, and fun challenges delivered to parents' inbox!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter parent's email"
                    className="flex-1 px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/60 font-nunito focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary font-fredoka font-bold px-8 py-4 rounded-2xl hover:shadow-lg transition-shadow"
                  >
                    Subscribe ✉️
                  </motion.button>
                </div>
                <p className="text-sm text-white/60 font-nunito mt-4">
                  🔒 We never share your email. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

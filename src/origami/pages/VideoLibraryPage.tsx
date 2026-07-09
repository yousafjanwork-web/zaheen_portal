import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Heart, Search, Grid3X3, LayoutList, Star } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchAllCrafts, fetchCategories } from '../services/origamiApi';
import { slugify } from '../utils/slugify';

interface VideoLibraryPageProps {
  darkMode: boolean;
}

const VideoLibraryPage = ({ darkMode }: VideoLibraryPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: allCrafts, loading: craftsLoading } = useApi(fetchAllCrafts, []);
  const { data: categories, loading: catsLoading } = useApi(fetchCategories, []);

  const filteredCrafts = useMemo(() => {
    let result = [...(allCrafts ?? [])];

    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.tags.some((t) => t.includes(searchQuery.toLowerCase())),
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter((c) => c.category === selectedCategory);
    }
    if (selectedDifficulty !== 'all') {
      result = result.filter((c) => c.difficulty === selectedDifficulty);
    }
    if (sortBy === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'newest') {
      result.reverse();
    }

    return result;
  }, [allCrafts, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const loading = craftsLoading || catsLoading;

  return (
    <main className="relative z-10 min-h-screen">
      {/* Hero Banner */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-r from-[#16213e] to-[#0f0f23]' : 'bg-gradient-to-r from-primary to-pink'} text-white py-12 sm:py-16`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 text-6xl animate-float">📹</div>
          <div className="absolute bottom-5 right-10 text-5xl animate-float-slow">🎬</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-fredoka font-bold text-4xl sm:text-5xl mb-4">
              Video Library 📺
            </h1>
            <p className="font-nunito text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              Browse all our origami tutorials — filter by category, difficulty, or search for your favourite!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className={`sticky top-16 sm:top-20 z-20 ${darkMode ? 'bg-[#0f0f23]' : 'bg-[#F9FAFB]'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} py-3`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crafts…"
                className={`w-full pl-9 pr-4 py-2 rounded-xl font-nunito text-sm ${
                  darkMode ? 'bg-[#16213e] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800'
                } border focus:outline-none focus:ring-2 focus:ring-primary`}
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-xl font-nunito text-sm border ${
                darkMode ? 'bg-[#16213e] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <option value="all">All Categories</option>
              {(categories ?? []).map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
              ))}
            </select>

            {/* Difficulty filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`px-4 py-2 rounded-xl font-nunito text-sm border ${
                darkMode ? 'bg-[#16213e] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">🟢 Beginner</option>
              <option value="Intermediate">🟡 Intermediate</option>
              <option value="Advanced">🔴 Advanced</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-xl font-nunito text-sm border ${
                darkMode ? 'bg-[#16213e] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>

            {/* View mode */}
            <div className={`flex items-center gap-1 ml-auto rounded-xl border p-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <LayoutList size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`rounded-[1.5rem] overflow-hidden animate-pulse ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}>
                <div className={`aspect-video ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="p-5 space-y-2">
                  <div className={`h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-3/4`} />
                  <div className={`h-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-1/2`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className={`font-nunito text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filteredCrafts.length} craft{filteredCrafts.length !== 1 ? 's' : ''} found
            </p>

            {viewMode === 'grid' ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrafts.map((craft, index) => (
                  <motion.div
                    key={craft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                <Link to={`/origami/craft/${slugify(craft.title)}`}>
                      <div className={`card-hover rounded-[1.5rem] overflow-hidden ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}>
                        <div className="relative aspect-video overflow-hidden">
                          <img src={craft.thumbnail || undefined} alt={craft.title} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <Play size={24} className="text-primary ml-1" fill="currentColor" />
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-nunito font-semibold flex items-center gap-1">
                            <Clock size={12} /> {craft.duration}
                          </div>
                          <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-sm font-nunito font-bold ${
                            craft.difficulty === 'Beginner' ? 'bg-green text-white' :
                            craft.difficulty === 'Intermediate' ? 'bg-amber text-white' :
                            'bg-pink text-white'
                          }`}>
                            {craft.difficulty}
                          </div>
                          {craft.featured && (
                            <div className="absolute top-3 right-3 bg-amber text-white px-2 py-1 rounded-lg text-xs font-nunito font-bold flex items-center gap-1">
                              <Star size={10} fill="white" /> Featured
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-fredoka font-bold text-lg mb-2">{craft.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className={`flex items-center gap-1 text-sm font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Heart size={14} className="text-pink" /> {(craft.likes ?? 0).toLocaleString()}
                            </span>
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
            ) : (
              <div className="space-y-4">
                {filteredCrafts.map((craft, index) => (
                  <motion.div
                    key={craft.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link to={`/origami/craft/${craft.id}`}>
                      <div className={`card-hover flex gap-4 p-4 rounded-2xl ${darkMode ? 'bg-[#16213e]' : 'bg-white'} shadow-md`}>
                        <div className="relative w-32 sm:w-48 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                          <img src={craft.thumbnail || undefined} alt={craft.title} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                              <Play size={16} className="text-primary ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h3 className="font-fredoka font-bold text-lg mb-1 truncate">{craft.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm font-nunito">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                              craft.difficulty === 'Beginner' ? 'bg-green/10 text-green' :
                              craft.difficulty === 'Intermediate' ? 'bg-amber/10 text-amber' :
                              'bg-pink/10 text-pink'
                            }`}>
                              {craft.difficulty}
                            </span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              <Clock size={12} className="inline mr-1" />{craft.duration}
                            </span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              <Heart size={12} className="inline mr-1 text-pink" />{(craft.likes ?? 0).toLocaleString()}
                            </span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              Ages {craft.ageRange}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredCrafts.length === 0 && (
              <div className="text-center py-16">
                <span className="text-6xl block mb-4">📭</span>
                <h3 className="font-fredoka font-bold text-2xl mb-2">No crafts found</h3>
                <p className={`font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default VideoLibraryPage;

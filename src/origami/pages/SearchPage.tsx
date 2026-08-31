import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Play, Clock, Heart } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchCategories, searchCrafts } from '../services/origamiApi';
import { useOrigamiBase } from '../hooks/useOrigamiBase';
import type { Craft } from '../data/crafts';

interface SearchPageProps {
  darkMode: boolean;
}

const suggestions = ['Crane', 'Butterfly', 'Dog', 'Cat', 'Heart', 'Star', 'Airplane', 'Flower', 'Fish', 'Dinosaur'];

const SearchPage = ({ darkMode }: SearchPageProps) => {
  const base = useOrigamiBase();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<Craft[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { data: categories } = useApi(fetchCategories, []);

  // Debounce the search input so we don't fire an API call on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const data = await searchCrafts(q.trim());
      setResults(data);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  const matchingCategories = debouncedQuery.trim()
    ? (categories ?? []).filter((c) =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    : [];

  return (
    <main className="relative z-10 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-fredoka font-bold text-3xl sm:text-4xl mb-4">
            Search Origami 🔍
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for crafts, animals, categories..."
              className={`w-full pl-14 pr-6 py-5 rounded-2xl font-nunito text-lg ${
                darkMode
                  ? 'bg-[#16213e] border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg`}
              autoFocus
            />
            {searchLoading && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Suggestions — shown when input is empty */}
        {!debouncedQuery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className={`font-nunito font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2 mb-12">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className={`px-4 py-2 rounded-xl font-nunito font-semibold text-sm transition-all btn-bounce ${
                    darkMode
                      ? 'bg-[#16213e] text-gray-300 hover:bg-primary/20 hover:text-primary-light'
                      : 'bg-white text-gray-600 hover:bg-primary/10 hover:text-primary shadow-sm'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className={`font-nunito font-semibold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Browse Categories
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(categories ?? []).slice(0, 5).map((cat) => (
                <Link key={cat.id} to={`${base}/category/${cat.id}`}>
                  <div className={`card-hover rounded-2xl p-4 text-center bg-gradient-to-br ${cat.gradient} text-white`}>
                    <span className="text-3xl block mb-2">{cat.emoji}</span>
                    <h4 className="font-nunito font-bold text-sm">{cat.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Category Results */}
        {debouncedQuery && matchingCategories.length > 0 && (
          <div className="mb-8">
            <p className={`font-nunito font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Categories
            </p>
            <div className="flex flex-wrap gap-3">
             {matchingCategories.map((cat) => (
                <Link key={cat.id} to={`${base}/category/${cat.id}`}>
                  <div className={`card-hover flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${cat.gradient} text-white font-nunito font-bold text-sm`}>
                    <span className="text-2xl">{cat.emoji}</span>
                    {cat.name}
                    <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">{cat.count} crafts</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {debouncedQuery && (
          <div>
            {searchError ? (
              <div className="text-center py-16">
                <span className="text-6xl block mb-4">⚠️</span>
                <h3 className="font-fredoka font-bold text-2xl mb-2">Search failed</h3>
                <p className={`font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{searchError}</p>
              </div>
            ) : (
              <>
                <p className={`font-nunito font-semibold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {searchLoading
                    ? 'Searching…'
                    : `${results.length} result${results.length !== 1 ? 's' : ''} for "${debouncedQuery}"`}
                </p>

                <div className="space-y-4">
                  {results.map((craft, index) => (
                    <motion.div
                      key={craft.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                     <Link to={`${base}/craft/${craft.id}`}>
                        <div className={`card-hover flex gap-4 p-4 rounded-2xl ${
                          darkMode ? 'bg-[#16213e]' : 'bg-white'
                        } shadow-md`}>
                          <div className="relative w-32 sm:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0">
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
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {!searchLoading && results.length === 0 && (
                  <div className="text-center py-16">
                    <span className="text-6xl block mb-4">🔍</span>
                    <h3 className="font-fredoka font-bold text-2xl mb-2">No results found</h3>
                    <p className={`font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Try searching for something else
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchPage;

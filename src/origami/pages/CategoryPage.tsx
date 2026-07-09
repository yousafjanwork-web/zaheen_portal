import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Heart, ArrowLeft } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchCategories, fetchCraftsByCategory } from '../services/origamiApi';
import { slugify } from '../utils/slugify';

interface CategoryPageProps {
  darkMode: boolean;
}

const CategoryPage = ({ darkMode }: CategoryPageProps) => {
  const { id } = useParams<{ id: string }>();

  const { data: categories, loading: catsLoading } = useApi(fetchCategories, []);
  const { data: crafts, loading: craftsLoading } = useApi(
    () => fetchCraftsByCategory(id ?? ''),
    [id],
  );

  const category = (categories ?? []).find((c) => c.id === id) ?? (categories ?? [])[0];

  return (
    <main className="relative z-10 min-h-screen">
      {/* Hero Banner */}
      <section className={`relative overflow-hidden ${
        category ? `bg-gradient-to-r ${category.gradient}` : 'bg-gradient-to-r from-sky-400 to-blue-500'
      } text-white py-16 sm:py-20`}>
        {category && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-10 text-8xl animate-float">{category.emoji}</div>
            <div className="absolute bottom-5 right-10 text-6xl animate-float-slow">{category.emoji}</div>
            <div className="absolute top-10 right-1/3 text-5xl animate-float-delayed">{category.emoji}</div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/origami" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-nunito font-semibold mb-6 transition-colors">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          {catsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-white/20 rounded-xl w-1/3" />
              <div className="h-6 bg-white/20 rounded-xl w-1/2" />
            </div>
          ) : category ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-6xl sm:text-7xl block mb-4">{category.emoji}</span>
              <h1 className="font-fredoka font-bold text-4xl sm:text-5xl lg:text-6xl mb-3">
                {category.name}
              </h1>
              <p className="font-nunito text-lg sm:text-xl text-white/80 max-w-xl">
                {category.description}
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="bg-white/20 px-4 py-2 rounded-xl font-nunito font-bold text-sm">
                  {category.count} Crafts
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl font-nunito font-bold text-sm">
                  Ages {category.ageRange}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* Category Tabs */}
      <div className={`${darkMode ? 'bg-[#0a0a1a]' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'} sticky top-16 sm:top-20 z-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {(categories ?? []).map((cat) => (
              <Link key={cat.id} to={`/origami/category/${cat.id}`}>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-xl font-nunito font-semibold text-sm whitespace-nowrap transition-all ${
                  cat.id === id
                    ? 'bg-primary text-white'
                    : darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}>
                  <span>{cat.emoji}</span>
                  {cat.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Crafts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {craftsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(crafts ?? []).map((craft, index) => (
              <motion.div
                key={craft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
               <Link to={`/origami/craft/${slugify(craft.title)}`}>
                  <div className={`card-hover rounded-[1.5rem] overflow-hidden ${
                    darkMode ? 'bg-[#16213e]' : 'bg-white'
                  } shadow-md`}>
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
        )}

        {!craftsLoading && (crafts ?? []).length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">📭</span>
            <h3 className="font-fredoka font-bold text-2xl mb-2">No crafts found</h3>
            <p className={`font-nunito ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No crafts in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;

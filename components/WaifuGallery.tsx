"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Heart, Sparkles } from "lucide-react";

// Mock Data - In a real app, this would come from an API or CMS
const WAIFUS = [
  { id: 1, name: "Kaoruko Waguri", anime: "Kaoru Hana wa Rin to Saku", type: "Wholesome", desc: "The gentle scent of cake and flowers.", image: "✿" },
  { id: 2, name: "Marin Kitagawa", anime: "Sono Bisque Doll", type: "Energetic", desc: "Cosplay queen with a heart of gold.", image: "🎀" },
  { id: 3, name: "Yor Forger", anime: "Spy x Family", type: "Cool", desc: "Deadly assassin, clumsy mother.", image: "⚔️" },
  { id: 4, name: "Hitori Gotoh", anime: "Bocchi the Rock!", type: "Introvert", desc: "Guitar hero in the making.", image: "🎸" },
  { id: 5, name: "Frieren", anime: "Sousou no Frieren", type: "Cool", desc: "Elf mage on a journey to know humans.", image: "🪄" },
  { id: 6, name: "Chisato Nishikigi", anime: "Lycoris Recoil", type: "Energetic", desc: "Peacemaker with a gun.", image: "🔫" },
];

const FILTERS = ["All", "Wholesome", "Energetic", "Cool", "Introvert"];

export default function WaifuGallery() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);

  const filteredWaifus = WAIFUS.filter((waifu) => {
    const matchesFilter = filter === "All" || waifu.type === filter;
    const matchesSearch = waifu.name.toLowerCase().includes(search.toLowerCase()) || 
                          waifu.anime.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10"
      >
        {/* Search */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-soft-pink transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search character or anime..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:border-soft-pink focus:ring-1 focus:ring-soft-pink outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                filter === f
                  ? "bg-soft-pink text-slate-900 border-soft-pink shadow-[0_0_15px_rgba(251,207,232,0.5)]"
                  : "bg-transparent text-slate-300 border-slate-700 hover:border-soft-pink/50 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredWaifus.map((waifu) => (
            <motion.div
              key={waifu.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="group relative"
              onMouseEnter={() => setHovered(waifu.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative h-96 bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-soft-pink/50 transition-colors duration-500 backdrop-blur-sm shadow-xl">
                {/* Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 group-hover:scale-105 transition-transform duration-700">
                  <span className="text-8xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse">
                    {waifu.image}
                  </span>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-80" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 bg-soft-pink rounded-full">
                      {waifu.type}
                    </span>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Heart size={20} />
                    </motion.button>
                  </div>
                  
                  <h3 className="text-2xl font-serif text-white mb-1 group-hover:text-soft-pink transition-colors">
                    {waifu.name}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium mb-3">{waifu.anime}</p>
                  
                  <p className="text-sm text-slate-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    "{waifu.desc}"
                  </p>
                </div>

                {/* Glow Effect on Hover */}
                {hovered === waifu.id && (
                  <motion.div
                    layoutId="glow"
                    className="absolute inset-0 rounded-2xl ring-2 ring-soft-pink/50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredWaifus.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Sparkles className="mx-auto mb-4 opacity-50" size={48} />
          <p className="text-xl font-serif">No waifus found...</p>
        </div>
      )}
    </div>
  );
}

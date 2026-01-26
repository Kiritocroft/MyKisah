"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Heart, Sparkles, Crown } from "lucide-react";
import { getCharacters, type Character } from "@/app/actions/characters";

const FILTERS = ["All", "Wholesome", "Energetic", "Cool", "Introvert"];

export default function WaifuGallery() {
  const [waifus, setWaifus] = useState<Character[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { characters } = await getCharacters();
      setWaifus(characters);
      setLoading(false);
    }
    loadData();
  }, []);

  const rankedWaifus = waifus
    .filter((w) => w.rank !== undefined && w.rank !== null)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0));

  const unrankedWaifus = waifus.filter((w) => w.rank === undefined || w.rank === null);

  const filteredUnrankedWaifus = unrankedWaifus.filter((waifu) => {
    const matchesFilter = filter === "All" || waifu.type === filter;
    const matchesSearch = waifu.name.toLowerCase().includes(search.toLowerCase()) || 
                          waifu.anime.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
      return (
          <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-soft-pink border-t-transparent rounded-full animate-spin" />
          </div>
      );
  }

  const renderCard = (waifu: Character, isRanked: boolean = false) => {
    let rankColor = "text-slate-400";
    let borderColor = "border-slate-700/50";
    
    if (isRanked) {
        if (waifu.rank === 1) {
            rankColor = "text-yellow-400";
            borderColor = "border-yellow-400/50";
        } else if (waifu.rank === 2) {
            rankColor = "text-slate-300";
            borderColor = "border-slate-300/50";
        } else if (waifu.rank === 3) {
            rankColor = "text-amber-600";
            borderColor = "border-amber-600/50";
        }
    }

    return (
      <motion.div
        key={waifu.id}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`group relative ${isRanked ? "col-span-1" : ""}`}
        onMouseEnter={() => setHovered(waifu.id)}
        onMouseLeave={() => setHovered(null)}
      >
        <div className={`relative h-96 bg-slate-800/50 rounded-2xl overflow-hidden border ${isRanked ? borderColor : "border-slate-700/50"} hover:border-soft-pink/50 transition-colors duration-500 backdrop-blur-sm shadow-xl`}>
          {/* Image/Emoji Display */}
          {waifu.image.startsWith("/") || waifu.image.startsWith("http") ? (
              <div className="absolute inset-0">
                  <img 
                      src={waifu.image} 
                      alt={waifu.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60"></div>
              </div>
          ) : (
              <>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 group-hover:scale-105 transition-transform duration-700">
                      <span className="text-8xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse">
                      {waifu.image}
                      </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-80"></div>
              </>
          )}

          {/* Rank Badge */}
          {isRanked && (
              <div className="absolute top-4 right-4 z-10">
                  <div className={`w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur flex items-center justify-center border ${borderColor}`}>
                      <Crown size={24} className={rankColor} fill={waifu.rank === 1 ? "currentColor" : "none"} />
                  </div>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white border ${borderColor}`}>
                      Rank {waifu.rank}
                  </div>
              </div>
          )}

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
              &ldquo;{waifu.desc}&rdquo;
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
    );
  };

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

      {/* Top 3 Section */}
      {rankedWaifus.length > 0 && (
        <div className="mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8 justify-center"
            >
                <div className="h-[1px] bg-gradient-to-r from-transparent via-soft-pink/50 to-transparent flex-1 max-w-xs"></div>
                <h2 className="text-2xl md:text-3xl font-serif text-white flex items-center gap-2 md:gap-3">
                    <Crown className="text-yellow-400 fill-yellow-400 w-6 h-6 md:w-8 md:h-8" />
                    Top Favorites
                    <Crown className="text-yellow-400 fill-yellow-400 w-6 h-6 md:w-8 md:h-8" />
                </h2>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-soft-pink/50 to-transparent flex-1 max-w-xs"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Re-order for podium effect: 2, 1, 3 (if we have 3) */}
                {/* Actually simple grid is fine, 1, 2, 3 */}
                {rankedWaifus.map((waifu) => renderCard(waifu, true))}
            </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredUnrankedWaifus.map((waifu) => renderCard(waifu, false))}
        </AnimatePresence>
      </div>

      {filteredUnrankedWaifus.length === 0 && rankedWaifus.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Sparkles className="mx-auto mb-4 opacity-50" size={48} />
          <p className="text-xl font-serif">No waifus found...</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useDeferredValue, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaifuCard from "./WaifuCard";

const FILTERS = ["All", "Wholesome", "Energetic", "Cool", "Introvert"];

export default function WaifuGallery() {
  const [waifus, setWaifus] = useState<Character[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search); // Defer the search value for filtering
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

  const rankedWaifus = useMemo(() => {
    return waifus
      .filter((w) => w.rank !== undefined && w.rank !== null)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0));
  }, [waifus]);

  const unrankedWaifus = useMemo(() => {
    return waifus.filter((w) => w.rank === undefined || w.rank === null);
  }, [waifus]);

  const filteredUnrankedWaifus = useMemo(() => {
    return unrankedWaifus.filter((waifu) => {
      const matchesFilter = filter === "All" || waifu.type === filter;
      const matchesSearch = waifu.name.toLowerCase().includes(deferredSearch.toLowerCase()) || 
                            waifu.anime.toLowerCase().includes(deferredSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [unrankedWaifus, filter, deferredSearch]);

  if (loading) {
      return (
          <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-soft-pink border-t-transparent rounded-full animate-spin" />
          </div>
      );
  }

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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
              <AnimatePresence>
                {rankedWaifus.map((waifu) => (
                  <WaifuCard
                    key={waifu.id}
                    waifu={waifu}
                    isRanked={true}
                    isHovered={hovered === waifu.id}
                    onHover={setHovered}
                  />
                ))}
              </AnimatePresence>
            </div>
        </div>
      )}

      {/* Main Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredUnrankedWaifus.map((waifu) => (
            <WaifuCard
              key={waifu.id}
              waifu={waifu}
              isHovered={hovered === waifu.id}
              onHover={setHovered}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredUnrankedWaifus.length === 0 && rankedWaifus.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Sparkles className="mx-auto mb-4 opacity-50" size={48} />
          <p className="text-xl font-serif">No waifus found...</p>
        </div>
      )}
    </div>
  );
}

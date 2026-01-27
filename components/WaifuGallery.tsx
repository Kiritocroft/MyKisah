"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaifuCard from "./WaifuCard";
import { type Character } from "@/types";
import { Search, Sparkles, Grid } from "lucide-react";

interface WaifuGalleryProps {
  initialCharacters: Character[];
}

export default function WaifuGallery({ initialCharacters }: WaifuGalleryProps) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Separation of Hall of Fame (Ranked) vs Others
  const { ranked, others } = useMemo(() => {
    // Sort logic: 
    // 1. Filter by search/type first
    const filtered = initialCharacters.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.anime.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "All" || c.type === filter;
        return matchSearch && matchFilter;
    });

    // 2. Separate
    const rankedChars = filtered.filter(c => c.rank && c.rank > 0 && c.rank <= 3).sort((a, b) => (a.rank || 0) - (b.rank || 0));
    const otherChars = filtered.filter(c => !c.rank || c.rank > 3);
    
    return { ranked: rankedChars, others: otherChars };
  }, [initialCharacters, search, filter]);

  const rank1 = ranked.find(c => c.rank === 1);
  const rank2 = ranked.find(c => c.rank === 2);
  const rank3 = ranked.find(c => c.rank === 3);

  const categories = ["All", "Wholesome", "Energetic", "Cool", "Introvert"];

  return (
    <section id="gallery" className="min-h-screen py-20 px-4 md:px-8 max-w-[1600px] mx-auto relative z-10">
      
      {/* Floating Filter Bar */}
      <div className="sticky top-8 z-50 flex justify-center mb-12 md:mb-20">
        <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-2 md:gap-4 overflow-x-auto max-w-[90vw] no-scrollbar"
        >
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`
                        relative px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                        ${filter === cat ? "text-slate-900" : "text-slate-400 hover:text-white"}
                    `}
                >
                    {filter === cat && (
                        <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 bg-soft-pink rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{cat}</span>
                </button>
            ))}
            
            <div className="w-px h-6 bg-white/20 mx-2 hidden md:block" />
            
            <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search waifu..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-slate-800/50 border border-transparent focus:border-soft-pink/50 rounded-full pl-9 pr-4 py-2 text-sm text-white w-48 transition-all focus:w-64 focus:outline-none"
                />
            </div>
        </motion.div>
      </div>

      {/* Mobile Search (visible only on mobile) */}
      <div className="md:hidden mb-8 px-2">
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Search your waifu..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-soft-pink/50"
            />
         </div>
      </div>

      {/* HALL OF FAME (Bento Grid) */}
      {ranked.length > 0 && (
          <div className="mb-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-8"
            >
                <Sparkles className="text-yellow-400 w-6 h-6 md:w-8 md:h-8" />
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-yellow-400 to-amber-600">
                    Hall of Fame
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 h-auto md:h-[600px] items-end">
                {/* Rank 2 - Left Side */}
                {rank2 && (
                    <div className="md:col-span-1 h-[400px] md:h-[85%]">
                        <WaifuCard 
                            waifu={rank2} 
                            isRanked={true} 
                            isHovered={hoveredId === rank2.id} 
                            onHover={setHoveredId} 
                        />
                    </div>
                )}

                {/* Rank 1 - Center (Wide & Tall) */}
                {rank1 && (
                    <div className="md:col-span-2 h-[500px] md:h-full z-10">
                         <WaifuCard 
                            waifu={rank1} 
                            isRanked={true} 
                            isHovered={hoveredId === rank1.id} 
                            onHover={setHoveredId} 
                         />
                    </div>
                )}
                
                {/* Rank 3 - Right Side */}
                {rank3 && (
                    <div className="md:col-span-1 h-[400px] md:h-[85%]">
                        <WaifuCard 
                            waifu={rank3} 
                            isRanked={true} 
                            isHovered={hoveredId === rank3.id} 
                            onHover={setHoveredId} 
                        />
                    </div>
                )}
            </div>
          </div>
      )}

      {/* Main Grid */}
      <div>
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
        >
            <Grid className="text-soft-pink w-6 h-6" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                The Collection
            </h2>
            <div className="h-px bg-white/10 flex-1 ml-4" />
            <span className="text-slate-500 font-mono text-sm">{others.length} Characters</span>
        </motion.div>

        <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
        >
            <AnimatePresence>
                {others.map((waifu) => (
                    <motion.div
                        layout
                        key={waifu.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="h-[400px]"
                    >
                        <WaifuCard 
                            waifu={waifu} 
                            isHovered={hoveredId === waifu.id} 
                            onHover={setHoveredId} 
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>

        {others.length === 0 && ranked.length === 0 && (
            <div className="py-20 text-center">
                <p className="text-slate-500 text-lg">No waifus found matching your criteria...</p>
            </div>
        )}
      </div>

    </section>
  );
}

"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Crown, Heart } from "lucide-react";
import { type Character } from "@/app/actions/characters";

interface WaifuCardProps {
  waifu: Character;
  isRanked?: boolean;
  isHovered: boolean;
  onHover: (id: number | null) => void;
}

const WaifuCard = memo(({ waifu, isRanked = false, isHovered, onHover }: WaifuCardProps) => {
  let rankColor = "text-slate-400";
  let rankBg = "bg-slate-900/80";
  let borderColor = "border-slate-700/50";
  
  if (isRanked) {
      if (waifu.rank === 1) {
          rankColor = "text-yellow-400";
          rankBg = "bg-yellow-950/80";
          borderColor = "border-yellow-400/50";
      } else if (waifu.rank === 2) {
          rankColor = "text-slate-300";
          rankBg = "bg-slate-800/80";
          borderColor = "border-slate-300/50";
      } else if (waifu.rank === 3) {
          rankColor = "text-amber-600";
          rankBg = "bg-amber-950/80";
          borderColor = "border-amber-600/50";
      }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`group relative ${isRanked ? "col-span-1" : ""}`}
      onMouseEnter={() => onHover(waifu.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`relative h-[28rem] bg-slate-800/50 rounded-3xl overflow-hidden border ${isRanked ? borderColor : "border-slate-700/50"} hover:border-soft-pink/50 transition-colors duration-500 backdrop-blur-sm shadow-xl`}>
        {/* Image/Emoji Display */}
        {waifu.image.startsWith("/") || waifu.image.startsWith("http") ? (
            <div className="absolute inset-0">
                <img 
                    src={waifu.image} 
                    alt={waifu.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80"></div>
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

        {/* Rank Badge - Top Right */}
        {isRanked && (
            <div className="absolute top-4 right-4 z-20 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full ${rankBg} backdrop-blur-md flex flex-col items-center justify-center border ${borderColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Crown size={20} className={`${rankColor} mb-0.5`} fill={waifu.rank === 1 ? "currentColor" : "none"} strokeWidth={2.5} />
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${rankColor}`}>
                      Rank {waifu.rank}
                    </span>
                </div>
            </div>
        )}

        {/* Character Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
           {/* Tag - Floating above text */}
          <div className="mb-4">
            <span className="px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-900 bg-soft-pink rounded-full shadow-[0_0_10px_rgba(251,207,232,0.4)]">
              {waifu.type}
            </span>
          </div>
          
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-3xl font-serif font-bold text-white mb-1 group-hover:text-soft-pink transition-colors leading-tight drop-shadow-lg">
              {waifu.name}
              </h3>
              <p className="text-sm text-slate-400 font-medium mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-soft-pink"></span>
                  {waifu.anime}
              </p>
              
              <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 max-w-[85%]">
                  &ldquo;{waifu.desc}&rdquo;
                  </p>
                  <motion.button 
                      whileTap={{ scale: 0.8 }}
                      className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                  >
                      <Heart size={24} />
                  </motion.button>
              </div>
          </div>
        </div>

        {/* Glow Effect on Hover */}
        {isHovered && (
          <motion.div
            layoutId="glow"
            className="absolute inset-0 rounded-3xl ring-2 ring-soft-pink/50 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
    </motion.div>
  );
});

WaifuCard.displayName = "WaifuCard";

export default WaifuCard;

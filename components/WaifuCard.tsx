"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Crown } from "lucide-react";
import { type Character } from "@/types";

interface WaifuCardProps {
  waifu: Character;
  isRanked?: boolean;
  rankIndex?: number; // 1, 2, 3
  isHovered: boolean;
  onHover: (id: number | null) => void;
}

const WaifuCard = memo(({ waifu, isRanked = false, onHover }: WaifuCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      queueMicrotask(() => setImageLoaded(true));
    }
  }, []);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);
  
  // Rank Styling
  let rankColor = "text-slate-400";
  let rankBg = "bg-slate-900/80";
  let borderColor = "border-slate-700/30";
  let glowColor = "rgba(148, 163, 184, 0.2)"; // Default slate glow

  if (isRanked) {
      if (waifu.rank === 1) {
          rankColor = "text-yellow-300";
          rankBg = "bg-gradient-to-br from-yellow-950/90 to-amber-900/90";
          borderColor = "border-yellow-500/50";
          glowColor = "rgba(234, 179, 8, 0.4)";
      } else if (waifu.rank === 2) {
          rankColor = "text-slate-200";
          rankBg = "bg-gradient-to-br from-slate-800/90 to-slate-700/90";
          borderColor = "border-slate-300/50";
          glowColor = "rgba(203, 213, 225, 0.4)";
      } else if (waifu.rank === 3) {
          rankColor = "text-amber-600";
          rankBg = "bg-gradient-to-br from-amber-950/90 to-orange-900/90";
          borderColor = "border-amber-600/50";
          glowColor = "rgba(217, 119, 6, 0.4)";
      }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    onHover(null);
  };

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
      className={`relative h-full ${isRanked && waifu.rank === 1 ? 'md:col-span-2 md:row-span-2' : ''}`}
      onMouseEnter={() => onHover(waifu.id)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`
            relative h-full w-full rounded-[2rem] bg-slate-900/40 backdrop-blur-md border border-white/10
            shadow-xl overflow-hidden transition-all duration-300
            ${isRanked ? borderColor : "border-white/5"}
            group
        `}
      >
        {/* Dynamic Glow Background */}
        <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
                background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`
            }}
        />

        {/* Image Layer */}
        <div className="absolute inset-0 z-0">
             {!imageLoaded && !hasError && (
                <div className="absolute inset-0 bg-slate-900 animate-pulse" />
             )}
             
             {!hasError && (waifu.image.startsWith("/") || waifu.image.startsWith("http")) ? (
                <motion.img 
                    ref={imgRef}
                    src={waifu.image} 
                    alt={waifu.name} 
                    className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                        scale: 1.1,
                        objectPosition: waifu.objectPosition || "center center"
                    }} // Slightly larger for parallax potential
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setHasError(true);
                        setImageLoaded(true);
                    }}
                />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 p-4 text-center">
                    <span className="text-6xl mb-2">✿</span>
                    <span className="text-xs text-slate-500 font-mono">NO IMAGE</span>
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-60" />
        </div>

        {/* Holographic Sheen */}
        <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

        {/* Content Layer (Floating in 3D) */}
        <motion.div 
            className="absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-6"
            style={{ translateZ: 50 }}
        >
            {/* Top Section: Rank & Tag */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                {isRanked && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
                            flex items-center justify-center w-12 h-12 rounded-full 
                            ${rankBg} border ${borderColor} shadow-[0_0_15px_${glowColor}]
                        `}
                    >
                        <Crown size={20} className={rankColor} fill={waifu.rank === 1 ? "currentColor" : "none"} />
                    </motion.div>
                )}
            </div>

            {/* Bottom Section: Name & Details */}
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-900 bg-white/90 rounded-full backdrop-blur-sm">
                    {waifu.type}
                </span>
                
                <h3 className={`font-serif font-bold text-white mb-1 leading-none ${isRanked && waifu.rank === 1 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                    {waifu.name}
                </h3>
                
                <p className="text-sm text-slate-300 font-medium flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-soft-pink animate-pulse"></span>
                    {waifu.anime}
                </p>

                <p className="text-xs md:text-sm text-slate-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    {waifu.desc}
                </p>
            </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

WaifuCard.displayName = "WaifuCard";

export default WaifuCard;

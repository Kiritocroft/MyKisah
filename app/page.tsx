"use client";

import Scene from "@/components/Scene";
import WaifuGallery from "@/components/WaifuGallery";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ 
  subsets: ["latin"], 
  weight: ["400", "600"],
  display: "swap"
});

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <main ref={containerRef} className="min-h-screen bg-night-bg relative overflow-x-hidden selection:bg-soft-pink selection:text-slate-900">
      
      {/* Hero Section */}
      <section className="h-[100dvh] w-full relative flex flex-col items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>
        
        {/* Overlay Content */}
        <motion.div 
            style={{ opacity, scale }}
            className="z-10 text-center pointer-events-none mt-[-5vh] md:mt-[-10vh] mix-blend-screen select-none relative px-4"
        >
            {/* Decorative Line */}
            <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent via-soft-pink to-transparent mx-auto mb-4 md:mb-8"
            />

            <motion.h1 
                initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ 
                    duration: 0.8, 
                    type: "spring",
                    bounce: 0.5
                }}
                className={`${fredoka.className} text-6xl sm:text-7xl md:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-[#ff9a9e] via-[#fecfef] to-[#ff9a9e] mb-4 md:mb-6 tracking-wide leading-none drop-shadow-[0_5px_5px_rgba(255,105,180,0.5)] stroke-white`}
                style={{
                    WebkitTextStroke: "2px white",
                    textShadow: "3px 3px 0px #ff6b6b"
                }}
            >
                My Kisah
            </motion.h1>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex items-center justify-center gap-2 md:gap-4"
            >
                <span className="h-px w-8 md:w-12 bg-white/30" />
                <p className={`${fredoka.className} text-xl sm:text-2xl md:text-4xl text-[#ffeb3b] font-bold tracking-wider drop-shadow-md`}
                   style={{
                       textShadow: "2px 2px 0px #f57f17",
                       WebkitTextStroke: "1px #fff"
                   }}
                >
                    Aseli Loh Ya
                </p>
                <span className="h-px w-8 md:w-12 bg-white/30" />
            </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 z-10 animate-bounce pointer-events-auto cursor-pointer group"
            onClick={() => {
                const gallery = document.getElementById('gallery');
                gallery?.scrollIntoView({ behavior: 'smooth' });
            }}
        >
            <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-slate-400 group-hover:text-soft-pink transition-colors">
                    Explore Shrine
                </span>
                <div className="w-6 h-10 border border-slate-600 rounded-full flex justify-center pt-2 group-hover:border-soft-pink transition-colors">
                    <div className="w-1 h-2 bg-slate-400 rounded-full animate-scroll group-hover:bg-soft-pink" />
                </div>
            </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="min-h-screen py-20 md:py-32 px-4 relative z-10 bg-gradient-to-b from-night-bg via-[#0f172a] to-night-bg">
        <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 md:mb-20"
            >
                <span className="text-soft-pink text-xs md:text-sm uppercase tracking-[0.2em] font-bold mb-2 md:mb-4 block">Collection</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 md:mb-6">The Sacred Archive</h2>
                <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-transparent via-deep-pink to-transparent mx-auto rounded-full opacity-70" />
            </motion.div>
            
            <WaifuGallery />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/40 backdrop-blur-lg text-center relative z-10">
        <div className="flex flex-col items-center gap-4">
            <h3 className="font-serif text-2xl text-white">My Kisah</h3>
            <p className="text-slate-500 text-sm font-sans max-w-md mx-auto px-4">
                A digital sanctuary crafted with love, Next.js, and Three.js. <br/>
                Dedicated to the art of 2D appreciation.
            </p>
            <p className="text-slate-600 text-xs mt-4">© 2026 My Kisah. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

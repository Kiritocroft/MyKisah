"use client";

import { useState, useRef } from "react";
import Scene from "./Scene";

export default function HeroSection() {
    const [bubbleMsg, setBubbleMsg] = useState("Welcome! ✨");
    const [isBubbleVisible, setIsBubbleVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCharacterClick = (msg: string) => {
        setBubbleMsg(msg);
        setIsBubbleVisible(true);
        
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsBubbleVisible(false);
        }, 3000);
    };

    return (
        <section className="h-[100dvh] w-full relative flex flex-col items-center justify-center overflow-hidden">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Scene onCharacterClick={handleCharacterClick} />
            </div>
            
            {/* Overlay Content */}
            <div 
                className="z-10 text-center pointer-events-none mt-[-5vh] md:mt-[-10vh] mix-blend-screen select-none relative px-4 flex flex-col items-center"
            >
                {/* Speech Bubble - Positioned above the text */}
                <div 
                    className={`
                        mb-14 -mt-14 transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform
                        ${isBubbleVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75'}
                    `}
                >
                     <div className="bg-white px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(255,105,180,0.6)] border-2 border-soft-pink text-slate-900 font-serif text-xl font-bold select-none relative max-w-xs md:max-w-md mx-auto">
                        {bubbleMsg}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-soft-pink transform rotate-45"></div>
                    </div>
                </div>

                {/* Decorative Line */}
                <div 
                    className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent via-soft-pink to-transparent mx-auto mb-4 md:mb-8 animate-scale-x scale-x-0"
                    style={{ animationDelay: "0.5s" }}
                />

                <h1 
                    className="font-display text-6xl sm:text-7xl md:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-[#ff9a9e] via-[#fecfef] to-[#ff9a9e] mb-4 md:mb-6 tracking-wide leading-none drop-shadow-[0_5px_5px_rgba(255,105,180,0.5)] stroke-white animate-hero-title"
                    style={{
                        WebkitTextStroke: "2px white",
                        textShadow: "3px 3px 0px #ff6b6b"
                    }}
                >
                    My Kisah
                </h1>
                
                <div
                    className="flex items-center justify-center gap-2 md:gap-4 animate-fade-in-up"
                    style={{ animationDelay: "1s" }}
                >
                    <span className="h-px w-8 md:w-12 bg-white/30" />
                    <p className="font-display text-xl sm:text-2xl md:text-4xl text-[#ffeb3b] font-bold tracking-wider drop-shadow-md"
                       style={{
                           textShadow: "2px 2px 0px #f57f17",
                           WebkitTextStroke: "1px #fff"
                       }}
                    >
                        Aseli Loh Ya
                    </p>
                    <span className="h-px w-8 md:w-12 bg-white/30" />
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <a 
                href="#gallery"
                className="absolute bottom-12 z-10 animate-bounce pointer-events-auto cursor-pointer group"
            >
                <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-slate-400 group-hover:text-soft-pink transition-colors">
                        Explore Shrine
                    </span>
                    <div className="w-6 h-10 border border-slate-600 rounded-full flex justify-center pt-2 group-hover:border-soft-pink transition-colors">
                        <div className="w-1 h-2 bg-slate-400 rounded-full animate-scroll group-hover:bg-soft-pink" />
                    </div>
                </div>
            </a>
        </section>
    );
}

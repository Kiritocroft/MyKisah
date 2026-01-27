import Scene from "@/components/Scene";
import WaifuGallery from "@/components/WaifuGallery";
import { getCharacters } from "@/app/actions/characters";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ 
  subsets: ["latin"], 
  weight: ["400", "600"],
  display: "swap"
});

export default async function Home() {
  const { characters } = await getCharacters();

  return (
    <main className="min-h-screen bg-night-bg relative overflow-x-hidden selection:bg-soft-pink selection:text-slate-900">
      
      {/* Hero Section */}
      <section className="h-[100dvh] w-full relative flex flex-col items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>
        
        {/* Overlay Content */}
        <div 
            className="z-10 text-center pointer-events-none mt-[-5vh] md:mt-[-10vh] mix-blend-screen select-none relative px-4"
        >
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

      {/* Gallery Section */}
      <WaifuGallery initialCharacters={characters} />

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

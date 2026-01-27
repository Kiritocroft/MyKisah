import HeroSection from "@/components/HeroSection";
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
      <HeroSection />

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

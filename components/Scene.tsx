"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Html, Preload } from "@react-three/drei";
import { Suspense } from "react";
import KaorukoModel from "./KaorukoModel";
import SakuraParticles from "./SakuraParticles";
import Effects from "./Effects";
import CosmicField from "./CosmicField";

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 backdrop-blur-md bg-black/30 p-6 rounded-xl border border-white/10">
        <div className="w-10 h-10 border-4 border-soft-pink border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white font-serif text-lg animate-pulse tracking-widest">
          SUMMONING...
        </div>
      </div>
    </Html>
  );
}

export default function Scene({ onCharacterClick }: { onCharacterClick?: (msg: string) => void }) {
  return (
    <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-black pointer-events-none">
      <div className="absolute inset-0 pointer-events-auto">
        <Canvas 
          camera={{ position: [0, 1, 6], fov: 45 }} 
          dpr={[1, 1.2]} 
          shadows={false}
          performance={{ min: 0.5 }}
          frameloop="always"
          gl={{ 
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false
          }}
        >
        <Suspense fallback={<Loader />}>
          {/* Fog adjusted to allow seeing stars and distant particles */}
          <fog attach="fog" args={['#020617', 10, 100]} />
          
          {/* Environment & Lighting */}
          <Environment preset="night" blur={0.8} background={false} />
          
          {/* Moon Light */}
          <spotLight 
            position={[10, 10, 5]} 
            angle={0.5} 
            penumbra={1} 
            intensity={2} 
            color="#a78bfa" 
            castShadow
            shadow-bias={-0.0001}
          />
          {/* Rim Light for character */}
          <pointLight position={[-5, 2, -5]} intensity={5} color="#db2777" />
          
          <CosmicField />
          
          {/* Main Content */}
          <KaorukoModel onCharacterClick={onCharacterClick} />
          <SakuraParticles />
          <Effects />
          
          {/* Ground Shadows - Optimized */}
          <ContactShadows 
            position={[0, -1.6, 0]} 
            opacity={0.6} 
            scale={15} 
            blur={2} 
            far={4} 
            color="#000"
            resolution={256}
            frames={1}
          />
          
          {/* Controls */}
          <OrbitControls 
            makeDefault
            enablePan={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Infinity}
            maxAzimuthAngle={Infinity}
            minDistance={4}
            maxDistance={8}
            enableZoom={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
          
          <Preload all />
        </Suspense>
      </Canvas>
      </div>
    </div>
  );
}

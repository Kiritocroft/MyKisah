"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Html, Stars } from "@react-three/drei";
import { Suspense } from "react";
import KaorukoModel from "./KaorukoModel";
import SakuraParticles from "./SakuraParticles";
import Effects from "./Effects";

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

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-night-bg via-[#1e1b4b] to-night-bg">
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }} dpr={[1, 2]} shadows>
        <Suspense fallback={<Loader />}>
          <fog attach="fog" args={['#020617', 5, 20]} />
          
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
          />
          {/* Rim Light for character */}
          <pointLight position={[-5, 2, -5]} intensity={5} color="#db2777" />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Main Content */}
          <KaorukoModel />
          <SakuraParticles />
          <Effects />
          
          {/* Ground Shadows */}
          <ContactShadows 
            position={[0, -1.6, 0]} 
            opacity={0.7} 
            scale={15} 
            blur={2.5} 
            far={4} 
            color="#000" 
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
            enableZoom={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

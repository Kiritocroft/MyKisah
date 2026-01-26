"use client";

import { useRef, useState } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

export default function KaorukoModel() {
  const { scene } = useGLTF("/kaoruko.glb");
  const [clicked, setClicked] = useState(false);
  const group = useRef<THREE.Group>(null);
  
  const messages = [
    "Ara ara~ 💕", 
    "Don't poke me! >///<", 
    "I'm watching you... 👀", 
    "Do you like cake? 🍰", 
    "Rintaro-kun? Is that you?", 
    "Headpats please! (⁠◕⁠ᴗ⁠◕⁠✿⁠)", 
    "Stop it, that tickles! hehe", 
    "My Kisah is real! ✨",
    "Ehh? Nani? 😲",
    "You're cute today! 💖"
  ];
  const [msg, setMsg] = useState("Ara ara~ 💕");

  const handleClick = (e: React.MouseEvent<THREE.Group>) => {
    e.stopPropagation();
    
    // Prevent spam clicking to avoid lag
    if (clicked) return;

    // Pick a random message
    const newMsg = messages[Math.floor(Math.random() * messages.length)];
    setMsg(newMsg);
    
    // Trigger animation
    setClicked(true);
    
    // Reset after delay
    setTimeout(() => setClicked(false), 2000);
  };

  useFrame((state) => {
    if (group.current) {
       // Gentle floating animation
       group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 1.5; 
       // Gentle rotation breathing
       group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group} onClick={handleClick} dispose={null}>
      <primitive object={scene} scale={2} />
      
      {/* Speech Bubble */}
      <Html position={[0, 2.2, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
         <AnimatePresence>
            {clicked && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl border-2 border-soft-pink text-slate-900 font-serif text-lg font-bold whitespace-nowrap select-none"
                >
                    {msg}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-soft-pink transform rotate-45"></div>
                </motion.div>
            )}
         </AnimatePresence>
      </Html>
    </group>
  );
}

useGLTF.preload("/kaoruko.glb");

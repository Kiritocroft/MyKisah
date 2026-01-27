"use client";

import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function KaorukoModel({ onCharacterClick }: { onCharacterClick?: (msg: string) => void }) {
  const { scene } = useGLTF("/kaoruko.glb");
  const isLocked = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<THREE.Group>) => {
    e.stopPropagation();
    
    // Prevent spam clicking
    if (isLocked.current) return;
    isLocked.current = true;

    // Pick a random message
    const newMsg = messages[Math.floor(Math.random() * messages.length)];
    
    // Notify parent
    if (onCharacterClick) {
        onCharacterClick(newMsg);
    }
    
    // Reset lock after delay
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      isLocked.current = false;
    }, 2000);
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
    <group ref={group} dispose={null}>
      {/* Hitbox for efficient raycasting - significantly reduces lag */}
      <mesh 
        visible={false} 
        position={[0, 1, 0]} 
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <capsuleGeometry args={[0.8, 2.5, 4, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Character Model - Ignore pointer events to prevent expensive raycasting */}
      <group>
        <primitive object={scene} scale={2} />
      </group>
    </group>
  );
}

useGLTF.preload("/kaoruko.glb");

"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 300; // Increased for better atmosphere

export default function SakuraParticles() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Use a ref for particles to avoid re-calculation during render and keep data stable
  const particlesRef = useRef<{ speed: number; xFactor: number; yFactor: number; zFactor: number; factor: number }[]>([]);

  // Initialize particles once on mount
  useEffect(() => {
      const temp = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
          const speed = 0.02 + Math.random() / 100;
          const xFactor = (Math.random() - 0.5) * 20;
          const yFactor = (Math.random() - 0.5) * 20 + 5;
          const zFactor = (Math.random() - 0.5) * 20;
          const factor = Math.random() * 10;
          temp.push({ speed, xFactor, yFactor, zFactor, factor });
      }
      particlesRef.current = temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current || particlesRef.current.length === 0) return;

    particlesRef.current.forEach((particle, i) => {
      // Fall down
      particle.yFactor -= particle.speed * 1.5; 
      
      // Reset height
      if (particle.yFactor < -5) {
          particle.yFactor = 10 + Math.random() * 5;
          particle.xFactor = (Math.random() - 0.5) * 20;
          particle.zFactor = (Math.random() - 0.5) * 20;
      }

      // Sway
      const time = state.clock.getElapsedTime();
      const swayX = Math.sin(time * 0.5 + particle.factor) * 0.5;
      const swayZ = Math.cos(time * 0.3 + particle.factor) * 0.5;

      dummy.position.set(
          particle.xFactor + swayX,
          particle.yFactor,
          particle.zFactor + swayZ
      );
      
      // Rotate petals
      dummy.rotation.set(
          time * 0.5 + particle.factor,
          time * 0.3 + particle.factor,
          time * 0.2 + particle.factor
      );
      
      const scale = 0.1 + Math.random() * 0.05;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, PARTICLE_COUNT]}>
      <planeGeometry args={[0.2, 0.2]} />
      {/* Emissive material for glow effect */}
      <meshStandardMaterial 
        color="#ffb7b2" 
        emissive="#ff69b4"
        emissiveIntensity={0.8}
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.9} 
        toneMapped={false}
      />
    </instancedMesh>
  );
}

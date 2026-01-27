"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";

type Particle = {
  t: number;
  factor: number;
  speed: number;
  xFactor: number;
  yFactor: number;
  zFactor: number;
  mx: number;
  my: number;
};

function FloatingDust({ count = 1000 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const temp: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      // Spread particles in a larger sphere/box to cover 360 degrees
      const xFactor = -100 + Math.random() * 200;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -100 + Math.random() * 200;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    particles.current = temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current || particles.current.length === 0) return;

    const { x, y } = state.pointer;
    
    particles.current.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      
      // Update time
      particle.t += speed / 2;
      const t = particle.t;

      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      // Interactive mouse repulsion/attraction
      particle.mx += (x * 10 - particle.mx) * 0.02;
      particle.my += (-y * 10 - particle.my) * 0.02;

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.setScalar(s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#c4b5fd" emissive="#a78bfa" emissiveIntensity={0.8} transparent opacity={0.9} />
    </instancedMesh>
  );
}

export default function CosmicField() {
  return (
    <group>
      {/* Deep Background Stars */}
      <Stars radius={200} depth={50} count={6000} factor={6} saturation={0.5} fade speed={0.5} />
      
      {/* Interactive Floating Dust */}
      <FloatingDust />
      
      {/* 360 Degree Ambient Glow Sphere */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[400, 64, 64]} />
        <meshBasicMaterial color="#020617" side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

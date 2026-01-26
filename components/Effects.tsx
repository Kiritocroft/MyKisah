"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function Effects() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom 
        luminanceThreshold={0.6} 
        mipmapBlur 
        intensity={0.6} 
        radius={0.4}
      />
      <Vignette 
        offset={0.5} 
        darkness={0.5} 
        eskil={false} 
        blendFunction={BlendFunction.NORMAL} 
      />
      {/* Noise removed for performance */}
    </EffectComposer>
  );
}

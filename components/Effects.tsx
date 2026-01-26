"use client";

import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function Effects() {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.5} 
        mipmapBlur 
        intensity={0.8} 
        radius={0.4}
      />
      <Vignette 
        offset={0.5} 
        darkness={0.6} 
        eskil={false} 
        blendFunction={BlendFunction.NORMAL} 
      />
      <Noise opacity={0.02} />
    </EffectComposer>
  );
}

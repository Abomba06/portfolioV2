"use client";

import { EffectComposer, Bloom, N8AO, Vignette } from "@react-three/postprocessing";

type SceneEffectsProps = {
  selectedZoneId: string | null;
  isLowPerformance: boolean;
};

export function SceneEffects({ selectedZoneId, isLowPerformance }: SceneEffectsProps) {
  if (isLowPerformance) {
    return null;
  }

  const intensity = selectedZoneId ? 1.25 : 0.8;

  return (
    <EffectComposer multisampling={2}>
      <N8AO aoRadius={2.2} intensity={1.4} distanceFalloff={0.55} />
      <Bloom
        intensity={intensity}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.28}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.18} darkness={0.4} />
    </EffectComposer>
  );
}

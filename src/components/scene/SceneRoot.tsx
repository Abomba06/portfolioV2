"use client";

import { Environment, Float, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { RocketModel } from "./rocket/RocketModel";
import { SceneLighting } from "./world/SceneLighting";

export function SceneRoot() {
  return (
    <>
      <SceneLighting />
      <Stars
        radius={120}
        depth={80}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.35}
      />
      <Sparkles
        count={180}
        size={2.1}
        speed={0.18}
        opacity={0.45}
        scale={[12, 18, 12]}
        color="#89d8ff"
      />
      <Float
        speed={1}
        rotationIntensity={0.15}
        floatIntensity={0.45}
        floatingRange={[-0.15, 0.2]}
      >
        <RocketModel />
      </Float>
      <Environment preset="night" />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={(Math.PI / 3.2) * 2}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

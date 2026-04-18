"use client";

import { Sparkles } from "@react-three/drei";

type DepthFieldProps = {
  isLowPerformance: boolean;
};

export function DepthField({ isLowPerformance }: DepthFieldProps) {
  return (
    <>
      <Sparkles
        count={isLowPerformance ? 35 : 80}
        size={isLowPerformance ? 1.2 : 1.6}
        speed={isLowPerformance ? 0.04 : 0.08}
        opacity={0.18}
        scale={[14, 20, 6]}
        position={[0, 0, -5]}
        color="#4e9dff"
      />
      <Sparkles
        count={isLowPerformance ? 28 : 70}
        size={isLowPerformance ? 1.4 : 1.9}
        speed={isLowPerformance ? 0.06 : 0.12}
        opacity={0.24}
        scale={[12, 18, 8]}
        position={[0, 0, -1.5]}
        color="#8ad8ff"
      />
      <Sparkles
        count={isLowPerformance ? 24 : 64}
        size={isLowPerformance ? 1.7 : 2.4}
        speed={isLowPerformance ? 0.08 : 0.16}
        opacity={0.2}
        scale={[11, 16, 4]}
        position={[0, 0, 2.5]}
        color="#9f7bff"
      />
    </>
  );
}

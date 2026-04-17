"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SceneRoot } from "@/components/scene/SceneRoot";
import { RocketZoneId } from "@/lib/rocketZones";

type ExperienceCanvasProps = {
  progress: number;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
  isLowPerformance: boolean;
  onHoverZone: (zoneId: RocketZoneId | null) => void;
  onSelectZone: (zoneId: RocketZoneId) => void;
};

export function ExperienceCanvas({
  progress,
  hoveredZoneId,
  selectedZoneId,
  isLowPerformance,
  onHoverZone,
  onSelectZone,
}: ExperienceCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 9], fov: 32 }}
      dpr={[1, 1.75]}
      gl={{ antialias: !isLowPerformance, alpha: true }}
    >
      <color attach="background" args={["#02050a"]} />
      <fog attach="fog" args={["#02050a", 12, 28]} />
      <Suspense fallback={null}>
        <SceneRoot
          progress={progress}
          hoveredZoneId={hoveredZoneId}
          selectedZoneId={selectedZoneId}
          isLowPerformance={isLowPerformance}
          onHoverZone={onHoverZone}
          onSelectZone={onSelectZone}
        />
      </Suspense>
    </Canvas>
  );
}

"use client";

import { Environment, Float, Sparkles, Stars } from "@react-three/drei";
import { getZoneForProgress, RocketZoneId } from "@/lib/rocketZones";
import { CameraRig } from "./camera/CameraRig";
import { RocketModel } from "./rocket/RocketModel";
import { RocketZones } from "./rocket/RocketZones";
import { SceneLighting } from "./world/SceneLighting";

type SceneRootProps = {
  progress: number;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
  onHoverZone: (zoneId: RocketZoneId | null) => void;
  onSelectZone: (zoneId: RocketZoneId) => void;
};

export function SceneRoot({
  progress,
  hoveredZoneId,
  selectedZoneId,
  onHoverZone,
  onSelectZone,
}: SceneRootProps) {
  const activeZone = getZoneForProgress(progress);

  return (
    <>
      <CameraRig progress={progress} />
      <SceneLighting progress={progress} activeZoneId={activeZone.id} />
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
        <group onPointerMissed={() => onHoverZone(null)}>
          <RocketModel
            progress={progress}
            activeZoneId={activeZone.id}
            hoveredZoneId={hoveredZoneId}
            selectedZoneId={selectedZoneId}
          />
          <RocketZones
            hoveredZoneId={hoveredZoneId}
            selectedZoneId={selectedZoneId}
            onHoverZone={onHoverZone}
            onSelectZone={onSelectZone}
          />
        </group>
      </Float>
      <Environment preset="night" />
    </>
  );
}

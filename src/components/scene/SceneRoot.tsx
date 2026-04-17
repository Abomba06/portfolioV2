"use client";

import { Environment, Float, Sparkles, Stars } from "@react-three/drei";
import { getZoneForProgress, RocketZoneId } from "@/lib/rocketZones";
import { CameraRig } from "./camera/CameraRig";
import { SubsystemChamber } from "./detail/SubsystemChamber";
import { SubsystemFocus } from "./detail/SubsystemFocus";
import { RocketModel } from "./rocket/RocketModel";
import { ZoneBeacons } from "./rocket/ZoneBeacons";
import { RocketZones } from "./rocket/RocketZones";
import { SceneEffects } from "./world/SceneEffects";
import { SceneLighting } from "./world/SceneLighting";

type SceneRootProps = {
  progress: number;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
  isLowPerformance: boolean;
  onHoverZone: (zoneId: RocketZoneId | null) => void;
  onSelectZone: (zoneId: RocketZoneId) => void;
};

export function SceneRoot({
  progress,
  hoveredZoneId,
  selectedZoneId,
  isLowPerformance,
  onHoverZone,
  onSelectZone,
}: SceneRootProps) {
  const activeZone = getZoneForProgress(progress);

  return (
    <>
      <CameraRig progress={progress} selectedZoneId={selectedZoneId} />
      <SceneLighting progress={progress} activeZoneId={activeZone.id} selectedZoneId={selectedZoneId} />
      <Stars
        radius={120}
        depth={80}
        count={isLowPerformance ? 2200 : 5000}
        factor={isLowPerformance ? 3 : 4}
        saturation={0}
        fade
        speed={isLowPerformance ? 0.18 : 0.35}
      />
      <Sparkles
        count={isLowPerformance ? 70 : 180}
        size={isLowPerformance ? 1.6 : 2.1}
        speed={isLowPerformance ? 0.08 : 0.18}
        opacity={isLowPerformance ? 0.28 : 0.45}
        scale={[12, 18, 12]}
        color="#89d8ff"
      />
      <Float
        speed={isLowPerformance ? 0.7 : 1}
        rotationIntensity={isLowPerformance ? 0.08 : 0.15}
        floatIntensity={isLowPerformance ? 0.28 : 0.45}
        floatingRange={isLowPerformance ? [-0.08, 0.12] : [-0.15, 0.2]}
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
          <ZoneBeacons
            hoveredZoneId={hoveredZoneId}
            selectedZoneId={selectedZoneId}
            isLowPerformance={isLowPerformance}
          />
          <SubsystemChamber selectedZoneId={selectedZoneId} isLowPerformance={isLowPerformance} />
          <SubsystemFocus selectedZoneId={selectedZoneId} />
        </group>
      </Float>
      <Environment preset="night" />
      <SceneEffects
        selectedZoneId={selectedZoneId}
        isLowPerformance={isLowPerformance}
      />
    </>
  );
}

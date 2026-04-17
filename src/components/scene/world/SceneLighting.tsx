"use client";

import { MathUtils } from "three";
import { ROCKET_ZONES, RocketZoneId } from "@/lib/rocketZones";

type SceneLightingProps = {
  progress: number;
  activeZoneId: RocketZoneId;
  selectedZoneId: RocketZoneId | null;
};

const zoneLightPositions: Record<RocketZoneId, [number, number, number]> = {
  noseVision: [1.4, 4.7, 1.4],
  upperBodyCoding: [1.2, 2.5, 1.6],
  coreAchievements: [1.5, 0.2, 1.5],
  lowerBodyEngineering: [1.4, -2.1, 1.4],
  thrustersDrive: [1.2, -4.1, 0.8],
};

export function SceneLighting({ progress, activeZoneId, selectedZoneId }: SceneLightingProps) {
  const accentIntensity = MathUtils.lerp(9, 17, progress);
  const focusZoneId = selectedZoneId ?? activeZoneId;
  const activeZone = ROCKET_ZONES.find((zone) => zone.id === focusZoneId) ?? ROCKET_ZONES[0];
  const detailBoost = selectedZoneId ? 1.4 : 1;

  return (
    <>
      <ambientLight intensity={0.46} color="#8ec3ff" />
      <hemisphereLight intensity={0.55} groundColor="#060b12" color="#b9dcff" />
      <directionalLight position={[6, 8, 5]} intensity={2.5} color="#c8e6ff" />
      <directionalLight position={[-5, -2, -6]} intensity={1.1} color="#5ea8ff" />
      <spotLight
        position={[0, -6, 6]}
        angle={0.45}
        penumbra={0.8}
        intensity={30}
        distance={30}
        color="#62c6ff"
      />
      <pointLight position={[0, -3.6, 1.2]} intensity={18} distance={10} color="#4fd4ff" />
      <pointLight position={[0, 4.8, 2.8]} intensity={10} distance={18} color="#d8efff" />
      <pointLight position={[-3.2, 0.4, 3.4]} intensity={8} distance={15} color="#5a9fff" />
      <pointLight
        position={zoneLightPositions[activeZone.id]}
        intensity={accentIntensity * detailBoost}
        distance={selectedZoneId ? 10 : 8}
        color={activeZone.lightColor}
      />
    </>
  );
}

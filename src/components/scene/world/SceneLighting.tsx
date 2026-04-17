"use client";

import { MathUtils } from "three";
import { ROCKET_ZONES, RocketZoneId } from "@/lib/rocketZones";

type SceneLightingProps = {
  progress: number;
  activeZoneId: RocketZoneId;
};

const zoneLightPositions: Record<RocketZoneId, [number, number, number]> = {
  noseVision: [1.4, 4.7, 1.4],
  upperBodyCoding: [1.2, 2.5, 1.6],
  coreAchievements: [1.5, 0.2, 1.5],
  lowerBodyEngineering: [1.4, -2.1, 1.4],
  thrustersDrive: [1.2, -4.1, 0.8],
};

export function SceneLighting({ progress, activeZoneId }: SceneLightingProps) {
  const accentIntensity = MathUtils.lerp(9, 17, progress);
  const activeZone = ROCKET_ZONES.find((zone) => zone.id === activeZoneId) ?? ROCKET_ZONES[0];

  return (
    <>
      <ambientLight intensity={0.35} color="#7bb7ff" />
      <directionalLight position={[6, 8, 5]} intensity={2.2} color="#c8e6ff" />
      <directionalLight position={[-5, -2, -6]} intensity={0.9} color="#5ea8ff" />
      <spotLight
        position={[0, -6, 6]}
        angle={0.45}
        penumbra={0.8}
        intensity={25}
        distance={30}
        color="#62c6ff"
      />
      <pointLight position={[0, -3.6, 1.2]} intensity={18} distance={10} color="#4fd4ff" />
      <pointLight
        position={zoneLightPositions[activeZone.id]}
        intensity={accentIntensity}
        distance={8}
        color={activeZone.lightColor}
      />
    </>
  );
}

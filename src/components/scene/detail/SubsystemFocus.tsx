"use client";

import { Float, Sparkles } from "@react-three/drei";
import { RocketZoneId, ROCKET_ZONES } from "@/lib/rocketZones";

type SubsystemFocusProps = {
  selectedZoneId: RocketZoneId | null;
};

const focusAnchors: Record<RocketZoneId, [number, number, number]> = {
  noseVision: [0.1, 4.1, 0],
  upperBodyCoding: [0.1, 2.35, 0],
  coreAchievements: [0.05, 0.45, 0],
  lowerBodyEngineering: [0, -1.9, 0],
  thrustersDrive: [0, -3.35, 0],
};

export function SubsystemFocus({ selectedZoneId }: SubsystemFocusProps) {
  if (!selectedZoneId) {
    return null;
  }

  const zone = ROCKET_ZONES.find((entry) => entry.id === selectedZoneId) ?? ROCKET_ZONES[0];
  const position = focusAnchors[selectedZoneId];

  return (
    <Float speed={1.3} rotationIntensity={0.14} floatIntensity={0.3}>
      <group position={position}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.03, 20, 96]} />
          <meshBasicMaterial color={zone.lightColor} transparent opacity={0.95} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} scale={[1.05, 1.45, 1]}>
          <torusGeometry args={[1.05, 0.02, 18, 72]} />
          <meshBasicMaterial color="#d8f7ff" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.18, 0, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshBasicMaterial color={zone.lightColor} transparent opacity={0.85} />
        </mesh>
        <Sparkles
          count={42}
          size={3}
          scale={[2.4, 1.8, 2.4]}
          speed={0.35}
          opacity={0.8}
          color={zone.lightColor}
        />
      </group>
    </Float>
  );
}

"use client";

import { Float } from "@react-three/drei";
import { RocketZoneId, ROCKET_ZONES } from "@/lib/rocketZones";

type SubsystemChamberProps = {
  selectedZoneId: RocketZoneId | null;
  isLowPerformance: boolean;
};

const chamberAnchors: Record<RocketZoneId, [number, number, number]> = {
  noseVision: [0.05, 4.15, -0.1],
  upperBodyCoding: [0.1, 2.3, -0.1],
  coreAchievements: [0.05, 0.45, -0.1],
  lowerBodyEngineering: [0, -1.85, -0.1],
  thrustersDrive: [0, -3.35, -0.15],
};

function VisionChamber({ color }: { color: string }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} scale={[1.2, 1.7, 1]}>
        <torusGeometry args={[1.42, 0.05, 24, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.42]} scale={[1.4, 1.8, 0.2]}>
        <cylinderGeometry args={[0.92, 0.92, 0.36, 32, 1, true]} />
        <meshBasicMaterial color="#dff6ff" transparent opacity={0.08} wireframe />
      </mesh>
    </group>
  );
}

function CodingChamber({ color }: { color: string }) {
  return (
    <group>
      {[-0.8, 0, 0.8].map((x) => (
        <mesh key={x} position={[x, 0, -0.35]} scale={[0.32, 0.9, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.55]} rotation={[0, 0, Math.PI / 2]}>
        <ringGeometry args={[1.05, 1.24, 48]} />
        <meshBasicMaterial color="#d9fbff" transparent opacity={0.16} side={2} />
      </mesh>
    </group>
  );
}

function CoreChamber({ color }: { color: string }) {
  return (
    <group>
      {[-0.6, 0, 0.6].map((x) => (
        <mesh key={x} position={[x, 0, -0.28]}>
          <cylinderGeometry args={[0.12, 0.12, 1.65, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.24} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.03, 18, 84]} />
        <meshBasicMaterial color="#e3f7ff" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function EngineeringChamber({ color }: { color: string }) {
  return (
    <group>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0, -0.25]} rotation={[0.45, 0, 0]}>
          <boxGeometry args={[0.24, 1.75, 0.24]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} />
        </mesh>
      ))}
      <mesh position={[0, -0.2, -0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.04, 20, 84]} />
        <meshBasicMaterial color="#dff6ff" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function DriveChamber({ color }: { color: string }) {
  return (
    <group>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((rotation) => (
        <mesh
          key={rotation}
          position={[Math.cos(rotation) * 0.72, Math.sin(rotation) * 0.42, -0.38]}
          rotation={[0, 0, rotation]}
        >
          <coneGeometry args={[0.18, 0.82, 18]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.55]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshBasicMaterial color="#d9fbff" transparent opacity={0.52} />
      </mesh>
    </group>
  );
}

function ChamberGeometry({ zoneId, color }: { zoneId: RocketZoneId; color: string }) {
  switch (zoneId) {
    case "noseVision":
      return <VisionChamber color={color} />;
    case "upperBodyCoding":
      return <CodingChamber color={color} />;
    case "coreAchievements":
      return <CoreChamber color={color} />;
    case "lowerBodyEngineering":
      return <EngineeringChamber color={color} />;
    case "thrustersDrive":
      return <DriveChamber color={color} />;
    default:
      return null;
  }
}

export function SubsystemChamber({ selectedZoneId, isLowPerformance }: SubsystemChamberProps) {
  if (!selectedZoneId) {
    return null;
  }

  const zone = ROCKET_ZONES.find((entry) => entry.id === selectedZoneId) ?? ROCKET_ZONES[0];

  return (
    <Float
      speed={isLowPerformance ? 0.7 : 1.1}
      rotationIntensity={isLowPerformance ? 0.05 : 0.12}
      floatIntensity={isLowPerformance ? 0.12 : 0.22}
    >
      <group position={chamberAnchors[selectedZoneId]}>
        <ChamberGeometry zoneId={selectedZoneId} color={zone.lightColor} />
      </group>
    </Float>
  );
}

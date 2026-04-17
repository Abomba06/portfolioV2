"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, MeshBasicMaterial } from "three";
import { RocketZoneId, ROCKET_ZONES } from "@/lib/rocketZones";

type SubsystemChamberProps = {
  selectedZoneId: RocketZoneId | null;
  isLowPerformance: boolean;
};

type ChamberVisualProps = {
  color: string;
  isLowPerformance: boolean;
};

const chamberAnchors: Record<RocketZoneId, [number, number, number]> = {
  noseVision: [0.05, 4.15, -0.1],
  upperBodyCoding: [0.1, 2.3, -0.1],
  coreAchievements: [0.05, 0.45, -0.1],
  lowerBodyEngineering: [0, -1.85, -0.1],
  thrustersDrive: [0, -3.35, -0.15],
};

function AnimatedCluster({
  children,
  speed = 0.35,
  amplitude = 0.12,
}: {
  children: React.ReactNode;
  speed?: number;
  amplitude?: number;
}) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.z = Math.sin(t) * amplitude;
    ref.current.rotation.x = Math.cos(t * 0.7) * amplitude * 0.4;
  });

  return <group ref={ref}>{children}</group>;
}

function RadialStruts({
  count,
  radius,
  depth,
  color,
  width = 0.08,
  height = 1.8,
}: {
  count: number;
  radius: number;
  depth: number;
  color: string;
  width?: number;
  height?: number;
}) {
  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const rotation = (index / count) * Math.PI * 2;

        return (
          <mesh
            key={rotation}
            position={[Math.cos(rotation) * radius, Math.sin(rotation) * radius * 0.65, depth]}
            rotation={[0, 0, rotation]}
          >
            <boxGeometry args={[width, height, 0.08]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

function HaloStack({
  color,
  layers,
  baseRadius,
  depthStart,
}: {
  color: string;
  layers: number;
  baseRadius: number;
  depthStart: number;
}) {
  return (
    <group>
      {Array.from({ length: layers }, (_, index) => {
        const radius = baseRadius + index * 0.14;
        const depth = depthStart - index * 0.12;

        return (
          <mesh key={`${radius}-${depth}`} position={[0, 0, depth]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.022 + index * 0.004, 18, 72]} />
            <meshBasicMaterial color={index % 2 === 0 ? color : "#dff7ff"} transparent opacity={0.18 + index * 0.05} />
          </mesh>
        );
      })}
    </group>
  );
}

function PanelWall({
  count,
  color,
  y = 0,
  z = -0.42,
}: {
  count: number;
  color: string;
  y?: number;
  z?: number;
}) {
  const span = count === 1 ? [0] : Array.from({ length: count }, (_, index) => -1 + (2 / (count - 1)) * index);

  return (
    <group>
      {span.map((x, index) => (
        <group key={`${x}-${index}`} position={[x, y, z]}>
          <mesh scale={[0.34, 1, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={color} transparent opacity={0.22} />
          </mesh>
          <mesh position={[0, 0, 0.03]} scale={[0.28, 0.74, 0.01]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#dff8ff" transparent opacity={0.14} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CableRun({
  color,
  points,
}: {
  color: string;
  points: Array<[number, number, number]>;
}) {
  return (
    <group>
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        const mid: [number, number, number] = [
          (point[0] + next[0]) / 2,
          (point[1] + next[1]) / 2,
          (point[2] + next[2]) / 2,
        ];
        const dx = next[0] - point[0];
        const dy = next[1] - point[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        return (
          <mesh key={`${index}-${length}`} position={mid} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.018, 0.018, Math.max(length, 0.001), 10]} />
            <meshBasicMaterial color={color} transparent opacity={0.22} />
          </mesh>
        );
      })}
    </group>
  );
}

function VisionChamber({ color, isLowPerformance }: ChamberVisualProps) {
  return (
    <group>
      <HaloStack color={color} layers={isLowPerformance ? 3 : 5} baseRadius={1.05} depthStart={-0.18} />
      <RadialStruts count={isLowPerformance ? 4 : 8} radius={1.18} depth={-0.36} color={color} width={0.05} height={2.15} />
      <mesh position={[0, 0, -0.68]} scale={[1.4, 1.9, 0.25]}>
        <cylinderGeometry args={[0.92, 0.92, 0.4, 36, 1, true]} />
        <meshBasicMaterial color="#dff6ff" transparent opacity={0.08} wireframe />
      </mesh>
      {!isLowPerformance ? (
        <AnimatedCluster speed={0.28} amplitude={0.08}>
          <mesh position={[0.1, 0.1, -0.22]}>
            <octahedronGeometry args={[0.22, 2]} />
            <meshBasicMaterial color="#ebfbff" transparent opacity={0.5} />
          </mesh>
        </AnimatedCluster>
      ) : null}
    </group>
  );
}

function CodingChamber({ color, isLowPerformance }: ChamberVisualProps) {
  return (
    <group>
      <PanelWall count={isLowPerformance ? 3 : 5} color={color} z={-0.42} />
      <PanelWall count={isLowPerformance ? 2 : 4} color="#c4f3ff" y={-0.72} z={-0.48} />
      <HaloStack color={color} layers={isLowPerformance ? 2 : 4} baseRadius={1.02} depthStart={-0.62} />
      <CableRun color={color} points={[[-1.1, 0.72, -0.24], [-0.5, 0.42, -0.32], [0.2, 0.56, -0.36], [1, 0.22, -0.28]]} />
      {!isLowPerformance ? <RadialStruts count={6} radius={1.08} depth={-0.26} color={color} width={0.04} height={1.55} /> : null}
    </group>
  );
}

function CoreChamber({ color, isLowPerformance }: ChamberVisualProps) {
  return (
    <group>
      {[-0.72, -0.24, 0.24, 0.72].map((x, index) => (
        <group key={`${x}-${index}`} position={[x, 0, -0.25]}>
          <mesh>
            <cylinderGeometry args={[0.11, 0.11, 1.75, 16]} />
            <meshBasicMaterial color={index % 2 === 0 ? color : "#dff7ff"} transparent opacity={0.26} />
          </mesh>
          {!isLowPerformance ? (
            <mesh position={[0, 0.54, 0]}>
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshBasicMaterial color="#eefbff" transparent opacity={0.24} />
            </mesh>
          ) : null}
        </group>
      ))}
      <HaloStack color={color} layers={isLowPerformance ? 3 : 4} baseRadius={1.1} depthStart={-0.48} />
      <mesh position={[0, -0.04, -0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.86, 1.26, 56]} />
        <meshBasicMaterial color="#dff7ff" transparent opacity={0.16} side={2} />
      </mesh>
    </group>
  );
}

function EngineeringChamber({ color, isLowPerformance }: ChamberVisualProps) {
  return (
    <group>
      <RadialStruts count={isLowPerformance ? 4 : 6} radius={0.98} depth={-0.22} color={color} width={0.11} height={1.9} />
      <CableRun color={color} points={[[-1.1, 0.88, -0.18], [-0.68, 0.18, -0.28], [-0.2, -0.42, -0.36], [0.42, -0.1, -0.28], [1.08, 0.62, -0.22]]} />
      <mesh position={[0, -0.2, -0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.05, 20, 84]} />
        <meshBasicMaterial color="#dff6ff" transparent opacity={0.18} />
      </mesh>
      {!isLowPerformance ? (
        <group>
          {[-0.9, 0.9].map((x) => (
            <mesh key={x} position={[x, -0.1, -0.32]} rotation={[0.52, 0, 0]}>
              <boxGeometry args={[0.24, 1.45, 0.18]} />
              <meshBasicMaterial color={color} transparent opacity={0.18} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
}

function DriveChamber({ color, isLowPerformance }: ChamberVisualProps) {
  const thrusterCount = isLowPerformance ? 3 : 6;

  return (
    <group>
      <AnimatedCluster speed={0.42} amplitude={0.11}>
        <group>
          {Array.from({ length: thrusterCount }, (_, index) => {
            const rotation = (index / thrusterCount) * Math.PI * 2;

            return (
              <mesh
                key={rotation}
                position={[Math.cos(rotation) * 0.82, Math.sin(rotation) * 0.52, -0.36]}
                rotation={[0, 0, rotation]}
              >
                <coneGeometry args={[0.16, 0.86, 18]} />
                <meshBasicMaterial color={color} transparent opacity={0.28} />
              </mesh>
            );
          })}
        </group>
      </AnimatedCluster>
      <HaloStack color={color} layers={isLowPerformance ? 2 : 4} baseRadius={0.64} depthStart={-0.46} />
      <mesh position={[0, 0, -0.56]}>
        <sphereGeometry args={[0.3, 28, 28]} />
        <meshBasicMaterial color="#d9fbff" transparent opacity={0.58} />
      </mesh>
      {!isLowPerformance ? <RadialStruts count={6} radius={0.68} depth={-0.18} color={color} width={0.05} height={1.1} /> : null}
    </group>
  );
}

function ChamberGeometry({ zoneId, color, isLowPerformance }: { zoneId: RocketZoneId; color: string; isLowPerformance: boolean }) {
  switch (zoneId) {
    case "noseVision":
      return <VisionChamber color={color} isLowPerformance={isLowPerformance} />;
    case "upperBodyCoding":
      return <CodingChamber color={color} isLowPerformance={isLowPerformance} />;
    case "coreAchievements":
      return <CoreChamber color={color} isLowPerformance={isLowPerformance} />;
    case "lowerBodyEngineering":
      return <EngineeringChamber color={color} isLowPerformance={isLowPerformance} />;
    case "thrustersDrive":
      return <DriveChamber color={color} isLowPerformance={isLowPerformance} />;
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
        <ChamberGeometry zoneId={selectedZoneId} color={zone.lightColor} isLowPerformance={isLowPerformance} />
      </group>
    </Float>
  );
}

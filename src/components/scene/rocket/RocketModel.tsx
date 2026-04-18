"use client";

import { Line } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh } from "three";
import { ROCKET_ZONES, RocketZoneId } from "@/lib/rocketZones";

type RocketModelProps = ThreeElements["group"] & {
  progress: number;
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
};

type NodePoint = {
  position: [number, number, number];
  scale: number;
};

type ConnectionPair = readonly [[number, number, number], [number, number, number]];

const zoneAnchors: Record<RocketZoneId, [number, number, number]> = {
  noseVision: [0, 4.25, 0],
  upperBodyCoding: [0.1, 2.35, -0.2],
  coreAchievements: [0, 0.35, 0],
  lowerBodyEngineering: [-0.05, -2.05, -0.18],
  thrustersDrive: [0, -3.55, -0.16],
};

function getZoneColor(zoneId: RocketZoneId) {
  return ROCKET_ZONES.find((zone) => zone.id === zoneId)?.lightColor ?? "#7cc7ff";
}

function isZoneEmphasized(
  zoneId: RocketZoneId,
  activeZoneId: RocketZoneId,
  hoveredZoneId: RocketZoneId | null,
  selectedZoneId: RocketZoneId | null,
) {
  return zoneId === activeZoneId || zoneId === hoveredZoneId || zoneId === selectedZoneId;
}

function createRadialNodes(
  count: number,
  radius: number,
  center: [number, number, number],
  xScale = 1,
  yScale = 0.7,
  zVariance = 0.25,
): NodePoint[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return {
      position: [
        center[0] + Math.cos(angle) * radius * xScale,
        center[1] + Math.sin(angle) * radius * yScale,
        center[2] + Math.sin(angle * 1.7) * zVariance,
      ],
      scale: 0.07 + (index % 3) * 0.02,
    };
  });
}

function connectionPairs(points: NodePoint[], step = 1) {
  return points.map((point, index) => [point.position, points[(index + step) % points.length].position] as const);
}

function interpolatePoint(pair: ConnectionPair, t: number): [number, number, number] {
  const [start, end] = pair;

  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
    start[2] + (end[2] - start[2]) * t,
  ];
}

function OrbitingArc({
  position,
  color,
  radius,
  speed,
  tilt,
  opacity,
  arc = Math.PI * 1.35,
}: {
  position: [number, number, number];
  color: string;
  radius: number;
  speed: number;
  tilt: [number, number, number];
  opacity: number;
  arc?: number;
}) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.z = clock.getElapsedTime() * speed;
  });

  return (
    <group ref={ref} position={position} rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.02, 18, 72, arc]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function EnergyNode({
  position,
  scale,
  color,
  opacity,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
}) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 14, 14]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function EnergyPulses({
  zoneId,
  connections,
  emphasized,
}: {
  zoneId: RocketZoneId;
  connections: ConnectionPair[];
  emphasized: boolean;
}) {
  const color = getZoneColor(zoneId);
  const pulseCount = Math.min(connections.length, emphasized ? 7 : 4);
  const offsets = useMemo(
    () => Array.from({ length: pulseCount }, (_, index) => ((index * 0.19) % 1)),
    [pulseCount],
  );
  const meshesRef = useRef<(Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    offsets.forEach((offset, index) => {
      const mesh = meshesRef.current[index];
      const pair = connections[index % connections.length];
      if (!mesh || !pair) {
        return;
      }

      const travel = (t * (emphasized ? 0.55 : 0.3) + offset) % 1;
      const point = interpolatePoint(pair, travel);
      mesh.position.set(point[0], point[1], point[2]);
      const scale = emphasized ? 0.09 : 0.06;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group>
      {offsets.map((offset, index) => (
        <mesh
          key={`${zoneId}-pulse-${offset}`}
          ref={(element) => {
            meshesRef.current[index] = element;
          }}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color={color} transparent opacity={emphasized ? 0.95 : 0.65} />
        </mesh>
      ))}
    </group>
  );
}

function VisionCore({
  activeZoneId,
  hoveredZoneId,
  selectedZoneId,
}: {
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
}) {
  const ref = useRef<Mesh>(null);
  const color = getZoneColor("noseVision");
  const emphasized = isZoneEmphasized("noseVision", activeZoneId, hoveredZoneId, selectedZoneId);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    const scale = 1 + Math.sin(clock.getElapsedTime() * 1.1) * 0.04;
    ref.current.scale.setScalar(scale);
  });

  return (
    <group position={zoneAnchors.noseVision}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.58, 40, 40]} />
        <meshBasicMaterial color={color} transparent opacity={emphasized ? 0.96 : 0.78} />
      </mesh>
      <mesh scale={[2.4, 2.4, 2.4]}>
        <sphereGeometry args={[0.58, 22, 22]} />
        <meshBasicMaterial color={color} transparent opacity={emphasized ? 0.08 : 0.04} />
      </mesh>
      <OrbitingArc
        position={[0, 0, 0]}
        color={color}
        radius={1.15}
        speed={0.08}
        tilt={[Math.PI / 2, 0.2, 0]}
        opacity={0.24}
        arc={Math.PI * 1.7}
      />
      <OrbitingArc
        position={[0, 0, 0]}
        color="#dff8ff"
        radius={1.5}
        speed={-0.05}
        tilt={[0.3, 0.6, Math.PI / 2]}
        opacity={0.12}
        arc={Math.PI * 1.35}
      />
    </group>
  );
}

function CodingField({
  activeZoneId,
  hoveredZoneId,
  selectedZoneId,
}: {
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
}) {
  const color = getZoneColor("upperBodyCoding");
  const emphasized = isZoneEmphasized("upperBodyCoding", activeZoneId, hoveredZoneId, selectedZoneId);
  const groupRef = useRef<Group>(null);
  const layerA = useMemo(() => createRadialNodes(12, 1.1, [0.1, 2.35, -0.3], 1.25, 0.56, 0.32), []);
  const layerB = useMemo(() => createRadialNodes(9, 0.72, [0.08, 2.15, -0.82], 0.95, 0.85, 0.22), []);
  const layerC = useMemo(() => createRadialNodes(7, 0.52, [0.1, 2.55, 0.3], 0.8, 0.6, 0.18), []);
  const connectionsA = useMemo(() => connectionPairs(layerA), [layerA]);
  const connectionsB = useMemo(() => connectionPairs(layerB, 2), [layerB]);
  const connectionsC = useMemo(() => connectionPairs(layerC), [layerC]);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.28) * 0.06;
    groupRef.current.position.x = Math.sin(t * 0.4) * 0.05;
  });

  const opacity = emphasized ? 0.92 : activeZoneId === "upperBodyCoding" ? 0.72 : 0.4;

  return (
    <group ref={groupRef}>
      {[connectionsA, connectionsB, connectionsC].map((connections, layerIndex) =>
        connections.map(([start, end], index) => (
          <Line
            key={`coding-${layerIndex}-${index}`}
            points={[start, end]}
            color={color}
            transparent
            opacity={opacity * (0.42 - layerIndex * 0.08)}
            lineWidth={emphasized ? 1.5 : 1}
          />
        )),
      )}
      <EnergyPulses zoneId="upperBodyCoding" connections={[...connectionsA, ...connectionsB, ...connectionsC]} emphasized={emphasized} />
      {[...layerA, ...layerB, ...layerC].map((node, index) => (
        <EnergyNode
          key={`coding-node-${index}`}
          position={node.position}
          scale={node.scale}
          color={color}
          opacity={opacity}
        />
      ))}
      <OrbitingArc
        position={zoneAnchors.upperBodyCoding}
        color={color}
        radius={1.38}
        speed={0.22}
        tilt={[Math.PI / 2, 0, 0.4]}
        opacity={0.18}
      />
    </group>
  );
}

function EngineeringField({
  activeZoneId,
  hoveredZoneId,
  selectedZoneId,
}: {
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
}) {
  const color = getZoneColor("lowerBodyEngineering");
  const emphasized = isZoneEmphasized("lowerBodyEngineering", activeZoneId, hoveredZoneId, selectedZoneId);
  const sliderRefs = useRef<(Group | null)[]>([]);
  const opacity = emphasized ? 0.9 : activeZoneId === "lowerBodyEngineering" ? 0.68 : 0.34;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    sliderRefs.current.forEach((group, index) => {
      if (!group) {
        return;
      }

      group.position.y = Math.sin(t * 0.65 + index) * 0.22;
      group.rotation.z = Math.sin(t * 0.4 + index) * 0.03;
    });
  });

  return (
    <group position={zoneAnchors.lowerBodyEngineering}>
      {[-1.2, 0, 1.2].map((x, index) => (
        <group
          key={`engineering-column-${x}`}
          ref={(element) => {
            sliderRefs.current[index] = element;
          }}
          position={[x, 0, -0.32]}
        >
          <mesh scale={[0.16, 1.45, 0.16]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={color} transparent opacity={opacity * 0.55} />
          </mesh>
          <mesh position={[0, 0, 0.14]} scale={[0.24, 0.2, 0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#dff8ff" transparent opacity={opacity * 0.4} />
          </mesh>
        </group>
      ))}
      {[-1.3, 1.3].map((x) => (
        <mesh key={`engineering-frame-${x}`} position={[x, 0, -0.52]} scale={[0.14, 2.25, 0.14]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.38} />
        </mesh>
      ))}
      {[-0.7, 0.7].map((x) => (
        <mesh key={`engineering-arm-${x}`} position={[x, -0.35, -0.35]} rotation={[0.35, 0, 0]} scale={[0.18, 1.6, 0.18]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.42} />
        </mesh>
      ))}
      <Line
        points={[
          [-1.38, 1.05, -0.48],
          [1.38, 1.05, -0.48],
          [1.38, -1.05, -0.48],
          [-1.38, -1.05, -0.48],
          [-1.38, 1.05, -0.48],
        ]}
        color={color}
        transparent
        opacity={opacity * 0.42}
        lineWidth={1}
      />
      <OrbitingArc
        position={[0, 0, -0.05]}
        color={color}
        radius={1.1}
        speed={0.05}
        tilt={[Math.PI / 2, 0.12, Math.PI / 4]}
        opacity={0.1}
        arc={Math.PI}
      />
    </group>
  );
}

function AchievementField({
  activeZoneId,
  hoveredZoneId,
  selectedZoneId,
}: {
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
}) {
  const color = getZoneColor("coreAchievements");
  const emphasized = isZoneEmphasized("coreAchievements", activeZoneId, hoveredZoneId, selectedZoneId);
  const ringsRef = useRef<Group>(null);
  const opacity = emphasized ? 0.88 : activeZoneId === "coreAchievements" ? 0.66 : 0.34;

  useFrame(({ clock }) => {
    if (!ringsRef.current) {
      return;
    }

    const t = clock.getElapsedTime();
    ringsRef.current.rotation.z = Math.sin(t * 0.22) * 0.08;
    ringsRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.02);
  });

  return (
    <group ref={ringsRef} position={zoneAnchors.coreAchievements}>
      {[0.7, 1.02, 1.34, 1.68].map((radius, index) => (
        <mesh
          key={`achievement-ring-${radius}`}
          rotation={[Math.PI / 2, index * 0.18, index * 0.26]}
          scale={[1, 0.72 + index * 0.1, 1]}
        >
          <torusGeometry args={[radius, 0.028 + index * 0.004, 18, 72]} />
          <meshBasicMaterial color={index % 2 === 0 ? color : "#dff8ff"} transparent opacity={opacity * (0.78 - index * 0.12)} />
        </mesh>
      ))}
      {[-1.1, -0.35, 0.35, 1.1].map((x, index) => (
        <mesh key={`achievement-band-${x}`} position={[x, 0, -0.28]} scale={[0.15, 1.25 + index * 0.12, 0.15]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={index % 2 === 0 ? color : "#dff8ff"} transparent opacity={opacity * 0.28} />
        </mesh>
      ))}
    </group>
  );
}

function DriveField({
  activeZoneId,
  hoveredZoneId,
  selectedZoneId,
}: {
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
}) {
  const color = getZoneColor("thrustersDrive");
  const emphasized = isZoneEmphasized("thrustersDrive", activeZoneId, hoveredZoneId, selectedZoneId);
  const trailRefs = useRef<(Mesh | null)[]>([]);
  const opacity = emphasized ? 0.95 : activeZoneId === "thrustersDrive" ? 0.74 : 0.38;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    trailRefs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      mesh.position.y = -4.1 - ((t * (emphasized ? 2.8 : 1.8) + index * 0.24) % 1.6);
      mesh.scale.set(0.08 + index * 0.02, emphasized ? 0.55 : 0.38, 0.08);
    });
  });

  return (
    <group position={zoneAnchors.thrustersDrive}>
      {[-0.48, 0, 0.48].map((x, index) => (
        <mesh key={`drive-stream-${x}`} position={[x, -0.35, -0.3]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.15 + index * 0.02, 1.8, 16]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * (0.5 + index * 0.12)} />
        </mesh>
      ))}
      {[-0.52, -0.18, 0.18, 0.52].map((x, index) => (
        <mesh
          key={`drive-particle-${x}`}
          ref={(element) => {
            trailRefs.current[index] = element;
          }}
          position={[x, -4.2, -0.45]}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color="#dff8ff" transparent opacity={opacity * 0.75} />
        </mesh>
      ))}
      <mesh position={[0, -1.15, -0.55]} scale={[1.3, 2.8, 0.9]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.12} />
      </mesh>
    </group>
  );
}

function Label() {
  return null;
}

export function RocketModel({
  activeZoneId,
  hoveredZoneId,
  selectedZoneId,
  ...groupProps
}: RocketModelProps) {
  return (
    <group {...groupProps}>
      <group position={[0, 0.25, -0.15]}>
        <VisionCore
          activeZoneId={activeZoneId}
          hoveredZoneId={hoveredZoneId}
          selectedZoneId={selectedZoneId}
        />
        <CodingField
          activeZoneId={activeZoneId}
          hoveredZoneId={hoveredZoneId}
          selectedZoneId={selectedZoneId}
        />
        <AchievementField
          activeZoneId={activeZoneId}
          hoveredZoneId={hoveredZoneId}
          selectedZoneId={selectedZoneId}
        />
        <EngineeringField
          activeZoneId={activeZoneId}
          hoveredZoneId={hoveredZoneId}
          selectedZoneId={selectedZoneId}
        />
        <DriveField
          activeZoneId={activeZoneId}
          hoveredZoneId={hoveredZoneId}
          selectedZoneId={selectedZoneId}
        />

        {[
          ["noseVision", "upperBodyCoding"],
          ["upperBodyCoding", "coreAchievements"],
          ["coreAchievements", "lowerBodyEngineering"],
          ["lowerBodyEngineering", "thrustersDrive"],
        ].map(([startId, endId], index) => (
          <Line
            key={`spine-${index}`}
            points={[zoneAnchors[startId as RocketZoneId], zoneAnchors[endId as RocketZoneId]]}
            color="#8bd7ff"
            transparent
            opacity={0.12}
            lineWidth={1}
          />
        ))}
      </group>
      <Label />
    </group>
  );
}

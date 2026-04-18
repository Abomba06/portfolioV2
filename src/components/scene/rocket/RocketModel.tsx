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
  lowerBodyEngineering: [-0.1, -2.05, -0.15],
  thrustersDrive: [0, -3.55, -0.1],
};

function getZoneColor(zoneId: RocketZoneId) {
  return ROCKET_ZONES.find((zone) => zone.id === zoneId)?.lightColor ?? "#7cc7ff";
}

function createRadialNodes(
  count: number,
  radius: number,
  y: number,
  zOffset: number,
  xScale = 1,
  yScale = 0.7,
): NodePoint[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return {
      position: [
        Math.cos(angle) * radius * xScale,
        y + Math.sin(angle) * radius * yScale,
        zOffset + Math.sin(angle * 1.7) * 0.35,
      ],
      scale: 0.08 + (index % 3) * 0.02,
    };
  });
}

function buildCodingNodes() {
  return [
    ...createRadialNodes(10, 1.15, 2.35, -0.3, 1.2, 0.55),
    ...createRadialNodes(7, 0.72, 2.2, -0.75, 0.8, 0.8),
  ];
}

function buildEngineeringNodes() {
  return [
    { position: [-1.1, -1.3, -0.25] as [number, number, number], scale: 0.12 },
    { position: [1.1, -1.3, -0.25] as [number, number, number], scale: 0.12 },
    { position: [-1.2, -2.3, -0.3] as [number, number, number], scale: 0.12 },
    { position: [1.2, -2.3, -0.3] as [number, number, number], scale: 0.12 },
    { position: [-0.72, -1.8, -0.58] as [number, number, number], scale: 0.1 },
    { position: [0.72, -1.8, -0.58] as [number, number, number], scale: 0.1 },
    { position: [0, -2.9, -0.45] as [number, number, number], scale: 0.16 },
  ] satisfies NodePoint[];
}

function buildDriveNodes() {
  return Array.from({ length: 12 }, (_, index) => {
    const t = index / 11;
    return {
      position: [
        (index % 2 === 0 ? -0.55 : 0.55) * (1 - t * 0.35),
        -3.15 - t * 1.45,
        -0.2 - t * 0.25,
      ] as [number, number, number],
      scale: 0.08 + (1 - t) * 0.07,
    };
  });
}

function buildAchievementNodes() {
  return [
    ...createRadialNodes(8, 0.82, 0.35, -0.22, 1.05, 0.9),
    ...createRadialNodes(12, 1.28, 0.35, -0.45, 1.15, 1),
  ];
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
}: {
  position: [number, number, number];
  color: string;
  radius: number;
  speed: number;
  tilt: [number, number, number];
  opacity: number;
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
        <torusGeometry args={[radius, 0.02, 18, 72, Math.PI * 1.35]} />
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
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function EnergyPulses({
  zoneId,
  connections,
  isFocused,
  isInteractive,
}: {
  zoneId: RocketZoneId;
  connections: ConnectionPair[];
  isFocused: boolean;
  isInteractive: boolean;
}) {
  const color = getZoneColor(zoneId);
  const pulseCount = Math.min(connections.length, isInteractive ? 6 : 3);
  const offsets = useMemo(
    () => Array.from({ length: pulseCount }, (_, index) => ((index * 0.31) % 1)),
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

      const travel = (t * (isInteractive ? 0.42 : 0.22) + offset) % 1;
      const point = interpolatePoint(pair, travel);
      mesh.position.set(point[0], point[1], point[2]);
      const scale = isInteractive ? 0.1 : isFocused ? 0.08 : 0.06;
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
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={isInteractive ? 0.9 : 0.65} />
        </mesh>
      ))}
    </group>
  );
}

function ZoneNetwork({
  zoneId,
  nodes,
  activeZoneId,
  hoveredZoneId,
  selectedZoneId,
}: {
  zoneId: RocketZoneId;
  nodes: NodePoint[];
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
}) {
  const color = getZoneColor(zoneId);
  const isInteractive = hoveredZoneId === zoneId || selectedZoneId === zoneId;
  const isFocused = activeZoneId === zoneId;
  const opacity = isInteractive ? 0.95 : isFocused ? 0.72 : 0.42;
  const connections = useMemo(() => connectionPairs(nodes), [nodes]);

  return (
    <group>
      {connections.map(([start, end], index) => (
        <Line
          key={`${zoneId}-line-${index}`}
          points={[start, end]}
          color={color}
          transparent
          opacity={opacity * 0.42}
          lineWidth={isInteractive ? 1.6 : 1}
        />
      ))}
      <EnergyPulses
        zoneId={zoneId}
        connections={connections}
        isFocused={isFocused}
        isInteractive={isInteractive}
      />
      {nodes.map((node, index) => (
        <EnergyNode
          key={`${zoneId}-node-${index}`}
          position={node.position}
          scale={node.scale}
          color={color}
          opacity={opacity}
        />
      ))}
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
  const coreRef = useRef<Mesh>(null);
  const achievementGroupRef = useRef<Group>(null);
  const driveGroupRef = useRef<Group>(null);
  const codingGroupRef = useRef<Group>(null);
  const engineeringGroupRef = useRef<Group>(null);
  const codingNodes = useMemo(() => buildCodingNodes(), []);
  const engineeringNodes = useMemo(() => buildEngineeringNodes(), []);
  const driveNodes = useMemo(() => buildDriveNodes(), []);
  const achievementNodes = useMemo(() => buildAchievementNodes(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.05;
      coreRef.current.scale.setScalar(scale);
    }

    if (achievementGroupRef.current) {
      achievementGroupRef.current.rotation.z = Math.sin(t * 0.3) * 0.08;
    }

    if (codingGroupRef.current) {
      codingGroupRef.current.rotation.z = Math.sin(t * 0.24) * 0.06;
      codingGroupRef.current.position.x = Math.sin(t * 0.4) * 0.06;
    }

    if (engineeringGroupRef.current) {
      engineeringGroupRef.current.position.y = -0.02 + Math.sin(t * 0.6) * 0.04;
    }

    if (driveGroupRef.current) {
      driveGroupRef.current.position.z = -0.1 + Math.sin(t * 3.4) * 0.08;
    }
  });

  const coreColor = getZoneColor("noseVision");
  const codingColor = getZoneColor("upperBodyCoding");
  const achievementsColor = getZoneColor("coreAchievements");
  const engineeringColor = getZoneColor("lowerBodyEngineering");
  const driveColor = getZoneColor("thrustersDrive");

  return (
    <group {...groupProps}>
      <group position={[0, 0.25, -0.15]}>
        <mesh ref={coreRef} position={zoneAnchors.noseVision}>
          <sphereGeometry args={[0.55, 40, 40]} />
          <meshBasicMaterial color={coreColor} transparent opacity={activeZoneId === "noseVision" ? 0.92 : 0.75} />
        </mesh>
        <mesh position={zoneAnchors.noseVision} scale={[1.8, 1.8, 1.8]}>
          <sphereGeometry args={[0.55, 28, 28]} />
          <meshBasicMaterial color="#dff8ff" transparent opacity={0.08} />
        </mesh>
        <mesh position={zoneAnchors.noseVision} scale={[3.2, 3.2, 3.2]}>
          <sphereGeometry args={[0.55, 20, 20]} />
          <meshBasicMaterial color={coreColor} transparent opacity={activeZoneId === "noseVision" ? 0.06 : 0.03} />
        </mesh>
        <OrbitingArc
          position={zoneAnchors.noseVision}
          color={coreColor}
          radius={1.12}
          speed={0.16}
          tilt={[Math.PI / 2, 0.2, 0]}
          opacity={0.26}
        />
        <OrbitingArc
          position={zoneAnchors.noseVision}
          color="#dff8ff"
          radius={1.46}
          speed={-0.11}
          tilt={[0.4, 0.4, Math.PI / 2]}
          opacity={0.16}
        />

        <group ref={codingGroupRef}>
          <ZoneNetwork
            zoneId="upperBodyCoding"
            nodes={codingNodes}
            activeZoneId={activeZoneId}
            hoveredZoneId={hoveredZoneId}
            selectedZoneId={selectedZoneId}
          />
          <OrbitingArc
            position={zoneAnchors.upperBodyCoding}
            color={codingColor}
            radius={1.38}
            speed={0.22}
            tilt={[Math.PI / 2, 0, 0.4]}
            opacity={0.18}
          />
        </group>

        <group ref={achievementGroupRef}>
          <ZoneNetwork
            zoneId="coreAchievements"
            nodes={achievementNodes}
            activeZoneId={activeZoneId}
            hoveredZoneId={hoveredZoneId}
            selectedZoneId={selectedZoneId}
          />
          {[0.74, 1.12, 1.48].map((radius, index) => (
            <mesh
              key={`achievement-ring-${radius}`}
              position={zoneAnchors.coreAchievements}
              rotation={[Math.PI / 2, 0, index * 0.3]}
              scale={[1, 0.72 + index * 0.12, 1]}
            >
              <torusGeometry args={[radius, 0.03, 18, 72]} />
              <meshBasicMaterial
                color={achievementsColor}
                transparent
                opacity={activeZoneId === "coreAchievements" ? 0.55 : 0.22}
              />
            </mesh>
          ))}
          <OrbitingArc
            position={zoneAnchors.coreAchievements}
            color="#dff8ff"
            radius={1.72}
            speed={-0.08}
            tilt={[Math.PI / 2, 0.6, 0]}
            opacity={0.12}
          />
        </group>

        <group ref={engineeringGroupRef}>
          <ZoneNetwork
            zoneId="lowerBodyEngineering"
            nodes={engineeringNodes}
            activeZoneId={activeZoneId}
            hoveredZoneId={hoveredZoneId}
            selectedZoneId={selectedZoneId}
          />
          {engineeringNodes.map((node, index) => (
            <mesh key={`engineering-brace-${index}`} position={node.position} scale={[0.12, 0.6, 0.12]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={engineeringColor} transparent opacity={0.16} />
            </mesh>
          ))}
          <OrbitingArc
            position={zoneAnchors.lowerBodyEngineering}
            color={engineeringColor}
            radius={1.18}
            speed={0.09}
            tilt={[Math.PI / 2, 0.2, Math.PI / 4]}
            opacity={0.12}
          />
        </group>

        <group ref={driveGroupRef}>
          <ZoneNetwork
            zoneId="thrustersDrive"
            nodes={driveNodes}
            activeZoneId={activeZoneId}
            hoveredZoneId={hoveredZoneId}
            selectedZoneId={selectedZoneId}
          />
          {[-0.45, 0, 0.45].map((x, index) => (
            <mesh key={`drive-stream-${index}`} position={[x, -4.05, -0.34]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.16 + index * 0.02, 1.9, 16]} />
              <meshBasicMaterial color={driveColor} transparent opacity={0.28 + index * 0.08} />
            </mesh>
          ))}
          <mesh position={[0, -4.7, -0.58]} scale={[1.4, 3.2, 1.1]}>
            <sphereGeometry args={[0.4, 18, 18]} />
            <meshBasicMaterial color={driveColor} transparent opacity={0.08} />
          </mesh>
        </group>

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
            opacity={0.18}
            lineWidth={1}
          />
        ))}
      </group>
      <Label />
    </group>
  );
}

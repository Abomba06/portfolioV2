"use client";

import { ThreeEvent } from "@react-three/fiber";
import { RocketZoneId } from "@/lib/rocketZones";

type RocketZonesProps = {
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
  onHoverZone: (zoneId: RocketZoneId | null) => void;
  onSelectZone: (zoneId: RocketZoneId) => void;
};

type ZoneMeshConfig = {
  id: RocketZoneId;
  position: [number, number, number];
  shape: "sphere" | "cylinder";
  args: [number, number, number, number?];
};

const zoneMeshes: ZoneMeshConfig[] = [
  { id: "noseVision", position: [0, 4.35, -0.15], shape: "sphere", args: [1.1, 28, 28] },
  { id: "upperBodyCoding", position: [0.05, 2.35, -0.35], shape: "sphere", args: [1.45, 28, 28] },
  { id: "coreAchievements", position: [0, 0.35, -0.25], shape: "sphere", args: [1.55, 28, 28] },
  {
    id: "lowerBodyEngineering",
    position: [0, -2.05, -0.32],
    shape: "cylinder",
    args: [1.4, 1.3, 2.2, 32],
  },
  { id: "thrustersDrive", position: [0, -3.85, -0.25], shape: "cylinder", args: [1.1, 0.55, 2.25, 24] },
];

function ZoneCollider({
  config,
  isActive,
  onHoverZone,
  onSelectZone,
}: {
  config: ZoneMeshConfig;
  isActive: boolean;
  onHoverZone: (zoneId: RocketZoneId | null) => void;
  onSelectZone: (zoneId: RocketZoneId) => void;
}) {
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHoverZone(config.id);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHoverZone(null);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelectZone(config.id);
  };

  return (
    <mesh
      position={config.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {config.shape === "sphere" ? (
        <sphereGeometry args={config.args as [number, number, number]} />
      ) : (
        <cylinderGeometry args={config.args as [number, number, number, number]} />
      )}
      <meshBasicMaterial
        color={isActive ? "#92e7ff" : "#58cfff"}
        transparent
        opacity={isActive ? 0.12 : 0.02}
        depthWrite={false}
      />
    </mesh>
  );
}

export function RocketZones({
  hoveredZoneId,
  selectedZoneId,
  onHoverZone,
  onSelectZone,
}: RocketZonesProps) {
  return (
    <group>
      {zoneMeshes.map((config) => {
        const isActive = config.id === hoveredZoneId || config.id === selectedZoneId;

        return (
          <ZoneCollider
            key={config.id}
            config={config}
            isActive={isActive}
            onHoverZone={onHoverZone}
            onSelectZone={onSelectZone}
          />
        );
      })}
    </group>
  );
}

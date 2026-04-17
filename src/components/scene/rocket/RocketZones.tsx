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
  shape: "cylinder" | "cone";
  args: [number, number, number, number?];
};

const zoneMeshes: ZoneMeshConfig[] = [
  { id: "noseVision", position: [0, 4.05, 0], shape: "cone", args: [1.1, 2.45, 24] },
  { id: "upperBodyCoding", position: [0, 2.45, 0], shape: "cylinder", args: [1.18, 1.12, 1.95, 32] },
  { id: "coreAchievements", position: [0, 0.15, 0], shape: "cylinder", args: [1.25, 1.18, 2.45, 32] },
  {
    id: "lowerBodyEngineering",
    position: [0, -2.15, 0],
    shape: "cylinder",
    args: [1.34, 1.2, 1.95, 32],
  },
  { id: "thrustersDrive", position: [0, -3.75, 0], shape: "cylinder", args: [1.45, 0.95, 1.25, 32] },
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
      {config.shape === "cone" ? (
        <coneGeometry args={config.args as [number, number, number]} />
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

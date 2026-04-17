"use client";

import { Html } from "@react-three/drei";
import { RocketZoneId, ROCKET_ZONES } from "@/lib/rocketZones";

type ZoneBeaconsProps = {
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
  isLowPerformance: boolean;
};

const beaconAnchors: Record<RocketZoneId, [number, number, number]> = {
  noseVision: [1.85, 4.35, 0.25],
  upperBodyCoding: [1.9, 2.45, 0.2],
  coreAchievements: [2.05, 0.35, 0.2],
  lowerBodyEngineering: [1.95, -1.95, 0.2],
  thrustersDrive: [1.75, -3.55, 0.2],
};

export function ZoneBeacons({ hoveredZoneId, selectedZoneId, isLowPerformance }: ZoneBeaconsProps) {
  if (selectedZoneId) {
    return null;
  }

  return (
    <group>
      {ROCKET_ZONES.map((zone) => {
        const isActive = zone.id === hoveredZoneId;
        const opacity = hoveredZoneId ? (isActive ? 1 : 0.45) : 0.82;

        return (
          <group key={zone.id} position={beaconAnchors[zone.id]}>
            <mesh>
              <sphereGeometry args={[isActive ? 0.065 : 0.05, 18, 18]} />
              <meshBasicMaterial color={zone.lightColor} transparent opacity={opacity} />
            </mesh>
            {!isLowPerformance ? (
              <mesh scale={[1, 1.8, 1]}>
                <torusGeometry args={[0.14, 0.01, 12, 48]} />
                <meshBasicMaterial color={zone.lightColor} transparent opacity={opacity * 0.7} />
              </mesh>
            ) : null}
            <Html position={[0.38, 0, 0]} transform distanceFactor={10}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.35rem 0.55rem",
                  border: `1px solid ${zone.lightColor}33`,
                  borderRadius: "999px",
                  background: "rgba(8, 14, 24, 0.58)",
                  color: "#e8f7ff",
                  whiteSpace: "nowrap",
                  backdropFilter: "blur(8px)",
                  opacity,
                  transform: `scale(${isActive ? 1.02 : 1})`,
                  transition: "opacity 180ms ease, transform 180ms ease",
                }}
              >
                <span
                  style={{
                    width: "0.35rem",
                    height: "0.35rem",
                    borderRadius: "999px",
                    background: zone.lightColor,
                    boxShadow: `0 0 16px ${zone.lightColor}`,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  {zone.shortLabel}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

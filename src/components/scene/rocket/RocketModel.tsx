"use client";

import { Cylinder, Html, RoundedBox } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { ROCKET_ZONES, RocketZoneId } from "@/lib/rocketZones";

type RocketModelProps = ThreeElements["group"] & {
  progress: number;
  activeZoneId: RocketZoneId;
};

function RocketBody({ activeZoneId }: { activeZoneId: RocketZoneId }) {
  const accent = ROCKET_ZONES.find((zone) => zone.id === activeZoneId)?.lightColor ?? "#7cc7ff";

  return (
    <group>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.92, 5.2, 48, 1, false]} />
        <meshStandardMaterial
          color="#bcc7d9"
          metalness={0.85}
          roughness={0.23}
          emissive={accent}
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.78, 2.1, 48]} />
        <meshStandardMaterial
          color="#dce6f3"
          metalness={0.75}
          roughness={0.2}
          emissive="#102340"
          emissiveIntensity={0.25}
        />
      </mesh>

      <mesh position={[0, -2.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 1.05, 0.9, 48]} />
        <meshStandardMaterial color="#596579" metalness={0.8} roughness={0.38} />
      </mesh>
    </group>
  );
}

function PanelBands({ progress }: { progress: number }) {
  return (
    <group>
      {[
        { y: -0.95, start: 0.62, end: 0.92 },
        { y: 0.7, start: 0.32, end: 0.66 },
        { y: 2.25, start: 0.08, end: 0.4 },
      ].map(({ y, start, end }) => {
        const isFocused = progress >= start && progress <= end;

        return (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.84, 0.04, 20, 64]} />
          <meshStandardMaterial
            color={isFocused ? "#c3eeff" : "#7bd8ff"}
            emissive="#66d5ff"
            emissiveIntensity={isFocused ? 1.4 : 0.65}
          />
        </mesh>
        );
      })}
    </group>
  );
}

function Fins() {
  return (
    <group position={[0, -1.65, 0]}>
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((rotation) => (
        <RoundedBox
          key={rotation}
          args={[0.14, 1.75, 1.05]}
          radius={0.05}
          smoothness={4}
          position={[Math.sin(rotation) * 0.98, -0.15, Math.cos(rotation) * 0.98]}
          rotation={[0, rotation, rotation % Math.PI === 0 ? -0.22 : 0.22]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#6d7687" metalness={0.78} roughness={0.34} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Thrusters() {
  return (
    <group position={[0, -3.15, 0]}>
      {[
        [0, 0],
        [0.58, 0],
        [-0.58, 0],
        [0, 0.58],
        [0, -0.58],
      ].map(([x, z], index) => (
        <group key={`${x}-${z}-${index}`} position={[x, 0, z]}>
          <Cylinder args={[0.2, 0.3, 1.15, 32]} castShadow receiveShadow>
            <meshStandardMaterial color="#4f5564" metalness={0.82} roughness={0.28} />
          </Cylinder>
          <mesh position={[0, -0.78, 0]}>
            <coneGeometry args={[0.18, 1.3, 24]} />
            <meshBasicMaterial color="#56d3ff" transparent opacity={0.72} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Label() {
  return (
    <Html position={[1.55, 3.1, 0]} distanceFactor={8} transform>
      <div
        style={{
          padding: "0.6rem 0.8rem",
          border: "1px solid rgba(148, 198, 255, 0.22)",
          borderRadius: "999px",
          background: "rgba(8, 15, 26, 0.66)",
          color: "#d8efff",
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          whiteSpace: "nowrap",
          backdropFilter: "blur(10px)",
        }}
      >
        PRIMARY VESSEL
      </div>
    </Html>
  );
}

export function RocketModel({ activeZoneId, progress, ...groupProps }: RocketModelProps) {
  return (
    <group {...groupProps} rotation={[0.12, 0.3, -0.08]}>
      <RocketBody activeZoneId={activeZoneId} />
      <PanelBands progress={progress} />
      <Fins />
      <Thrusters />
      <Label />
    </group>
  );
}

"use client";

import { Html, useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { Mesh, MeshStandardMaterial, Object3D } from "three";
import { ROCKET_ZONES, RocketZoneId } from "@/lib/rocketZones";

type RocketModelProps = ThreeElements["group"] & {
  progress: number;
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
};

const MODEL_PATH = "/models/rocket.glb";

function getInteractionAccent(
  activeZoneId: RocketZoneId,
  hoveredZoneId: RocketZoneId | null,
  selectedZoneId: RocketZoneId | null,
) {
  const baseAccent = ROCKET_ZONES.find((zone) => zone.id === activeZoneId)?.lightColor ?? "#7cc7ff";
  const interactionZoneId = hoveredZoneId ?? selectedZoneId ?? activeZoneId;
  return ROCKET_ZONES.find((zone) => zone.id === interactionZoneId)?.lightColor ?? baseAccent;
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

export function RocketModel({
  activeZoneId,
  progress,
  hoveredZoneId,
  selectedZoneId,
  ...groupProps
}: RocketModelProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const accent = getInteractionAccent(activeZoneId, hoveredZoneId, selectedZoneId);

  const rocketScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) {
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) => material.clone());
      } else if (mesh.material) {
        mesh.material = mesh.material.clone();
      }
    });

    return clone;
  }, [scene]);

  useLayoutEffect(() => {
    rocketScene.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh || Array.isArray(mesh.material)) {
        return;
      }

      const material = mesh.material as MeshStandardMaterial;
      const isBand = mesh.name.startsWith("band_");
      const isThrusterGlow = mesh.name.startsWith("thruster_glow_");
      const isBody = mesh.name === "rocket_body";
      const isNose = mesh.name === "rocket_nose";

      if (isBody) {
        material.emissive.set(accent);
        material.emissiveIntensity = hoveredZoneId || selectedZoneId ? 0.35 : 0.2;
      }

      if (isNose) {
        material.emissiveIntensity = activeZoneId === "noseVision" || selectedZoneId === "noseVision" ? 0.35 : 0.25;
      }

      if (isBand) {
        const bandZoneId =
          mesh.name === "band_upper"
            ? "upperBodyCoding"
            : mesh.name === "band_core"
              ? "coreAchievements"
              : "lowerBodyEngineering";
        const [start, end] =
          ROCKET_ZONES.find((zone) => zone.id === bandZoneId)?.progressRange ?? [0, 1];
        const isInteractive = hoveredZoneId === bandZoneId || selectedZoneId === bandZoneId;

        material.color.set(isInteractive ? "#e6fbff" : progress >= start && progress <= end ? "#c3eeff" : "#7bd8ff");
        material.emissive.set("#66d5ff");
        material.emissiveIntensity = isInteractive ? 2.1 : progress >= start && progress <= end ? 1.4 : 0.65;
      }

      if (isThrusterGlow) {
        material.opacity = activeZoneId === "thrustersDrive" || selectedZoneId === "thrustersDrive" ? 0.92 : 0.72;
      }
    });
  }, [accent, activeZoneId, hoveredZoneId, progress, rocketScene, selectedZoneId]);

  return (
    <group {...groupProps}>
      <primitive object={rocketScene} />
      <Label />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

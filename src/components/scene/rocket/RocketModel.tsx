"use client";

import { Html, useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { Box3, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { ROCKET_ZONES, RocketZoneId } from "@/lib/rocketZones";

type RocketModelProps = ThreeElements["group"] & {
  progress: number;
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
};

const MODEL_PATH = "/models/rocket-detailed.glb";
const TARGET_HEIGHT = 10;

function inferZoneIdFromNormalizedHeight(normalizedHeight: number): RocketZoneId {
  if (normalizedHeight >= 0.82) {
    return "noseVision";
  }

  if (normalizedHeight >= 0.62) {
    return "upperBodyCoding";
  }

  if (normalizedHeight >= 0.42) {
    return "coreAchievements";
  }

  if (normalizedHeight >= 0.18) {
    return "lowerBodyEngineering";
  }

  return "thrustersDrive";
}

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
    const overallBox = new Box3();
    const meshBox = new Box3();
    const size = new Vector3();
    const center = new Vector3();
    const meshCenter = new Vector3();

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

    clone.updateMatrixWorld(true);
    overallBox.setFromObject(clone);
    overallBox.getSize(size);
    overallBox.getCenter(center);

    const scale = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    clone.updateMatrixWorld(true);

    clone.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) {
        return;
      }

      meshBox.setFromObject(mesh);
      meshBox.getCenter(meshCenter);

      const normalizedHeight = size.y > 0 ? (meshCenter.y / scale + center.y - overallBox.min.y) / size.y : 0.5;
      mesh.userData.zoneId = inferZoneIdFromNormalizedHeight(normalizedHeight);
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
      const meshZoneId = mesh.userData.zoneId as RocketZoneId | undefined;
      const isInteractive = meshZoneId === hoveredZoneId || meshZoneId === selectedZoneId;
      const zoneRange = meshZoneId
        ? (ROCKET_ZONES.find((zone) => zone.id === meshZoneId)?.progressRange ?? [0, 1])
        : [0, 1];
      const isFocused = progress >= zoneRange[0] && progress <= zoneRange[1];

      material.emissive.set(meshZoneId === "thrustersDrive" ? "#66d5ff" : accent);
      material.emissiveIntensity = isInteractive ? 0.45 : isFocused ? 0.2 : 0.1;

      if (meshZoneId === "thrustersDrive") {
        material.emissiveIntensity = isInteractive ? 0.85 : isFocused ? 0.55 : 0.24;
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

"use client";

import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { getCameraPose, getDetailCameraPose } from "@/lib/cameraPath";
import { RocketZoneId } from "@/lib/rocketZones";

type CameraRigProps = {
  progress: number;
  selectedZoneId: RocketZoneId | null;
};

export function CameraRig({ progress, selectedZoneId }: CameraRigProps) {
  const desired = useMemo(
    () => ({
      position: new Vector3(),
      target: new Vector3(),
      up: new Vector3(0, 1, 0),
    }),
    [],
  );

  const currentTarget = useMemo(() => new Vector3(), []);
  const detailBlend = useRef({ value: 0 });

  useEffect(() => {
    const tween = gsap.to(detailBlend.current, {
      value: selectedZoneId ? 1 : 0,
      duration: 1.15,
      ease: "power3.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [selectedZoneId]);

  useFrame((state, delta) => {
    const overviewPose = getCameraPose(progress);
    const detailPose = selectedZoneId ? getDetailCameraPose(selectedZoneId) : overviewPose;
    const desiredFov = MathUtils.lerp(overviewPose.fov, detailPose.fov, detailBlend.current.value);

    desired.position.copy(overviewPose.position).lerp(detailPose.position, detailBlend.current.value);
    desired.target.copy(overviewPose.target).lerp(detailPose.target, detailBlend.current.value);
    desired.up.copy(overviewPose.up).lerp(detailPose.up, detailBlend.current.value).normalize();

    const easing = 1 - Math.exp(-delta * 3.2);

    state.camera.position.lerp(desired.position, easing);
    currentTarget.lerp(desired.target, easing);
    state.camera.up.lerp(desired.up, 1 - Math.exp(-delta * 1.8));
    state.camera.lookAt(currentTarget);

    if (state.camera instanceof PerspectiveCamera) {
      state.camera.fov = MathUtils.lerp(state.camera.fov, desiredFov, 1 - Math.exp(-delta * 4));
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
}

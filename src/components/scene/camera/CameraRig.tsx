"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { getCameraPose } from "@/lib/cameraPath";

type CameraRigProps = {
  progress: number;
};

export function CameraRig({ progress }: CameraRigProps) {
  const desired = useMemo(
    () => ({
      position: new Vector3(),
      target: new Vector3(),
      up: new Vector3(0, 1, 0),
    }),
    [],
  );

  const currentTarget = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const pose = getCameraPose(progress);
    desired.position.copy(pose.position);
    desired.target.copy(pose.target);
    desired.up.copy(pose.up);

    const easing = 1 - Math.exp(-delta * 3.2);

    state.camera.position.lerp(desired.position, easing);
    currentTarget.lerp(desired.target, easing);
    state.camera.up.lerp(desired.up, 1 - Math.exp(-delta * 1.8));
    state.camera.lookAt(currentTarget);

    if (state.camera instanceof PerspectiveCamera) {
      state.camera.fov = MathUtils.lerp(state.camera.fov, 31, 1 - Math.exp(-delta * 4));
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
}

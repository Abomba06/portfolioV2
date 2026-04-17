import { CatmullRomCurve3, Vector3 } from "three";

const cameraPoints = [
  new Vector3(1.6, 5.9, 8.8),
  new Vector3(1.7, 4.2, 8.3),
  new Vector3(1.8, 2.1, 7.6),
  new Vector3(1.95, -0.4, 7),
  new Vector3(2.25, -3.9, 6.1),
];

const targetPoints = [
  new Vector3(0, 4.6, 0),
  new Vector3(0, 2.9, 0),
  new Vector3(0, 0.8, 0),
  new Vector3(0, -1.4, 0),
  new Vector3(0, -3.2, 0),
];

const upPoints = [
  new Vector3(0, 1, 0),
  new Vector3(0.02, 1, 0),
  new Vector3(0, 1, 0.01),
  new Vector3(-0.02, 1, 0),
  new Vector3(0, 1, -0.02),
];

const cameraCurve = new CatmullRomCurve3(cameraPoints);
const targetCurve = new CatmullRomCurve3(targetPoints);
const upCurve = new CatmullRomCurve3(upPoints);

export function getCameraPose(progress: number) {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return {
    position: cameraCurve.getPointAt(clamped),
    target: targetCurve.getPointAt(clamped),
    up: upCurve.getPointAt(clamped).normalize(),
  };
}

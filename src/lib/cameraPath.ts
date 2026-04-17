import { CatmullRomCurve3, Vector3 } from "three";
import { RocketZoneId } from "./rocketZones";

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

const detailCameraPoses: Record<
  RocketZoneId,
  {
    position: Vector3;
    target: Vector3;
    up: Vector3;
    fov: number;
  }
> = {
  noseVision: {
    position: new Vector3(1.05, 4.85, 3.7),
    target: new Vector3(0.08, 4.12, 0),
    up: new Vector3(0, 1, 0),
    fov: 25,
  },
  upperBodyCoding: {
    position: new Vector3(1.15, 2.85, 3.55),
    target: new Vector3(0.05, 2.15, 0),
    up: new Vector3(0, 1, 0),
    fov: 24,
  },
  coreAchievements: {
    position: new Vector3(1.2, 0.9, 3.4),
    target: new Vector3(0, 0.6, 0),
    up: new Vector3(0, 1, 0),
    fov: 23,
  },
  lowerBodyEngineering: {
    position: new Vector3(1.15, -1.65, 3.65),
    target: new Vector3(0.02, -1.95, 0),
    up: new Vector3(0, 1, 0),
    fov: 24,
  },
  thrustersDrive: {
    position: new Vector3(1.35, -3.45, 3.2),
    target: new Vector3(0, -3.3, 0),
    up: new Vector3(0, 1, 0),
    fov: 22,
  },
};

export function getCameraPose(progress: number) {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return {
    position: cameraCurve.getPointAt(clamped),
    target: targetCurve.getPointAt(clamped),
    up: upCurve.getPointAt(clamped).normalize(),
    fov: 31,
  };
}

export function getDetailCameraPose(zoneId: RocketZoneId) {
  return detailCameraPoses[zoneId];
}

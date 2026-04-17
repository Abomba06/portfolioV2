export type RocketZoneId =
  | "noseVision"
  | "upperBodyCoding"
  | "coreAchievements"
  | "lowerBodyEngineering"
  | "thrustersDrive";

export type RocketZoneDefinition = {
  id: RocketZoneId;
  label: string;
  shortLabel: string;
  progressRange: [number, number];
  lightColor: string;
  description: string;
};

export const ROCKET_ZONES: RocketZoneDefinition[] = [
  {
    id: "noseVision",
    label: "Vision Chamber",
    shortLabel: "Vision",
    progressRange: [0, 0.16],
    lightColor: "#9cd0ff",
    description: "The camera rises toward the nose, where identity and future direction come into focus.",
  },
  {
    id: "upperBodyCoding",
    label: "Coding Systems",
    shortLabel: "Coding",
    progressRange: [0.16, 0.36],
    lightColor: "#78d8ff",
    description: "The upper hull becomes the technical layer, built for software, AI, and digital systems.",
  },
  {
    id: "coreAchievements",
    label: "Core Milestones",
    shortLabel: "Achievements",
    progressRange: [0.36, 0.58],
    lightColor: "#6dbaff",
    description: "The center of the vessel carries structure, progress, and earned momentum.",
  },
  {
    id: "lowerBodyEngineering",
    label: "Engineering Bay",
    shortLabel: "Engineering",
    progressRange: [0.58, 0.8],
    lightColor: "#77d0ff",
    description: "The lower body leans into build systems, mechanics, and precision under load.",
  },
  {
    id: "thrustersDrive",
    label: "Drive Systems",
    shortLabel: "Drive",
    progressRange: [0.8, 1],
    lightColor: "#58dcff",
    description: "The final segment lands near the engines, where ambition and propulsion live.",
  },
];

export function getZoneForProgress(progress: number): RocketZoneDefinition {
  return (
    ROCKET_ZONES.find(({ progressRange: [start, end] }) => progress >= start && progress <= end) ??
    ROCKET_ZONES[ROCKET_ZONES.length - 1]
  );
}

export function getZoneById(zoneId: RocketZoneId | null | undefined) {
  if (!zoneId) {
    return null;
  }

  return ROCKET_ZONES.find((zone) => zone.id === zoneId) ?? null;
}

export function getZoneCenterProgress(zoneId: RocketZoneId) {
  const zone = getZoneById(zoneId);

  if (!zone) {
    return 0;
  }

  const [start, end] = zone.progressRange;
  return (start + end) / 2;
}

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
    label: "Center Core",
    shortLabel: "Vision",
    progressRange: [0, 0.16],
    lightColor: "#9cd0ff",
    description: "The camera rises into the central core, where identity, intent, and future direction pulse at the heart of the system.",
  },
  {
    id: "upperBodyCoding",
    label: "Coding Network",
    shortLabel: "Coding",
    progressRange: [0.16, 0.36],
    lightColor: "#78d8ff",
    description: "A dense software lattice of active nodes and illuminated links, built to represent logic, systems, and AI flow.",
  },
  {
    id: "coreAchievements",
    label: "Achievement Rings",
    shortLabel: "Achievements",
    progressRange: [0.36, 0.58],
    lightColor: "#6dbaff",
    description: "Layered rings and stacked fields expand around the center, marking progress, milestones, and accumulated momentum.",
  },
  {
    id: "lowerBodyEngineering",
    label: "Engineering Grid",
    shortLabel: "Engineering",
    progressRange: [0.58, 0.8],
    lightColor: "#77d0ff",
    description: "Structured geometry, rigid symmetry, and modular frameworks form an engineered layer built around precision and construction.",
  },
  {
    id: "thrustersDrive",
    label: "Drive Streams",
    shortLabel: "Drive",
    progressRange: [0.8, 1],
    lightColor: "#58dcff",
    description: "Accelerating streams of energy open outward at the edge of the field, representing drive, pressure, and ambition.",
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

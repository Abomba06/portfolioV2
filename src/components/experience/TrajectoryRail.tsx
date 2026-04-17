"use client";

import { ROCKET_ZONES, RocketZoneId } from "@/lib/rocketZones";
import styles from "./TrajectoryRail.module.css";

type TrajectoryRailProps = {
  activeZoneId: RocketZoneId;
  hoveredZoneId: RocketZoneId | null;
  selectedZoneId: RocketZoneId | null;
  onJumpToZone: (zoneId: RocketZoneId) => void;
};

export function TrajectoryRail({
  activeZoneId,
  hoveredZoneId,
  selectedZoneId,
  onJumpToZone,
}: TrajectoryRailProps) {
  return (
    <nav className={styles.rail} aria-label="Rocket trajectory navigation">
      <div className={styles.line} />
      {ROCKET_ZONES.map((zone) => {
        const isActive = zone.id === activeZoneId;
        const isHovered = zone.id === hoveredZoneId;
        const isSelected = zone.id === selectedZoneId;

        return (
          <button
            key={zone.id}
            type="button"
            className={styles.node}
            data-active={isActive || undefined}
            data-hovered={isHovered || undefined}
            data-selected={isSelected || undefined}
            style={{ ["--zone-color" as string]: zone.lightColor }}
            onClick={() => onJumpToZone(zone.id)}
            aria-label={`Jump to ${zone.label}`}
          >
            <span className={styles.dot} />
            <span className={styles.textBlock}>
              <span className={styles.short}>{zone.shortLabel}</span>
              <span className={styles.label}>{zone.label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

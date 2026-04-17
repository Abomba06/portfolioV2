"use client";

import { useEffect, useMemo, useState } from "react";
import { getZoneById, getZoneForProgress, RocketZoneId } from "@/lib/rocketZones";
import { ExperienceCanvas } from "./ExperienceCanvas";
import { ScrollController } from "./ScrollController";
import styles from "./ExperienceShell.module.css";

export function ExperienceShell() {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [hoveredZoneId, setHoveredZoneId] = useState<RocketZoneId | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<RocketZoneId | null>(null);

  const activeZone = useMemo(() => getZoneForProgress(progress), [progress]);
  const previewZone = useMemo(
    () => getZoneById(hoveredZoneId) ?? getZoneById(selectedZoneId) ?? activeZone,
    [activeZone, hoveredZoneId, selectedZoneId],
  );

  useEffect(() => {
    document.body.style.cursor = hoveredZoneId ? "pointer" : "default";

    return () => {
      document.body.style.cursor = "default";
    };
  }, [hoveredZoneId]);

  return (
    <main className={styles.shell}>
      <div className={styles.scrollViewport} ref={setScrollContainer}>
        <ScrollController scroller={scrollContainer} onProgress={setProgress} />
        <section className={styles.stage}>
          <div className={styles.stickyScene}>
            <ExperienceCanvas
              progress={progress}
              hoveredZoneId={hoveredZoneId}
              selectedZoneId={selectedZoneId}
              onHoverZone={setHoveredZoneId}
              onSelectZone={setSelectedZoneId}
            />
            <div className={styles.overlay}>
              <div className={styles.kicker}>IMMERSIVE ROCKET PORTFOLIO</div>
              <h1 className={styles.title}>Travel the rocket instead of scrolling a page.</h1>
              <p className={styles.copy}>{previewZone.description}</p>
              <div className={styles.status}>
                <span>Stage 3</span>
                <span>{previewZone.label}</span>
              </div>
              <div className={styles.interactionPanel}>
                <span className={styles.interactionEyebrow}>Rocket interface</span>
                <p className={styles.interactionCopy}>
                  {hoveredZoneId
                    ? `Hovering ${previewZone.shortLabel}. Click to lock this subsystem.`
                    : selectedZoneId
                      ? `${previewZone.shortLabel} selected. Stage 4 will use this for zoom-in transitions.`
                      : "Move across the rocket to reveal its interactive regions. Click any section to arm it for entry."}
                </p>
              </div>
              <div className={styles.progressBlock}>
                <span className={styles.progressLabel}>Scroll trajectory</span>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ transform: `scaleX(${progress})` }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

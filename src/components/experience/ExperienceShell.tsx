"use client";

import { useEffect, useMemo, useState } from "react";
import { getZoneById, getZoneForProgress, RocketZoneId } from "@/lib/rocketZones";
import { ExperienceCanvas } from "./ExperienceCanvas";
import { ScrollController } from "./ScrollController";
import { SubsystemOverlay } from "./SubsystemOverlay";
import { usePerformanceTier } from "./usePerformanceTier";
import styles from "./ExperienceShell.module.css";

export function ExperienceShell() {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [hoveredZoneId, setHoveredZoneId] = useState<RocketZoneId | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<RocketZoneId | null>(null);
  const { isLowPerformance } = usePerformanceTier();

  const activeZone = useMemo(() => getZoneForProgress(progress), [progress]);
  const previewZone = useMemo(
    () => getZoneById(hoveredZoneId) ?? getZoneById(selectedZoneId) ?? activeZone,
    [activeZone, hoveredZoneId, selectedZoneId],
  );

  useEffect(() => {
    document.body.style.cursor = hoveredZoneId && !selectedZoneId ? "pointer" : "default";

    return () => {
      document.body.style.cursor = "default";
    };
  }, [hoveredZoneId, selectedZoneId]);

  useEffect(() => {
    if (!scrollContainer) {
      return;
    }

    scrollContainer.style.overflowY = selectedZoneId ? "hidden" : "auto";

    return () => {
      scrollContainer.style.overflowY = "auto";
    };
  }, [scrollContainer, selectedZoneId]);

  return (
    <main className={styles.shell}>
      <div className={styles.scrollViewport} ref={setScrollContainer}>
        <ScrollController scroller={scrollContainer} onProgress={setProgress} />
        <section className={styles.stage}>
          <div className={styles.stickyScene}>
            <ExperienceCanvas
              progress={progress}
              hoveredZoneId={selectedZoneId ? null : hoveredZoneId}
              selectedZoneId={selectedZoneId}
              isLowPerformance={isLowPerformance}
              onHoverZone={(zoneId) => {
                if (!selectedZoneId) {
                  setHoveredZoneId(zoneId);
                }
              }}
              onSelectZone={setSelectedZoneId}
            />
            <div className={styles.overlay}>
              <div className={styles.kicker}>IMMERSIVE ROCKET PORTFOLIO</div>
              <h1 className={styles.title}>
                {selectedZoneId ? `Entering the ${previewZone.label}.` : "Travel the rocket instead of scrolling a page."}
              </h1>
              <p className={styles.copy}>{previewZone.description}</p>
              <div className={styles.status}>
                <span>Polish Pass</span>
                <span>{previewZone.label}</span>
                {isLowPerformance ? <span>Optimized Mode</span> : null}
              </div>
              <div className={styles.interactionPanel}>
                <span className={styles.interactionEyebrow}>Rocket interface</span>
                <p className={styles.interactionCopy}>
                  {selectedZoneId
                    ? `Camera locked into ${previewZone.shortLabel}. Use the return control to pull back out to the full vessel.`
                    : hoveredZoneId
                    ? `Hovering ${previewZone.shortLabel}. Click to lock this subsystem.`
                    : "Move across the rocket to reveal its interactive regions. Click any section to arm it for entry."}
                </p>
              </div>
              {selectedZoneId ? (
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => {
                    setHoveredZoneId(null);
                    setSelectedZoneId(null);
                  }}
                >
                  Return To Rocket
                </button>
              ) : null}
              <div className={styles.progressBlock}>
                <span className={styles.progressLabel}>Scroll trajectory</span>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ transform: `scaleX(${progress})` }} />
                </div>
              </div>
            </div>
            <SubsystemOverlay zoneId={selectedZoneId} />
          </div>
        </section>
      </div>
    </main>
  );
}

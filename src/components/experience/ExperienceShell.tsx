"use client";

import { useMemo, useState } from "react";
import { ExperienceCanvas } from "./ExperienceCanvas";
import { ScrollController } from "./ScrollController";
import styles from "./ExperienceShell.module.css";
import { getZoneForProgress } from "@/lib/rocketZones";

export function ExperienceShell() {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  const activeZone = useMemo(() => getZoneForProgress(progress), [progress]);

  return (
    <main className={styles.shell}>
      <div className={styles.scrollViewport} ref={setScrollContainer}>
        <ScrollController scroller={scrollContainer} onProgress={setProgress} />
        <section className={styles.stage}>
          <div className={styles.stickyScene}>
            <ExperienceCanvas progress={progress} />
            <div className={styles.overlay}>
              <div className={styles.kicker}>IMMERSIVE ROCKET PORTFOLIO</div>
              <h1 className={styles.title}>Travel the rocket instead of scrolling a page.</h1>
              <p className={styles.copy}>{activeZone.description}</p>
              <div className={styles.status}>
                <span>Stage 2</span>
                <span>{activeZone.label}</span>
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

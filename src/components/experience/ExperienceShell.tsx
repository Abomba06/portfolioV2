"use client";

import { ExperienceCanvas } from "./ExperienceCanvas";
import styles from "./ExperienceShell.module.css";

export function ExperienceShell() {
  return (
    <main className={styles.shell}>
      <ExperienceCanvas />
      <div className={styles.overlay}>
        <div className={styles.kicker}>IMMERSIVE ROCKET PORTFOLIO</div>
        <h1 className={styles.title}>A cinematic 3D vessel, suspended in deep space.</h1>
        <p className={styles.copy}>
          Stage 1 establishes the world: a full-screen 3D rocket scene with premium lighting,
          atmospheric depth, and a stable camera foundation for the interactive experience that
          follows.
        </p>
        <div className={styles.status}>
          <span>Stage 1</span>
          <span>Scene online</span>
        </div>
      </div>
    </main>
  );
}

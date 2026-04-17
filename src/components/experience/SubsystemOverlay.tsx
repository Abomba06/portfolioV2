"use client";

import { ROCKET_CONTENT } from "@/lib/rocketContent";
import { RocketZoneId, getZoneById } from "@/lib/rocketZones";
import styles from "./SubsystemOverlay.module.css";

type SubsystemOverlayProps = {
  zoneId: RocketZoneId | null;
};

export function SubsystemOverlay({ zoneId }: SubsystemOverlayProps) {
  if (!zoneId) {
    return null;
  }

  const zone = getZoneById(zoneId);
  const content = ROCKET_CONTENT[zoneId];

  if (!zone || !content) {
    return null;
  }

  return (
    <aside className={styles.panel} style={{ ["--zone-color" as string]: zone.lightColor }}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>{content.eyebrow}</span>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.intro}>{content.intro}</p>
      </div>

      <div className={styles.sectionGrid}>
        {content.sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <div className={styles.sectionHeading}>{section.heading}</div>
            <div className={styles.cardStack}>
              {section.items.map((item) => (
                <article key={item.title} className={styles.card}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardBody}>{item.body}</p>
                  {item.meta ? <div className={styles.cardMeta}>{item.meta}</div> : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}

"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

type ScrollControllerProps = {
  scroller: HTMLDivElement | null;
  onProgress: (progress: number) => void;
};

export function ScrollController({ scroller, onProgress }: ScrollControllerProps) {
  useLayoutEffect(() => {
    if (!scroller) {
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: scroller,
      scroller,
      start: 0,
      end: () => Math.max(scroller.scrollHeight - scroller.clientHeight, 1),
      scrub: 1.1,
      onUpdate: (self) => onProgress(self.progress),
    });

    onProgress(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      trigger.kill();
    };
  }, [onProgress, scroller]);

  return null;
}

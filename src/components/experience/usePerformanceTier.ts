"use client";

import { useEffect, useState } from "react";

export function usePerformanceTier() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)");
    const hardwareThreads = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

    const updateTier = () => {
      const lowDevice = hardwareThreads <= 4 || memory <= 4;
      setIsLowPerformance(media.matches || lowDevice);
    };

    updateTier();
    media.addEventListener("change", updateTier);

    return () => {
      media.removeEventListener("change", updateTier);
    };
  }, []);

  return { isLowPerformance };
}

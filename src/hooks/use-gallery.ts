"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseGalleryOptions {
  length: number;
  autoPlay?: boolean;
  interval?: number; // ms
}

/**
 * Shared gallery logic: active index, prev/next, keyboard arrows,
 * optional auto-play that pauses on hover/focus.
 */
export function useGallery({ length, autoPlay = true, interval = 5500 }: UseGalleryOptions) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const goTo = useCallback(
    (i: number) => setActive((i + length) % length),
    [length],
  );
  const next = useCallback(() => setActive((i) => (i + 1) % length), [length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + length) % length), [length]);

  // Reset to first when length changes (new destination/tour opened)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(0);
  }, [length]);

  // Keyboard navigation (ArrowLeft / ArrowRight) — respects RTL
  useEffect(() => {
    if (length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      const isRtl = document.documentElement.dir === "rtl";
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isRtl) { prev(); } else { next(); }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isRtl) { next(); } else { prev(); }
      }
    };
    const node = containerRef.current;
    node?.addEventListener("keydown", onKey);
    // Also listen on window as fallback (dialog may not have focus)
    window.addEventListener("keydown", onKey);
    return () => {
      node?.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", onKey);
    };
  }, [length, next, prev]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || length <= 1 || paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % length);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, length, paused, interval]);

  return {
    active,
    goTo,
    next,
    prev,
    setActive: goTo,
    paused,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    containerRef,
  };
}

"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const SCROLL_THRESHOLD = 10;
const TOP_OFFSET = 48;

/** Hide on scroll down, show on scroll up — same behavior as the mobile TOC bar. */
export function useScrollAwareBottomBar(
  isPinnedRef?: RefObject<boolean>
) {
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;

        if (isPinnedRef?.current) {
          setVisible(true);
          lastYRef.current = y;
          ticking = false;
          return;
        }

        const delta = y - lastYRef.current;

        if (y <= TOP_OFFSET) {
          setVisible(true);
        } else if (delta > SCROLL_THRESHOLD) {
          setVisible(false);
        } else if (delta < -SCROLL_THRESHOLD) {
          setVisible(true);
        }

        lastYRef.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPinnedRef]);

  return visible;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useScrollAwareBottomBar } from "@/lib/use-scroll-aware-bottom-bar";

const SCROLL_DOWN_THRESHOLD = 10;

interface MobileBottomBarsContextValue {
  scrollVisible: boolean;
  mobileRevealed: boolean;
  revealMobile: () => void;
  pinBars: () => void;
  unpinBars: () => void;
  /** Scroll-up, chevron tap, or pinned (e.g. input focused) — shared by TOC + ask input */
  barsVisible: boolean;
}

const MobileBottomBarsContext =
  createContext<MobileBottomBarsContextValue | null>(null);

export function MobileBottomBarsProvider({ children }: { children: ReactNode }) {
  const barsPinnedRef = useRef(false);
  const [barsPinned, setBarsPinned] = useState(false);
  const scrollVisible = useScrollAwareBottomBar(barsPinnedRef);
  const [mobileRevealed, setMobileRevealed] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastYRef.current;

        if (!barsPinnedRef.current && delta > SCROLL_DOWN_THRESHOLD) {
          setMobileRevealed(false);
        }

        lastYRef.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const revealMobile = useCallback(() => setMobileRevealed(true), []);

  const pinBars = useCallback(() => {
    barsPinnedRef.current = true;
    setBarsPinned(true);
    setMobileRevealed(true);
  }, []);

  const unpinBars = useCallback(() => {
    barsPinnedRef.current = false;
    setBarsPinned(false);
  }, []);

  const barsVisible = scrollVisible || mobileRevealed || barsPinned;

  return (
    <MobileBottomBarsContext.Provider
      value={{
        scrollVisible,
        mobileRevealed,
        revealMobile,
        pinBars,
        unpinBars,
        barsVisible,
      }}
    >
      {children}
    </MobileBottomBarsContext.Provider>
  );
}

export function useMobileBottomBars() {
  const context = useContext(MobileBottomBarsContext);
  if (!context) {
    throw new Error(
      "useMobileBottomBars must be used within MobileBottomBarsProvider"
    );
  }
  return context;
}

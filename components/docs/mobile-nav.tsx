"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { SupportPopover } from "./support-popover";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { Root } from "fumadocs-core/page-tree";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  tree: Root;
  iconMap: Record<string, string>;
}

export function MobileNav({ open, onClose, tree, iconMap }: MobileNavProps) {
  useEffect(() => {
    const body = document.body;
    if (open) {
      body.classList.add("docs-scroll-lock");
    } else {
      body.classList.remove("docs-scroll-lock");
    }
    return () => {
      body.classList.remove("docs-scroll-lock");
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/50 xl:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "docs-scrollbar fixed inset-y-0 left-0 z-[71] flex w-72 flex-col overflow-y-auto xl:hidden",
              "border-r border-border bg-background"
            )}
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
              <span className="font-semibold">Navigation</span>
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="docs-scrollbar flex-1 overflow-y-auto px-2">
              <Sidebar tree={tree} iconMap={iconMap} />
            </div>

            <div className="shrink-0 border-t px-4 py-3 space-y-2">
              <SupportPopover variant="menu" />

              <Link
                href="https://demo.mediflux.in"
                className={cn(
                  "flex w-full items-center justify-start gap-1 rounded-md px-4 py-2 text-sm font-medium",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90",
                  "transition-colors"
                )}
              >
                Free Demo
                <ChevronRight className="h-4 w-4" />
              </Link>
              <ThemeToggle variant="menu" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SQLDrawerProps {
  sql: string;
}

/**
 * SQLDrawer — A collapsible accordion that hides the raw generated SQL
 * by default, respecting the design decision that most users don't need
 * to see it, but power users can expand it on demand.
 *
 * Uses Framer Motion AnimatePresence for a smooth height animation.
 */
export default function SQLDrawer({ sql }: SQLDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-surface-border bg-surface">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-surface-raised"
        aria-expanded={isOpen}
        aria-controls="sql-drawer-content"
      >
        <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Code2 className="h-3.5 w-3.5 text-brand" />
          View Generated SQL
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </motion.span>
      </button>

      {/* Animated content panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="sql-drawer-content"
            key="sql-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-surface-border p-4">
              <pre
                className={cn(
                  "overflow-x-auto rounded-lg bg-slate-900 p-4",
                  "text-xs leading-relaxed text-emerald-400",
                  "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700"
                )}
              >
                <code>{sql}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

/**
 * ThinkingState — Animated loading indicator shown while the AI agent
 * is fetching the schema, generating SQL, and optionally self-correcting.
 *
 * Uses Framer Motion staggered dot animation — a recognised Beautiful UI
 * pattern for agentic "thinking" states.
 */
export default function ThinkingState() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      {/* Agent avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/20 ring-1 ring-brand/30">
        <Bot className="h-4 w-4 text-brand" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500">AI SQL Agent</span>

        <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-3 shadow-sm">
          {/* Thinking label */}
          <span className="text-sm text-slate-400">Thinking</span>

          <motion.div
            className="flex items-center gap-1"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="initial"
            animate="animate"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-1.5 w-1.5 rounded-full bg-brand"
                variants={{
                  initial: { y: 0, opacity: 0.4 },
                  animate: {
                    y: [0, -6, 0],
                    opacity: [0.4, 1, 0.4],
                  },
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

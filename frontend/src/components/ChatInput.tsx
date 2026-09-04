"use client";

import { useState, useRef, type KeyboardEvent, type FormEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

/**
 * ChatInput — A fixed floating textarea bar at the bottom of the screen.
 *
 * Features:
 * - Auto-grows with content (up to 5 lines) via scrollHeight tracking.
 * - Submits on Enter; inserts a newline on Shift+Enter (natural behaviour).
 * - The Send button is disabled and shows a spinner while the AI is thinking.
 */
export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue("");
    // Reset textarea height after submit
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize: shrink to auto first, then grow to scrollHeight
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`; // max ~5 lines
  };

  const canSubmit = value.trim().length > 0 && !isLoading;

  return (
    <div className="relative px-4 pb-6 pt-2 shrink-0 bg-surface">
      {/* Gradient fade above the input so messages don't feel cut off */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-surface to-transparent" />

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-surface-border bg-surface-raised px-4 py-3 shadow-2xl ring-1 ring-white/5 focus-within:ring-brand/50 transition-shadow"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your data… e.g. 'Show top 5 customers by revenue'"
          disabled={isLoading}
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "leading-relaxed"
          )}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          aria-label="Send question"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
            canSubmit
              ? "bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/30"
              : "bg-surface-border text-slate-600 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </form>

      <p className="mt-2 text-center text-xs text-slate-600">
        Press <kbd className="rounded bg-surface-border px-1 py-0.5 text-slate-400">Enter</kbd> to send ·{" "}
        <kbd className="rounded bg-surface-border px-1 py-0.5 text-slate-400">Shift+Enter</kbd> for a new line
      </p>
    </div>
  );
}

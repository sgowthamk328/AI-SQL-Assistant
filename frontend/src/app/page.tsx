"use client";

import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Database, AlertCircle } from "lucide-react";

import ChatInput from "@/components/ChatInput";
import ThinkingState from "@/components/ThinkingState";
import SQLDrawer from "@/components/SQLDrawer";
import DataTable from "@/components/DataTable";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatResponse } from "@/types/chat";

/**
 * Home — The main AI SQL Assistant chat interface.
 *
 * State:
 * - messages: Full conversation history (user + assistant turns)
 * - isLoading: True while the FastAPI call is in-flight
 *
 * Data Flow:
 * 1. User types a question and presses Enter.
 * 2. handleSubmit() adds a "user" message to history and sets isLoading.
 * 3. A POST is made to /api/chat (Next.js proxies it to FastAPI on :8000).
 * 4. On success, an "assistant" message with the structured data is appended.
 * 5. On failure, an "assistant" error message is appended instead.
 */
export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageIdPrefix = useId();

  // Auto-scroll to the bottom whenever messages change or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (question: string) => {
    const userMessageId = `${messageIdPrefix}-user-${Date.now()}`;
    const assistantMessageId = `${messageIdPrefix}-assistant-${Date.now()}`;

    // 1. Immediately append the user's question to the chat history
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content: question },
    ]);
    setIsLoading(true);

    try {
      // 2. POST to /api/chat — Next.js rewrites this to http://localhost:8000/chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        // Surface the FastAPI error detail cleanly
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          errorBody.detail ?? `Request failed with status ${response.status}`
        );
      }

      const data: ChatResponse = await response.json();

      // 3. Append the assistant's structured response
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: `Found ${data.results.length} result(s) for your question.`,
          data,
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: errorMessage,
          error: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-surface text-slate-100">
      {/* ── Header ── */}
      <header className="flex items-center gap-3 border-b border-surface-border bg-surface-raised px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/20 ring-1 ring-brand/30">
          <Database className="h-5 w-5 text-brand" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-100">AI SQL Assistant</h1>
          <p className="text-xs text-slate-500">Ask questions about your database in plain English</p>
        </div>
      </header>

      {/* ── Message Feed ── */}
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Welcome screen — shown only when chat is empty */}
          {messages.length === 0 && !isLoading && (
            <WelcomeScreen />
          )}

          {/* Message bubbles */}
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {message.role === "user" ? (
                  <UserMessage content={message.content} />
                ) : (
                  <AssistantMessage message={message} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking animation — shown while waiting for FastAPI response */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <ThinkingState />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* ── Input Bar ── */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function WelcomeScreen() {
  const examples = [
    "Show me the top 5 customers by total revenue",
    "Which products were sold more than 100 times?",
    "List all sales from last month grouped by category",
    "Show customers who bought electronics",
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/20 ring-1 ring-brand/30">
        <Database className="h-8 w-8 text-brand" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-100">
          Ask your database anything
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          The AI agent will generate SQL, execute it, and return your data.
        </p>
      </div>
      <div className="grid w-full max-w-lg gap-2">
        {examples.map((ex) => (
          <div
            key={ex}
            className="rounded-xl border border-surface-border bg-surface-raised px-4 py-2.5 text-left text-sm text-slate-400 ring-1 ring-white/5"
          >
            {ex}
          </div>
        ))}
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex items-start justify-end gap-3">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-sm text-white shadow-lg shadow-brand/20">
        {content}
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700">
        <User className="h-4 w-4 text-slate-300" />
      </div>
    </div>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-start gap-3">
      {/* Agent avatar */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1",
        message.error
          ? "bg-red-900/30 ring-red-500/30"
          : "bg-brand/20 ring-brand/30"
      )}>
        {message.error ? (
          <AlertCircle className="h-4 w-4 text-red-400" />
        ) : (
          <Bot className="h-4 w-4 text-brand" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className="mb-1.5 block text-xs font-medium text-slate-500">
          AI SQL Agent
        </span>

        {/* Error state */}
        {message.error ? (
          <div className="rounded-2xl rounded-tl-sm border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            <p className="font-medium">Could not complete your request</p>
            <p className="mt-1 text-xs text-red-500">{message.error}</p>
          </div>
        ) : (
          /* Success state */
          <div>
            <div className="rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-3 text-sm text-slate-300 shadow-sm">
              {message.content}
            </div>
            {message.data && (
              <>
                <DataTable results={message.data.results} />
                <SQLDrawer sql={message.data.generated_sql} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

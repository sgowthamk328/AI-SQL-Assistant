/**
 * TypeScript interfaces that strictly mirror the Pydantic schemas
 * defined in the FastAPI backend (backend/app/schemas/chat_schema.py).
 *
 * Keeping these in sync ensures the fetch() response is fully typed,
 * catching shape mismatches at compile time rather than at runtime.
 */

/** Sent to POST /api/chat */
export interface ChatRequest {
  question: string;
}

/** Received from POST /api/chat on success */
export interface ChatResponse {
  question: string;
  generated_sql: string;
  /** Dynamic rows from the database — keys are column names */
  results: Record<string, unknown>[];
  /**
   * Number of self-correction loops the model performed.
   * 0 = succeeded on first try, 1+ = model corrected itself N times.
   */
  retry_count: number;
}

/** A single entry in the local chat history state */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Only present on assistant messages */
  data?: ChatResponse;
  /** Only present on assistant error messages */
  error?: string;
}

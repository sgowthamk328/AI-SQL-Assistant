"use client";

import { TableIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  results: Record<string, unknown>[];
}

/**
 * DataTable — Renders the dynamic JSON results from FastAPI as a clean,
 * responsive table. Handles three states:
 * 1. Empty results array  → friendly "no data" message
 * 2. Results present      → full table with sticky header
 * 3. Single-column result → still renders as table for consistency
 *
 * Column names are derived dynamically from the first row's keys,
 * meaning it works for any SQL query without hardcoding column names.
 */
export default function DataTable({ results }: DataTableProps) {
  if (results.length === 0) {
    return (
      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface p-6 text-slate-500">
        <TableIcon className="h-4 w-4" />
        <span className="text-sm">The query returned no results.</span>
      </div>
    );
  }

  // Dynamically extract column names from the first row
  const columns = Object.keys(results[0]);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-surface-border bg-surface shadow-sm">
      {/* Scrollable horizontally on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-raised">
              {/* Row number column */}
              <th className="w-12 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {/* Replace underscores with spaces for readability */}
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-b border-surface-border transition-colors",
                  "hover:bg-surface-raised/60",
                  rowIndex === results.length - 1 && "border-b-0"
                )}
              >
                {/* Row number */}
                <td className="px-4 py-3 text-xs text-slate-600">
                  {rowIndex + 1}
                </td>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-slate-300">
                    {formatCellValue(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row count footer */}
      <div className="border-t border-surface-border bg-surface-raised px-4 py-2 text-right text-xs text-slate-500">
        {results.length} {results.length === 1 ? "row" : "rows"} returned
      </div>
    </div>
  );
}

/**
 * Formats a raw cell value into a human-readable string.
 * Handles null, undefined, booleans, numbers, and nested objects.
 */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    // Use locale-aware formatting for large numbers
    return value.toLocaleString();
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

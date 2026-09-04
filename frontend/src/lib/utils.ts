/**
 * cn() — utility to merge Tailwind classes safely.
 * Uses clsx for conditional logic + tailwind-merge to resolve conflicts
 * (e.g. "p-2 p-4" → "p-4").
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

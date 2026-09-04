import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI SQL Assistant",
  description: "Ask questions about your database in plain English. Powered by a local LLM and FastAPI.",
};

/**
 * RootLayout — The top-level layout wrapping every page.
 *
 * Sets up:
 * - Inter font (variable font for optimal performance)
 * - Global dark background via Tailwind base classes
 * - Anti-aliased text rendering
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

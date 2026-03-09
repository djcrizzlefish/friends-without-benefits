import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Friends Without Benefits — World Cup 2026 Fantasy Draft",
  description:
    "Fantasy draft league tracker for the 2026 FIFA World Cup. Track managers, scores, and standings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-900 font-body antialiased">
        <Navbar />
        <main className="pb-20">{children}</main>
      </body>
    </html>
  );
}

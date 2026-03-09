import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "Friends Without Benefits — World Cup 2026 Fantasy Draft",
  description:
    "Fantasy draft league tracker for the 2026 FIFA World Cup. Track managers, scores, and standings.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Friends Without Benefits — World Cup 2026 Fantasy Draft",
    description:
      "Fantasy draft league tracker for the 2026 FIFA World Cup. Track managers, scores, and standings.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Friends Without Benefits — World Cup 2026 Fantasy Draft",
    description:
      "Fantasy draft league tracker for the 2026 FIFA World Cup.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-900 font-body antialiased">
        <LoadingScreen />
        <Navbar />
        <main className="pb-20">{children}</main>
      </body>
    </html>
  );
}

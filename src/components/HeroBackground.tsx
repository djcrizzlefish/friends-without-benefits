"use client";

import { useMemo } from "react";

// Country codes for the 48 qualified nations
const ALL_CODES = [
  "US", "CA", "MX", "FR", "ES", "DE", "GB-ENG", "IT", "NL", "CH",
  "BE", "PT", "PL", "FI", "DK", "SE", "IE", "RS", "HR", "AT",
  "GR", "SI", "BR", "AR", "CO", "EC", "PY", "UY", "GH", "NG",
  "CI", "CM", "MA", "DZ", "TN", "ZA", "JP", "KR", "QA", "AE",
  "IR", "TH", "NZ", "AU", "SA", "WLS", "SCO", "SN",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface FloatingFlag {
  code: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  driftDuration: number;
  driftDelay: number;
  driftX: number;
  driftY: number;
}

function generateFlags(count: number): FloatingFlag[] {
  const codes = shuffle(ALL_CODES).slice(0, count);
  return codes.map((code) => ({
    code,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 25 + Math.random() * 20,
    opacity: 0.06 + Math.random() * 0.04,
    // 40-80 second drift loops — very slow, ambient
    driftDuration: 40 + Math.random() * 40,
    driftDelay: -(Math.random() * 40),
    // Gentle drift distances
    driftX: -20 + Math.random() * 40,
    driftY: -(30 + Math.random() * 40),
  }));
}

function flagUrl(code: string): string {
  const c = code.toLowerCase();
  return `https://flagcdn.com/w80/${c}.png`;
}

export default function HeroBackground() {
  // 15 flags on desktop, 8 on mobile
  const flags = useMemo(() => generateFlags(15), []);
  const mobileFlags = useMemo(() => flags.slice(0, 8), [flags]);

  return (
    <>
      {/* Layer 1: Animated gradient mesh */}
      <div className="hero-gradient-mesh" />

      {/* Layer 2: Floating flags — full set for desktop */}
      <div className="hero-flags-container hidden sm:block" aria-hidden="true">
        {flags.map((f, i) => (
          <img
            key={i}
            src={flagUrl(f.code)}
            alt=""
            className="hero-floating-flag"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: `${f.size}px`,
              opacity: f.opacity,
              animationDuration: `${f.driftDuration}s`,
              animationDelay: `${f.driftDelay}s`,
              ["--drift-x" as string]: `${f.driftX}px`,
              ["--drift-y" as string]: `${f.driftY}px`,
            }}
            loading="eager"
          />
        ))}
      </div>

      {/* Layer 2: Floating flags — reduced set for mobile */}
      <div className="hero-flags-container sm:hidden" aria-hidden="true">
        {mobileFlags.map((f, i) => (
          <img
            key={i}
            src={flagUrl(f.code)}
            alt=""
            className="hero-floating-flag"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: `${f.size}px`,
              opacity: f.opacity,
              animationDuration: `${f.driftDuration}s`,
              animationDelay: `${f.driftDelay}s`,
              ["--drift-x" as string]: `${f.driftX}px`,
              ["--drift-y" as string]: `${f.driftY}px`,
            }}
            loading="eager"
          />
        ))}
      </div>
    </>
  );
}

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
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  rotation: number;
}

function generateFlags(count: number): FloatingFlag[] {
  const codes = shuffle(ALL_CODES).slice(0, count);
  return codes.map((code) => ({
    code,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 25 + Math.random() * 20,
    opacity: 0.06 + Math.random() * 0.04,
    duration: 20 + Math.random() * 20,
    delay: -(Math.random() * 30),
    driftX: -30 + Math.random() * 60,
    driftY: -(40 + Math.random() * 60),
    rotation: -10 + Math.random() * 20,
  }));
}

function flagUrl(code: string): string {
  // Use flagcdn.com — the same CDN used by the Flag component
  const c = code.toLowerCase();
  return `https://flagcdn.com/w80/${c}.png`;
}

export default function HeroBackground() {
  // Generate flag data once on mount
  const flags = useMemo(() => generateFlags(24), []);
  const mobileFlags = useMemo(() => flags.slice(0, 12), [flags]);

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
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              ["--drift-x" as string]: `${f.driftX}px`,
              ["--drift-y" as string]: `${f.driftY}px`,
              ["--rotation" as string]: `${f.rotation}deg`,
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
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              ["--drift-x" as string]: `${f.driftX}px`,
              ["--drift-y" as string]: `${f.driftY}px`,
              ["--rotation" as string]: `${f.rotation}deg`,
            }}
            loading="eager"
          />
        ))}
      </div>
    </>
  );
}

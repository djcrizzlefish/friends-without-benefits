"use client";

import dynamic from "next/dynamic";

const GlobeHero = dynamic(() => import("./GlobeHero"), { ssr: false });

export default function HeroSection() {
  return (
    <header className="relative pt-12 pb-10 sm:pt-20 sm:pb-14 text-center overflow-hidden">
      <GlobeHero />
      <div className="relative z-10">
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight gradient-gold leading-none">
          FRIENDS WITHOUT
          <br />
          BENEFITS
        </h1>
        <p className="mt-4 text-gray-400 text-base sm:text-lg font-medium tracking-wide uppercase">
          World Cup 2026 Fantasy Draft
        </p>
        <div className="mt-3 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      </div>
    </header>
  );
}

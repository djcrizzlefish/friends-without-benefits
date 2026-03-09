"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ManagerStanding, Team } from "@/lib/types";
import ManagerPhoto from "./ManagerPhoto";
import Flag from "./Flag";
import AnimatedNumber from "./AnimatedNumber";

interface LeaderboardProps {
  standings: ManagerStanding[];
  teams: Team[];
}

function PointChangeBadge({ change }: { change: number }) {
  if (change === 0) return null;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-pitch-green/15 text-pitch-green"
    >
      +{change}
    </motion.span>
  );
}

function EliminationCounter({
  alive,
  total,
}: {
  alive: number;
  total: number;
}) {
  let colorClass = "text-pitch-green";
  if (alive <= 1) colorClass = "text-pitch-red";
  else if (alive <= 3) colorClass = "text-yellow-400";

  return (
    <span className={`text-[10px] sm:text-xs font-medium ${colorClass}`}>
      {alive}/{total} alive
    </span>
  );
}

/* Magnetic tilt card for desktop */
function TiltCard({
  children,
  className,
  isFirst,
}: {
  children: React.ReactNode;
  className: string;
  isFirst: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const isFine =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: fine)").matches;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isFine || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;

      // Update CSS custom properties for the shine effect
      cardRef.current.style.setProperty("--mouse-x", `${pctX}%`);
      cardRef.current.style.setProperty("--mouse-y", `${pctY}%`);

      setStyle({
        transform: `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`,
        transition: "transform 100ms ease",
      });
    },
    [isFine]
  );

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: "perspective(800px) rotateY(0deg) rotateX(0deg)",
      transition: "transform 300ms ease",
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${className} ripple-container`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}

export default function Leaderboard({ standings, teams }: LeaderboardProps) {
  const teamMap = new Map(teams.map((t) => [t.name, t]));
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  if (standings.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <p className="font-display text-2xl text-gray-400">
          No managers registered yet
        </p>
        <p className="mt-2 text-gray-500">
          Add managers to managers.json to get started
        </p>
      </div>
    );
  }

  return (
    <section ref={sectionRef}>
      <div className="space-y-3">
        {standings.map((standing, i) => {
          const isFirst = standing.rank === 1;
          const isOdd = i % 2 === 0;

          return (
            <motion.div
              key={standing.id}
              initial={{
                opacity: 0,
                x: isOdd ? -60 : 60,
                rotate: isOdd ? -2 : 2,
              }}
              animate={
                isInView ? { opacity: 1, x: 0, rotate: 0 } : {}
              }
              transition={{
                delay: i * 0.05,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Link href={`/managers/${standing.id}`}>
                <TiltCard
                  isFirst={isFirst}
                  className={`glass-card rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-white/10 transition-all duration-300 cursor-pointer group relative ${
                    isFirst
                      ? "gold-glow border-gold-400/20 gold-pulse"
                      : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 sm:w-10 text-center shrink-0">
                    {isFirst ? (
                      <span className="text-2xl" title="Leader">
                        🏆
                      </span>
                    ) : (
                      <span
                        className="font-display text-xl sm:text-2xl font-bold text-gray-500 inline-block rank-flip"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {standing.rank}
                      </span>
                    )}
                  </div>

                  {/* Photo with Ken Burns */}
                  <div className="ken-burns-container shrink-0">
                    <ManagerPhoto
                      src={standing.photo}
                      name={standing.name}
                      size="sm"
                      className={isFirst ? "border-gold-400/50" : ""}
                    />
                  </div>

                  {/* Name & Flags */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-display text-base sm:text-lg font-semibold truncate manager-name-hover group-hover:text-gold-400 transition-colors ${
                          isFirst ? "text-gold-400" : "text-white"
                        }`}
                      >
                        {standing.name}
                      </p>
                      <EliminationCounter
                        alive={standing.teamsAlive}
                        total={standing.teamsTotal}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {standing.teamStats.map((ts, flagIdx) => {
                        const team = teamMap.get(ts.name);
                        const isEliminated =
                          team?.eliminated || ts.eliminated;
                        return (
                          <span
                            key={ts.name}
                            className={`inline-block group-hover:flag-bounce ${
                              isEliminated ? "grayscale opacity-50" : ""
                            }`}
                            style={{
                              animationDelay: `${flagIdx * 60}ms`,
                            }}
                          >
                            <Flag code={ts.code} size="sm" />
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-2 justify-end">
                      <div
                        className={`font-display text-2xl sm:text-3xl font-bold point-glow point-glow-enter ${
                          isFirst ? "text-gold-400" : "text-white"
                        }`}
                      >
                        <AnimatedNumber value={standing.totalPoints} />
                      </div>
                      <PointChangeBadge change={standing.pointChange} />
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                      pts
                    </p>
                  </div>

                  {/* Chevron arrow to indicate clickability */}
                  <div className="shrink-0 text-gray-600 group-hover:text-gold-400 transition-colors ml-1 hidden sm:block">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

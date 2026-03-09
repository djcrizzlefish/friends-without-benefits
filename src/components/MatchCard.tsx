"use client";

import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Match } from "@/lib/types";
import { getTeamCode, formatDate } from "@/lib/data";
import Flag from "./Flag";

interface MatchCardProps {
  match: Match;
  index?: number;
  teamOwnerMap?: Map<string, { id: string; name: string }>;
}

function HeadToHeadBanner({
  match,
  teamOwnerMap,
}: {
  match: Match;
  teamOwnerMap: Map<string, { id: string; name: string }>;
}) {
  const owner1 = teamOwnerMap.get(match.team1);
  const owner2 = teamOwnerMap.get(match.team2);
  if (!owner1 && !owner2) return null;

  if (owner1 && owner2 && owner1.id === owner2.id) {
    return (
      <div className="mb-3 px-3 py-1.5 rounded-lg bg-gold-400/5 border border-gold-400/10 text-center">
        <span className="text-[11px] text-gold-400/80 font-medium">
          Both teams owned by{" "}
          <Link
            href={`/managers/${owner1.id}`}
            className="underline hover:text-gold-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {owner1.name}
          </Link>
        </span>
      </div>
    );
  }

  if (owner1 && owner2) {
    return (
      <div className="mb-3 px-3 py-1.5 rounded-lg bg-pitch-red/5 border border-pitch-red/15 text-center">
        <span className="text-[11px] font-medium text-gray-300">
          ⚔️{" "}
          <Link
            href={`/managers/${owner1.id}`}
            className="text-gold-400 underline hover:text-gold-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {owner1.name}
          </Link>
          {"'s "}
          {match.team1} vs{" "}
          <Link
            href={`/managers/${owner2.id}`}
            className="text-gold-400 underline hover:text-gold-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {owner2.name}
          </Link>
          {"'s "}
          {match.team2}
        </span>
      </div>
    );
  }
  return null;
}

export default function MatchCard({
  match,
  index = 0,
  teamOwnerMap,
}: MatchCardProps) {
  const code1 = getTeamCode(match.team1);
  const code2 = getTeamCode(match.team2);
  const team1Won = match.outcome === "team1";
  const team2Won = match.outcome === "team2";
  const isKnockout = match.stage !== "Group Stage";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const hasH2H =
    teamOwnerMap &&
    teamOwnerMap.has(match.team1) &&
    teamOwnerMap.has(match.team2) &&
    teamOwnerMap.get(match.team1)!.id !== teamOwnerMap.get(match.team2)!.id;

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(4px)", y: 20 }}
      animate={
        isInView
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : {}
      }
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={handleClick}
      className={`glass-card rounded-xl p-4 sm:p-5 hover:border-white/10 transition-all duration-300 ripple-container relative ${
        hasH2H ? "border-pitch-red/20" : ""
      }`}
    >
      {teamOwnerMap && (
        <HeadToHeadBanner match={match} teamOwnerMap={teamOwnerMap} />
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gold-400 uppercase tracking-wider">
          {match.stage}
        </span>
        <span className="text-xs text-gray-500">{formatDate(match.date)}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-3">
          <Flag code={code1} size="lg" />
          <div className="min-w-0">
            <p
              className={`font-display text-sm sm:text-base font-semibold truncate ${
                team1Won ? "text-white" : "text-gray-400"
              }`}
            >
              {match.team1}
            </p>
            {match.advancement1 && (
              <span className="text-[10px] text-pitch-green font-medium">
                {match.advancement1}
              </span>
            )}
            {isKnockout && team2Won && !match.advancement1 && (
              <span className="text-[10px] text-pitch-red font-medium">
                💀 Eliminated
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-3">
          <span
            className={`font-display text-2xl sm:text-3xl font-bold ${
              team1Won ? "text-white" : "text-gray-500"
            }`}
          >
            {match.goals1}
          </span>
          <span className="text-gray-600 font-display text-lg">–</span>
          <span
            className={`font-display text-2xl sm:text-3xl font-bold ${
              team2Won ? "text-white" : "text-gray-500"
            }`}
          >
            {match.goals2}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end gap-3">
          <div className="min-w-0 text-right">
            <p
              className={`font-display text-sm sm:text-base font-semibold truncate ${
                team2Won ? "text-white" : "text-gray-400"
              }`}
            >
              {match.team2}
            </p>
            {match.advancement2 && (
              <span className="text-[10px] text-pitch-green font-medium">
                {match.advancement2}
              </span>
            )}
            {isKnockout && team1Won && !match.advancement2 && (
              <span className="text-[10px] text-pitch-red font-medium">
                💀 Eliminated
              </span>
            )}
          </div>
          <Flag code={code2} size="lg" />
        </div>
      </div>
    </motion.div>
  );
}

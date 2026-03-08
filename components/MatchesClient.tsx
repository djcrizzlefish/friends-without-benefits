"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Match } from "@/lib/types";
import MatchCard from "./MatchCard";

const STAGES = [
  "All",
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
];

interface Props {
  matches: Match[];
}

export default function MatchesClient({ matches }: Props) {
  const [activeStage, setActiveStage] = useState("All");

  const filtered =
    activeStage === "All"
      ? matches
      : matches.filter((m) => m.stage === activeStage);

  // Sort most recent first
  const sorted = [...filtered].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 sm:pt-12">
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
        MATCHES
      </h1>
      <p className="text-gray-500 mb-8">
        All results from the tournament
      </p>

      {/* Stage filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {STAGES.map((stage) => {
          const count =
            stage === "All"
              ? matches.length
              : matches.filter((m) => m.stage === stage).length;
          if (count === 0 && stage !== "All") return null;
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeStage === stage
                  ? "bg-gold-400 text-navy-900"
                  : "bg-navy-700 text-gray-400 hover:bg-navy-600 hover:text-gray-200"
              }`}
            >
              {stage}
              {count > 0 && (
                <span className="ml-1.5 text-xs opacity-70">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Match cards */}
      {sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <div className="text-5xl mb-4">⚽</div>
          <h2 className="font-display text-2xl text-gray-300 mb-2">
            Tournament Kicks Off Soon
          </h2>
          <p className="text-gray-500">
            Match results will appear here once the World Cup begins.
          </p>
          <p className="text-gray-600 mt-4 text-sm">
            June 11, 2026 — The wait is almost over
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {sorted.map((match, i) => (
            <MatchCard key={match.id} match={match} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

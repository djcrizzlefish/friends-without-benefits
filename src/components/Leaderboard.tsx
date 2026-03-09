"use client";

import { motion } from "framer-motion";
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
  if (change === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gray-700/50 text-gray-500">
        +0
      </span>
    );
  }
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

function EliminationCounter({ alive, total }: { alive: number; total: number }) {
  let colorClass = "text-pitch-green";
  if (alive <= 1) colorClass = "text-pitch-red";
  else if (alive <= 3) colorClass = "text-yellow-400";

  return (
    <span className={`text-[10px] sm:text-xs font-medium ${colorClass}`}>
      {alive}/{total} alive
    </span>
  );
}

export default function Leaderboard({ standings, teams }: LeaderboardProps) {
  const teamMap = new Map(teams.map((t) => [t.name, t]));

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
    <section>
      <div className="space-y-3">
        {standings.map((standing, i) => {
          const isFirst = standing.rank === 1;
          return (
            <motion.div
              key={standing.id}
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                layout: { type: "spring", stiffness: 300, damping: 30 },
              }}
            >
              <Link href={`/managers/${standing.id}`}>
                <div
                  className={`glass-card rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-white/10 transition-all duration-300 cursor-pointer group ${
                    isFirst ? "gold-glow border-gold-400/20 gold-pulse" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 sm:w-10 text-center shrink-0">
                    {isFirst ? (
                      <span className="text-2xl" title="Leader">
                        👑
                      </span>
                    ) : (
                      <span className="font-display text-xl sm:text-2xl font-bold text-gray-500">
                        {standing.rank}
                      </span>
                    )}
                  </div>

                  {/* Photo */}
                  <ManagerPhoto
                    src={standing.photo}
                    name={standing.name}
                    size="sm"
                    className={isFirst ? "border-gold-400/50" : ""}
                  />

                  {/* Name & Flags */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-display text-base sm:text-lg font-semibold truncate group-hover:text-gold-400 transition-colors ${
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
                      {standing.teamStats.map((ts) => {
                        const team = teamMap.get(ts.name);
                        const isEliminated = team?.eliminated || ts.eliminated;
                        return (
                          <span
                            key={ts.name}
                            className={isEliminated ? "grayscale opacity-50" : ""}
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
                        className={`font-display text-2xl sm:text-3xl font-bold ${
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
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

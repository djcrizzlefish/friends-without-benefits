"use client";

import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ManagerStanding } from "@/lib/types";
import { formatDate } from "@/lib/data";
import ManagerPhoto from "./ManagerPhoto";
import Flag from "./Flag";

interface Props {
  standing: ManagerStanding;
}

export default function ManagerDetailClient({ standing }: Props) {
  const sortedTeams = [...standing.teamStats].sort((a, b) => {
    if (a.eliminated && !b.eliminated) return 1;
    if (!a.eliminated && b.eliminated) return -1;
    return b.totalPoints - a.totalPoints;
  });

  const teamsRef = useRef(null);
  const teamsInView = useInView(teamsRef, { once: true, margin: "-30px" });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 sm:pt-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold-400 transition-colors mb-8"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Leaderboard
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10"
      >
        <div className="ken-burns-container shrink-0">
          <ManagerPhoto
            src={standing.photo}
            name={standing.name}
            size="lg"
            className="border-gold-400/30"
          />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white manager-name-hover">
            {standing.name}
          </h1>
          <div className="mt-2 flex items-center justify-center sm:justify-start gap-4">
            <span className="text-sm text-gray-400">
              Rank{" "}
              <span className="font-display text-xl font-bold text-gold-400">
                #{standing.rank}
              </span>
            </span>
            <span className="text-gray-600">|</span>
            <span className="font-display text-2xl font-bold text-white point-glow">
              {standing.totalPoints}{" "}
              <span className="text-sm text-gray-500 ml-1">pts</span>
            </span>
            {standing.pointChange > 0 && (
              <>
                <span className="text-gray-600">|</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-pitch-green/15 text-pitch-green">
                  +{standing.pointChange}
                </span>
              </>
            )}
          </div>
          <div className="mt-2">
            <span
              className={`text-xs font-medium ${
                standing.teamsAlive <= 1
                  ? "text-pitch-red"
                  : standing.teamsAlive <= 3
                  ? "text-yellow-400"
                  : "text-pitch-green"
              }`}
            >
              {standing.teamsAlive}/{standing.teamsTotal} teams alive
            </span>
          </div>
        </div>
      </motion.div>

      {/* Points Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-10"
      >
        {[
          {
            label: "Total Points",
            value: standing.totalPoints,
            color: "text-gold-400",
          },
          {
            label: "Match Points",
            value: standing.matchPoints,
            color: "text-white",
          },
          {
            label: "Advancement",
            value: standing.advancementPoints,
            color: "text-pitch-green",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
            <p className={`font-display text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Team Cards */}
      <h2 className="font-display text-xl font-bold text-white mb-4 uppercase tracking-wider">
        Drafted Teams
      </h2>
      <div ref={teamsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {sortedTeams.map((team, i) => {
          const isEliminated = team.eliminated;
          return (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, y: 20 }}
              animate={teamsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`glass-card rounded-xl p-4 sm:p-5 transition-all ${
                isEliminated ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={isEliminated ? "grayscale opacity-50" : ""}>
                  <Flag code={team.code} size="lg" />
                </span>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-display text-lg font-semibold truncate ${
                      isEliminated ? "text-gray-500" : "text-white"
                    }`}
                  >
                    {team.name}
                  </h3>
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      team.status === "champion"
                        ? "text-gold-400"
                        : isEliminated
                        ? "text-pitch-red"
                        : "text-pitch-green"
                    }`}
                  >
                    {team.status === "champion"
                      ? "🏆 Champion"
                      : isEliminated
                      ? "💀 Eliminated"
                      : "Active"}
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className={`font-display text-2xl font-bold ${
                      isEliminated ? "text-gray-500" : "text-white"
                    }`}
                  >
                    {team.totalPoints}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">pts</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="font-display text-lg font-bold text-pitch-green">
                    {team.wins}
                  </p>
                  <p className="text-gray-500">W</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-gray-400">
                    {team.draws}
                  </p>
                  <p className="text-gray-500">D</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-pitch-red">
                    {team.losses}
                  </p>
                  <p className="text-gray-500">L</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    {team.goalsScored}
                  </p>
                  <p className="text-gray-500">GF</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Matches */}
      <h2 className="font-display text-xl font-bold text-white mb-4 uppercase tracking-wider">
        Match Results
      </h2>
      {standing.teamStats.flatMap((ts) => ts.matches).length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center text-gray-500">
          No matches played yet
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {standing.teamStats
            .flatMap((ts) =>
              ts.matches.map((m) => ({
                ...m,
                teamName: ts.name,
                teamCode: ts.code,
                teamEliminated: ts.eliminated,
              }))
            )
            .sort(
              (a, b) =>
                b.date.localeCompare(a.date) || b.matchId - a.matchId
            )
            .map((m, i) => (
              <motion.div
                key={`${m.matchId}-${m.teamName}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                className="glass-card rounded-lg p-3 sm:p-4 flex items-center gap-3"
              >
                <span
                  className={
                    m.teamEliminated ? "grayscale opacity-50" : ""
                  }
                >
                  <Flag code={m.teamCode} size="sm" />
                </span>
                <span
                  className={`font-display text-sm font-semibold min-w-0 truncate ${
                    m.teamEliminated ? "text-gray-500" : "text-white"
                  }`}
                >
                  {m.teamName}
                </span>
                <span
                  className={`font-display text-lg font-bold shrink-0 ${
                    m.result === "W"
                      ? "text-pitch-green"
                      : m.result === "L"
                      ? "text-pitch-red"
                      : "text-gray-400"
                  }`}
                >
                  {m.goalsFor}–{m.goalsAgainst}
                </span>
                <span className="text-sm text-gray-500">vs</span>
                <Flag code={m.opponentCode} size="sm" />
                <span className="text-sm text-gray-400 truncate min-w-0">
                  {m.opponent}
                </span>
                <span className="ml-auto text-xs text-gray-600 shrink-0 hidden sm:block">
                  {m.stage}
                </span>
                <span
                  className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${
                    m.result === "W"
                      ? "bg-pitch-green/10 text-pitch-green"
                      : m.result === "L"
                      ? "bg-pitch-red/10 text-pitch-red"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  +{m.pointsEarned}
                </span>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}

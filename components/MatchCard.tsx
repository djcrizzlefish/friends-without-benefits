"use client";

import { motion } from "framer-motion";
import { Match } from "@/lib/types";
import { getTeamCode, formatDate } from "@/lib/data";
import Flag from "./Flag";

interface MatchCardProps {
  match: Match;
  index?: number;
}

export default function MatchCard({ match, index = 0 }: MatchCardProps) {
  const code1 = getTeamCode(match.team1);
  const code2 = getTeamCode(match.team2);

  const team1Won = match.outcome === "team1";
  const team2Won = match.outcome === "team2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card rounded-xl p-4 sm:p-5 hover:border-white/10 transition-all duration-300"
    >
      {/* Stage & Date */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gold-400 uppercase tracking-wider">
          {match.stage}
        </span>
        <span className="text-xs text-gray-500">{formatDate(match.date)}</span>
      </div>

      {/* Score */}
      <div className="flex items-center justify-between gap-3">
        {/* Team 1 */}
        <div className="flex-1 flex items-center gap-3">
          <Flag code={code1} size="lg" />
          <div className="min-w-0">
            <p
              className={`font-display text-sm wm:text-base font-semibold truncate ${
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
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 px-3">
          <span
            className={`font-display text-2xl sm:text-3xl font-bold ${
              team1Won ? "text-white" : "text-gray-500"
            }`}
          >
            {match.goals1}
          </span>
          <span className="text-gray-600 font-display text-lg">â€“</span>
          <span
            className={`font-display text-2xl sm:text-3xl font-bold ${
              team2Won ? "text-white" : "text-gray-500"
            }`}
          >
            {match.goals2}
          </span>
        </div>

        {/* Team 2 */}
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
          </div>
          <Flag code={code2} size="lg" />
        </div>
      </div>
    </motion.div>
  )5ßI–
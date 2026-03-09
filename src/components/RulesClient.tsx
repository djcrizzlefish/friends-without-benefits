"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  managerCount: number;
  pot: number;
  entryFee: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function RulesClient({ managerCount, pot, entryFee }: Props) {
  const first = Math.round(pot * 0.5);
  const second = Math.round(pot * 0.3);
  const third = Math.round(pot * 0.2);

  const sections = [
    {
      icon: "🏟",
      title: "League Format",
      items: [
        `${managerCount} managers, $${entryFee} entry fee each`,
        "Snake draft — all 48 World Cup teams are distributed among managers",
        "Each manager drafts an equal share of the 48 teams",
        "Points accumulate across all your teams throughout the tournament",
        "Highest total points at the end wins",
      ],
    },
    {
      icon: "⚽",
      title: "Match Scoring",
      items: [
        "Win: 2 points",
        "Draw (after 90 minutes): 1 point to each team",
        "3+ goals scored by a team in a match: 1 bonus point",
        "These points apply every match, group stage through the final",
      ],
    },
    {
      icon: "📈",
      title: "Advancement Bonuses",
      items: [
        "Round of 32: 5 points",
        "Round of 16: 7 points",
        "Quarterfinals: 10 points",
        "Semifinals: 15 points",
        "Final: 20 points",
        "Champion: 25 points",
      ],
    },
    {
      icon: "⚖️",
      title: "Knockout Round Rules",
      items: [
        "If a knockout match is tied after 90 minutes, both teams get the 1-point draw",
        "The team that advances (via extra time or penalties) gets the 2-point win and the advancement bonus",
        "A penalty shootout win counts as a win (2 points)",
        "Goals in extra time count toward the 3+ goal bonus",
        "Penalty shootout goals do NOT count toward the 3+ goal bonus",
      ],
    },
    {
      icon: "🏆",
      title: "Tiebreakers",
      items: [
        "1st tiebreaker: Most total advancement bonus points",
        "2nd tiebreaker: Most total wins across all teams",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 sm:pt-12">
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
        RULES
      </h1>
      <p className="text-gray-500 mb-10">
        Everything you need to know about the league
      </p>

      {/* Payout Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 sm:p-8 mb-8 gold-glow border-gold-400/20"
      >
        <h2 className="font-display text-2xl font-bold text-gold-400 mb-1">
          💰 Prize Pool
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {managerCount} managers × ${entryFee} entry ={" "}
          <span className="text-white font-bold">${pot} total pot</span>
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-1">🥇</div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-gold-400">
              ${first}
            </p>
            <p className="text-xs text-gray-500 mt-1">1st Place (50%)</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">🥈</div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-gray-300">
              ${second}
            </p>
            <p className="text-xs text-gray-500 mt-1">2nd Place (30%)</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">🥉</div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-amber-700">
              ${third}
            </p>
            <p className="text-xs text-gray-500 mt-1">3rd Place (20%)</p>
          </div>
        </div>
      </motion.div>

      {/* Rule sections */}
      <div className="space-y-4 mb-12">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={cardVariants}
            className="glass-card rounded-xl p-5 sm:p-6"
          >
            <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-xl">{section.icon}</span>
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className="text-gold-400 mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

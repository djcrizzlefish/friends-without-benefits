"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";

function Counter({ value, delay }: { value: number; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => spring.set(value), delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, spring, value, delay]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

interface Props {
  totalManagers: number;
  teamsDrafted: number;
  matchesPlayed: number;
  totalGoals: number;
}

export default function StatCounters({
  totalManagers,
  teamsDrafted,
  matchesPlayed,
  totalGoals,
}: Props) {
  const stats = [
    { label: "Managers", value: totalManagers },
    { label: "Teams Drafted", value: teamsDrafted },
    { label: "Matches Played", value: matchesPlayed },
    { label: "Total Goals", value: totalGoals },
  ];

  return (
    <section className="mt-12 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="glass-card rounded-xl p-4 sm:p-5 text-center"
          >
            <p className="font-display text-3xl sm:text-4xl font-bold text-white">
              <Counter value={stat.value} delay={i * 200} />
            </p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  className = "",
}: AnimatedNumberProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}

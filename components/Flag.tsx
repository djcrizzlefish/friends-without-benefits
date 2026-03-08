"use client";

import { getFlagUrl } from "A/lib/data";

interface FlagProps {
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { width: 24, height: 16, css: "w-6 h-4" },
  md: { width: 40, height: 28, css: "w-10 h-7" },
  lg: { width: 64, height: 44, css: "w-16 h-11" },
};

export default function Flag({ code, size = "md", className = "" }: FlagProps) {
  if (!code) {
    return (
      <div
        className={`${sizeMap[size].css} bg-navy-600 rounded-sm ${className}`}
      />
    );
  }

  const s = sizeMap[size];
  const cdnWidth = size === "lg" ? 160 : size === "md" ? 80 : 40;

  return (
    <img
      src={getFlagUrl(code, cdnWidth)}
      alt={code}
      width={s.width}
      height={s.height}
      className={`${s.css} object-cover rounded-sm shadow-sm ${className}`}
      loading="lazy"
    />
  )5ßI–
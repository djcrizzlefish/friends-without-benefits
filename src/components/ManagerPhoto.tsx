"use client";

import { useState } from "react";

interface ManagerPhotoProps {
  src: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-lg",
  lg: "w-24 h-24 text-3xl",
};

export default function ManagerPhoto({
  src,
  name,
  size = "md",
  className = "",
}: ManagerPhotoProps) {
  const [hasError, setHasError] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (hasError || !src) {
    return (
      <div
        className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-navy-600 to-navy-700 border-2 border-navy-600 flex items-center justify-center font-display font-bold text-gold-400 shrink-0 ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${sizeMap[size]} rounded-full object-cover border-2 border-navy-600 shrink-0 ${className}`}
      onError={() => setHasError(true)}
    />
  );
}

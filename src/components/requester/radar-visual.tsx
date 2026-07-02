/**
 * RadarVisual
 * Abstract animated proximity visualization for the seeking state.
 * Uses concentric expanding rings — NOT a real map.
 * Respects prefers-reduced-motion with static fallback.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";

const RING_COUNT = 3;
const RING_DELAYS = [0, 1.2, 2.4];

export function RadarVisual() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "240px", height: "240px" }}
      aria-hidden="true"
    >
      {/* Expanding rings */}
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        prefersReduced ? (
          /* Static rings for reduced-motion */
          <div
            key={i}
            className="absolute rounded-full border border-[var(--hc-violet)]"
            style={{
              width: `${80 + i * 50}px`,
              height: `${80 + i * 50}px`,
              opacity: 0.15 - i * 0.04,
            }}
          />
        ) : (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[var(--hc-violet)]"
            style={{
              width: "60px",
              height: "60px",
            }}
            animate={{
              width: ["60px", "240px"],
              height: ["60px", "240px"],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 3.6,
              delay: RING_DELAYS[i],
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )
      ))}

      {/* Center dot — user's position */}
      <div className="relative z-10">
        <div className="w-4 h-4 rounded-full bg-[var(--hc-violet)]" />
        {!prefersReduced && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--hc-violet)]"
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </div>

      {/* Subtle label */}
      <div
        className="absolute bottom-2 text-center"
        style={{ width: "200px" }}
      >
        <span className="text-[var(--hc-text-xs)] text-[var(--hc-violet)] opacity-60">
          Searching nearby
        </span>
      </div>
    </div>
  );
}

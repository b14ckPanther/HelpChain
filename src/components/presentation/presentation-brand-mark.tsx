'use client';

/**
 * PresentationBrandMark
 * Presentation-sized Helpchain brand mark with animated rings.
 */

import { motion, useReducedMotion } from 'framer-motion';

interface PresentationBrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: { outer: 56, mid: 40, core: 20 },
  md: { outer: 80, mid: 56, core: 32 },
  lg: { outer: 96, mid: 72, core: 40 },
};

export function PresentationBrandMark({ size = 'md', className = '' }: PresentationBrandMarkProps) {
  const reduced = useReducedMotion();
  const s = SIZE_MAP[size];

  return (
    <div className={`pres-brand-mark ${className}`} aria-hidden="true" style={{ width: s.outer, height: s.outer }}>
      <motion.div
        className="pres-brand-ring"
        style={{ width: s.outer, height: s.outer, opacity: 0.2 }}
        animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
        transition={reduced ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pres-brand-ring"
        style={{ width: s.mid, height: s.mid, opacity: 0.4 }}
        animate={reduced ? undefined : { scale: [1, 1.05, 1] }}
        transition={reduced ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <div className="pres-brand-core" style={{ width: s.core, height: s.core }} />
    </div>
  );
}

'use client';

/**
 * Slide 13 — Matching Algorithm
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Radar, Filter, ArrowDownUp, BellRing, Timer, IterationCcw, Route } from 'lucide-react';
import { SLIDE_13 } from '../presentation-copy';
import { PresentationSlideShell } from '../presentation-slide-shell';

const ICONS = { Radar, Filter, ArrowDownUp, BellRing, Timer, IterationCcw, Route } as const;

export function Slide13Matching() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '1.5rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_13.title}
        </motion.h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {SLIDE_13.steps.map((step, i) => {
            const IconComp = ICONS[step.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={step.label}
                className="pres-card--step"
                initial={reduced ? {} : { opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: 'rgba(169, 144, 255, 0.12)', flexShrink: 0 }}>
                  <span className="pres-en-term" lang="en" dir="ltr" style={{ fontWeight: 700, color: '#A990FF', fontSize: '0.75rem' }}>{i + 1}</span>
                </div>
                <div className="pres-icon pres-icon--violet">
                  <IconComp size={18} />
                </div>
                <span className="pres-body" style={{ color: '#F8F7F4', fontSize: 'clamp(0.8rem, 1.3vw, 1.0625rem)' }}>{step.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PresentationSlideShell>
  );
}

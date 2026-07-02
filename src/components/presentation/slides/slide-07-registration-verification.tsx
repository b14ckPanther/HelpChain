'use client';

/**
 * Slide 07 — Registration & Verification
 */

import { motion, useReducedMotion } from 'framer-motion';
import { UserRoundPlus, KeyRound, ShieldCheck, Languages } from 'lucide-react';
import { SLIDE_07 } from '../presentation-copy';
import { PresentationSlideShell } from '../presentation-slide-shell';

const ICONS = { UserRoundPlus, KeyRound, ShieldCheck, Languages } as const;

export function Slide07Registration() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_07.title}
        </motion.h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {SLIDE_07.steps.map((step, i) => {
            const IconComp = ICONS[step.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={step.label}
                className="pres-card--step"
                initial={reduced ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(169, 144, 255, 0.12)', flexShrink: 0 }}>
                  <span className="pres-en-term" lang="en" dir="ltr" style={{ fontWeight: 700, color: '#A990FF', fontSize: '0.875rem' }}>{i + 1}</span>
                </div>
                <div>
                  <div className="pres-icon pres-icon--violet" style={{ marginBottom: '0.25rem' }}>
                    <IconComp size={20} />
                  </div>
                  <span className="pres-body" style={{ color: '#F8F7F4' }}>{step.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.span
            className="pres-badge"
            initial={reduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            {SLIDE_07.badge}
          </motion.span>
        </div>

        <motion.p
          className="pres-body"
          style={{ maxWidth: '600px', fontStyle: 'italic' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {SLIDE_07.honestNote}
        </motion.p>
      </div>
    </PresentationSlideShell>
  );
}

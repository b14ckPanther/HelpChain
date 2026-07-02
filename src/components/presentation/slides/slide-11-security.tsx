'use client';

/**
 * Slide 11 — Safety & Abuse Prevention
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Siren, Flag, ShieldAlert, UserRoundX } from 'lucide-react';
import { SLIDE_11 } from '../presentation-copy';
import { PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';

const ICONS = { Siren, Flag, ShieldAlert, UserRoundX } as const;

export function Slide11Security() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.safetyTrust} scrimType="dark">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_11.title}
        </motion.h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {SLIDE_11.controls.map((ctrl, i) => {
            const IconComp = ICONS[ctrl.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={ctrl.label}
                className="pres-card--step"
                initial={reduced ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.12 }}
              >
                <div className="pres-icon pres-icon--red">
                  <IconComp size={22} />
                </div>
                <span className="pres-body" style={{ color: '#F8F7F4' }}>{ctrl.label}</span>
              </motion.div>
            );
          })}
        </div>

        <motion.span
          className="pres-badge"
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {SLIDE_11.badge}
        </motion.span>
      </div>
    </PresentationSlideShell>
  );
}

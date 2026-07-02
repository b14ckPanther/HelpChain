'use client';

/**
 * Slide 04 — System Overview
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Radio, Accessibility, ShieldCheck, Star } from 'lucide-react';
import { SLIDE_04 } from '../presentation-copy';
import { PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';

const ICONS = { Radio, Accessibility, ShieldCheck, Star } as const;

export function Slide04SystemOverview() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.heroNetwork} scrimType="heavy">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_04.title}
        </motion.h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {SLIDE_04.pillars.map((pillar, i) => {
            const IconComp = ICONS[pillar.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={pillar.label}
                className="pres-card"
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                initial={reduced ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
              >
                <div className="pres-icon pres-icon--violet">
                  <IconComp size={24} />
                </div>
                <span className="pres-body" style={{ color: '#F8F7F4', fontWeight: 600 }}>{pillar.label}</span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <span className="pres-badge">
            <span className="pres-en-term" lang="en" dir="ltr">MVP</span>
            {' '}/{' '}
            אב־טיפוס אינטראקטיבי
          </span>
        </motion.div>
      </div>
    </PresentationSlideShell>
  );
}

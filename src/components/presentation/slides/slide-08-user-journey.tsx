'use client';

/**
 * Slide 08 — User Journey
 */

import { motion, useReducedMotion } from 'framer-motion';
import { CircleHelp, Radio, UserCheck, MapPinned, ArrowLeft } from 'lucide-react';
import { SLIDE_08 } from '../presentation-copy';
import { PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';

const ICONS = { CircleHelp, Radio, UserCheck, MapPinned } as const;

export function Slide08UserJourney() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.liveConnection} scrimType="dark">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_08.title}
        </motion.h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {SLIDE_08.flow.map((step, i) => {
            const IconComp = ICONS[step.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={step.label}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                initial={reduced ? {} : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
              >
                <div className="pres-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem' }}>
                  <div className="pres-icon pres-icon--violet">
                    <IconComp size={20} />
                  </div>
                  <span className="pres-body" style={{ color: '#F8F7F4', fontSize: 'clamp(0.8rem, 1.3vw, 1rem)' }}>{step.label}</span>
                </div>
                {i < SLIDE_08.flow.length - 1 && (
                  <ArrowLeft size={16} className="pres-flow-arrow" style={{ color: '#A990FF' }} />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="pres-subtitle"
          style={{ maxWidth: '600px' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {SLIDE_08.supporting}
        </motion.p>

        <motion.span
          className="pres-badge"
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          {SLIDE_08.badge}
        </motion.span>
      </div>
    </PresentationSlideShell>
  );
}

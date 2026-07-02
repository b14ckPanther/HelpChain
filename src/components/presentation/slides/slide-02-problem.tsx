'use client';

/**
 * Slide 02 — The Problem
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Signpost, PackageOpen, MapPin } from 'lucide-react';
import { SLIDE_02 } from '../presentation-copy';
import { PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';

const ICONS = { Signpost, PackageOpen, MapPin } as const;

export function Slide02Problem() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.problemSituations} scrimType="dark">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_02.title}
        </motion.h1>

        <motion.p
          className="pres-subtitle"
          style={{ maxWidth: '700px' }}
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {SLIDE_02.coreLine}
        </motion.p>

        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {SLIDE_02.situations.map((sit, i) => {
            const IconComp = ICONS[sit.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={sit.label}
                className="pres-card--step"
                initial={reduced ? {} : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.12 }}
              >
                <div className="pres-icon pres-icon--red">
                  <IconComp size={22} />
                </div>
                <span className="pres-body" style={{ color: '#F8F7F4' }}>{sit.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PresentationSlideShell>
  );
}

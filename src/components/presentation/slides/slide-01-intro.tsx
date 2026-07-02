'use client';

/**
 * Slide 01 — Introduction
 * HelpChain hero slide with brand mark and animated entry.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { SLIDE_01 } from '../presentation-copy';
import { PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';
import { PresentationBrandMark } from '../presentation-brand-mark';

export function Slide01Intro() {
  const reduced = useReducedMotion();
  const delay = reduced ? 0 : 0.2;

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.heroNetwork} scrimType="dark">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', height: '100%', gap: '1.5rem' }}>
        <motion.div
          initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay }}
        >
          <PresentationBrandMark size="lg" />
        </motion.div>

        <motion.h1
          className="pres-title pres-title--hero"
          lang="en"
          dir="ltr"
          style={{ fontFamily: 'var(--font-ubuntu), Ubuntu, system-ui, sans-serif' }}
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.15 }}
        >
          {SLIDE_01.title}
        </motion.h1>

        <motion.p
          className="pres-subtitle"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {SLIDE_01.subtitle}
        </motion.p>

        <motion.p
          className="pres-body"
          style={{ maxWidth: '600px' }}
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.45 }}
        >
          {SLIDE_01.supporting}
        </motion.p>
      </div>
    </PresentationSlideShell>
  );
}

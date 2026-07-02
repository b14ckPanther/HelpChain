'use client';

/**
 * Slide 14 — Core Use Cases
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Accessibility, HandHeart, Gift } from 'lucide-react';
import { SLIDE_14 } from '../presentation-copy';
import { PresentationSlideShell } from '../presentation-slide-shell';

const UC_ICONS = [Accessibility, HandHeart, Gift];

export function Slide14UseCases() {
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
          {SLIDE_14.title}
        </motion.h1>

        <div className="pres-usecase-grid">
          {SLIDE_14.useCases.map((uc, i) => {
            const IconComp = UC_ICONS[i];
            return (
              <motion.div
                key={uc.id}
                className="pres-usecase"
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
              >
                <div className="pres-usecase-id" lang="en" dir="ltr">{uc.id}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="pres-icon pres-icon--violet">
                    <IconComp size={22} />
                  </div>
                  <h3 className="pres-body" style={{ color: '#F8F7F4', fontWeight: 700, margin: 0 }}>{uc.label}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <p className="pres-label">
                    <span style={{ color: '#A990FF' }}>שחקן:</span> {uc.actor}
                  </p>
                  <p className="pres-label">
                    <span style={{ color: '#A990FF' }}>טריגר:</span> {uc.trigger}
                  </p>
                  <p className="pres-label">
                    <span style={{ color: '#35D07F' }}>תוצאה:</span> {uc.outcome}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PresentationSlideShell>
  );
}

'use client';

/**
 * Slide 15 — Gantt / Development Process
 */

import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SLIDE_15 } from '../presentation-copy';
import { PresentationSlideShell } from '../presentation-slide-shell';

export function Slide15Gantt() {
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
          {SLIDE_15.title}
        </motion.h1>

        <div className="pres-gantt">
          {SLIDE_15.phases.map((phase, i) => (
            <motion.div
              key={phase.stage}
              className="pres-gantt-row"
              initial={reduced ? {} : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
            >
              <div className="pres-gantt-stage">{phase.stage}</div>
              <div className="pres-gantt-bar">
                <span className="pres-gantt-name" lang="en" dir="ltr">{phase.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="pres-gantt-desc">{phase.description}</span>
                  <CheckCircle2 size={16} style={{ color: '#35D07F', flexShrink: 0 }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="pres-body"
          style={{ maxWidth: '600px', fontStyle: 'italic' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          {SLIDE_15.bottomLine}
        </motion.p>
      </div>
    </PresentationSlideShell>
  );
}

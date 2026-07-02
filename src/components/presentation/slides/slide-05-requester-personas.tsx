'use client';

/**
 * Slide 05 — Requester Personas
 */

import { motion, useReducedMotion } from 'framer-motion';
import { SLIDE_05 } from '../presentation-copy';
import { PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';

export function Slide05RequesterPersonas() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.requesterPersonas} scrimType="dark">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_05.title}
        </motion.h1>

        <div className="pres-persona-grid">
          {SLIDE_05.personas.map((persona, i) => (
            <motion.div
              key={persona.name}
              className="pres-card--persona"
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.15 }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="pres-body" style={{ color: '#F8F7F4', fontWeight: 700, fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}>
                  {persona.name}
                </span>
                <span className="pres-en-term pres-label" lang="en" dir="ltr">{persona.age}</span>
              </div>
              <p className="pres-label" style={{ marginBottom: '0.75rem', color: '#A990FF' }}>
                {persona.details}
              </p>
              <p className="pres-body">{persona.need}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PresentationSlideShell>
  );
}

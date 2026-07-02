'use client';

/**
 * Slide 06 — Volunteer & Partner Personas
 */

import { motion, useReducedMotion } from 'framer-motion';
import { SLIDE_06 } from '../presentation-copy';
import { PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';

export function Slide06VolunteerPartnerPersonas() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.volunteerPartnerPersonas} scrimType="dark">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_06.title}
        </motion.h1>

        <div className="pres-persona-grid">
          {SLIDE_06.personas.map((persona, i) => (
            <motion.div
              key={persona.name}
              className="pres-card--persona"
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.15 }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="pres-body" style={{ color: '#F8F7F4', fontWeight: 700, fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}>
                  {persona.name}
                </span>
                <span className="pres-en-term pres-label" lang="en" dir="ltr">{persona.age}</span>
              </div>
              <p className="pres-label" style={{ marginBottom: '0.75rem', color: '#A990FF' }}>
                {persona.role}
              </p>
              <p className="pres-body">{persona.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="pres-subtitle"
          style={{ textAlign: 'center' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {SLIDE_06.bottomLine}
        </motion.p>
      </div>
    </PresentationSlideShell>
  );
}

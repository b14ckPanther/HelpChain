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

        {SLIDE_01.members && (
          <motion.div
            style={{
              marginTop: '1rem',
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              maxWidth: '550px',
              width: '100%',
              direction: 'rtl',
            }}
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.6 }}
          >
            <p
              className="pres-label"
              style={{
                color: '#A990FF',
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
              }}
            >
              סטודנטים:
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem 1.5rem',
              }}
            >
              {SLIDE_01.members.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <span className="pres-body" style={{ color: '#F8F7F4', fontWeight: 500, fontSize: '0.95rem', margin: 0 }}>
                    {member.name}
                  </span>
                  <span className="pres-font-en pres-label" style={{ color: '#B5B8C2', fontSize: '0.85rem', margin: 0 }}>
                    {member.id}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PresentationSlideShell>
  );
}

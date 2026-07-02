'use client';

/**
 * Slide 03 — Three-Sided Market Model
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Accessibility, HandHeart, Store, ArrowLeft } from 'lucide-react';
import { SLIDE_03 } from '../presentation-copy';
import { PresentationSlideShell } from '../presentation-slide-shell';

const ICONS = { Accessibility, HandHeart, Store } as const;

export function Slide03Market() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2.5rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_03.title}
        </motion.h1>

        <div className="pres-segment-grid">
          {SLIDE_03.segments.map((seg, i) => {
            const IconComp = ICONS[seg.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={seg.label}
                className="pres-card"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', padding: '2rem 1.5rem' }}
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
              >
                <div className="pres-icon pres-icon--violet" style={{ width: 48, height: 48 }}>
                  <IconComp size={32} />
                </div>
                <h3 className="pres-body" style={{ color: '#F8F7F4', fontWeight: 700, fontSize: 'clamp(1rem, 1.8vw, 1.375rem)' }}>{seg.label}</h3>
                <p className="pres-body">{seg.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {SLIDE_03.bottomFlow.split('→').map((part, i, arr) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="pres-badge">{part.trim()}</span>
              {i < arr.length - 1 && <ArrowLeft size={16} className="pres-icon--muted" />}
            </span>
          ))}
        </motion.div>
      </div>
    </PresentationSlideShell>
  );
}

'use client';

/**
 * Slide 12 — Non-Functional Requirements
 */

import { motion, useReducedMotion } from 'framer-motion';
import { SLIDE_12 } from '../presentation-copy';
import { PresentationSlideShell } from '../presentation-slide-shell';

export function Slide12Nfr() {
  const reduced = useReducedMotion();

  // Determine which values are English/numeric
  const isEnglishMetric = (val: string) => /[A-Za-z0-9%×≤+]/.test(val);

  return (
    <PresentationSlideShell>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '1.75rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_12.title}
        </motion.h1>

        <div className="pres-metric-grid">
          {SLIDE_12.metrics.map((metric, i) => (
            <motion.div
              key={metric.value}
              className="pres-card--metric"
              initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
            >
              <div
                className={isEnglishMetric(metric.value) ? 'pres-metric-value' : 'pres-body'}
                style={isEnglishMetric(metric.value) ? {} : { color: '#F8F7F4', fontWeight: 700, fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', lineHeight: 1 }}
                lang={isEnglishMetric(metric.value) ? 'en' : undefined}
                dir={isEnglishMetric(metric.value) ? 'ltr' : undefined}
              >
                {metric.value}
              </div>
              <p className="pres-body" style={{ marginTop: '0.5rem', fontSize: 'clamp(0.75rem, 1.2vw, 0.9375rem)' }}>
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="pres-body"
          style={{ maxWidth: '700px', fontStyle: 'italic' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {SLIDE_12.bottomLine}
        </motion.p>

        <motion.span
          className="pres-badge"
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <span className="pres-en-term" lang="en" dir="ltr">{SLIDE_12.badge}</span>
        </motion.span>
      </div>
    </PresentationSlideShell>
  );
}

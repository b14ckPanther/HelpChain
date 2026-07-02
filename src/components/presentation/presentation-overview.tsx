'use client';

/**
 * PresentationOverview
 * Full-screen grid of slide thumbnails — toggled with O key.
 */

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { SLIDE_TITLES } from './presentation-copy';

interface PresentationOverviewProps {
  current: number;
  visible: boolean;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function PresentationOverview({ current, visible, onSelect, onClose }: PresentationOverviewProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pres-overview"
          dir="rtl"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-label="סקירת שקפים"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', maxWidth: 1200, width: '100%', margin: '0 auto 1.5rem' }}>
            <h2 className="pres-title" style={{ fontSize: '1.5rem', margin: 0 }}>סקירת שקפים</h2>
            <button
              className="pres-control-btn"
              onClick={onClose}
              aria-label="סגור סקירה"
            >
              <X size={20} />
            </button>
          </div>

          <div className="pres-overview-grid">
            {SLIDE_TITLES.map((title, i) => (
              <button
                key={i}
                className={`pres-overview-tile ${i === current ? 'pres-overview-tile--current' : ''}`}
                onClick={() => onSelect(i)}
                aria-label={`שקף ${i + 1}: ${title}`}
                aria-current={i === current ? 'true' : undefined}
              >
                <div className="pres-overview-tile-number">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="pres-overview-tile-title">{title}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

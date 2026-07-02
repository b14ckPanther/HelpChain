'use client';

/**
 * PresentationHelpOverlay
 * Keyboard shortcut reference — toggled with ? key.
 */

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

interface PresentationHelpOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '→ / Space / PageDown', action: 'שקף הבא' },
  { key: '← / PageUp', action: 'שקף קודם' },
  { key: 'Home', action: 'שקף ראשון' },
  { key: 'End', action: 'שקף אחרון' },
  { key: 'F', action: 'מסך מלא' },
  { key: 'N', action: 'הערות דובר' },
  { key: 'O', action: 'סקירת שקפים' },
  { key: '?', action: 'קיצורי מקלדת' },
  { key: 'Escape', action: 'סגירת חלון / יציאה ממסך מלא' },
];

export function PresentationHelpOverlay({ visible, onClose }: PresentationHelpOverlayProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pres-help-overlay"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-label="קיצורי מקלדת"
          dir="rtl"
          onClick={onClose}
        >
          <div
            className="pres-help-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="pres-help-title" style={{ margin: 0 }}>קיצורי מקלדת</h2>
              <button
                className="pres-control-btn"
                onClick={onClose}
                aria-label="סגור"
              >
                <X size={20} />
              </button>
            </div>
            {SHORTCUTS.map((s) => (
              <div key={s.key} className="pres-help-row">
                <span className="pres-help-action">{s.action}</span>
                <span className="pres-help-key">{s.key}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

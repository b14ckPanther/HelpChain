'use client';

/**
 * PresentationNotesPanel
 * Speaker notes overlay — toggled with N key.
 */

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { SpeakerNote } from './presentation-types';

interface PresentationNotesPanelProps {
  note: SpeakerNote;
  visible: boolean;
}

// Helper to wrap English terms, numbers, and technical labels in LTR/Ubuntu font
function renderNotesText(text: string) {
  if (!text) return null;
  const regex = /(HelpChain|MVP|OTP|GPS|QR|NFR|Socket\.IO|[A-Za-z0-9%×≤+-]+)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (regex.test(part)) {
      return (
        <span key={i} className="pres-en-term font-medium px-0.5" lang="en" dir="ltr" style={{ fontFamily: 'var(--font-ubuntu), Ubuntu, sans-serif' }}>
          {part}
        </span>
      );
    }
    return part;
  });
}

export function PresentationNotesPanel({ note, visible }: PresentationNotesPanelProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pres-notes-panel"
          dir="rtl"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          role="complementary"
          aria-label="הערות דובר"
        >
          <div className="pres-notes-meta" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#7A7E8A' }}>
            <span>שקף {note.slideNumber}</span>
            <span>•</span>
            <span>משך מומלץ: {renderNotesText(note.recommendedDuration)}</span>
          </div>

          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 700, color: '#A990FF' }}>
            דובר/ת: {note.speakerLabel}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#F6B94D' }}>מה לומר</h4>
              <p className="pres-font-he" style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.6', color: '#B5B8C2', whiteSpace: 'pre-line' }}>
                {renderNotesText(note.speakerScript)}
              </p>
            </div>

            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#F6B94D' }}>מה הקהל צריך להבין</h4>
              <p className="pres-font-he" style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.6', color: '#B5B8C2' }}>
                {renderNotesText(note.audienceTakeaway)}
              </p>
            </div>

            {note.handoff && (
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#F6B94D' }}>מעבר</h4>
                <p className="pres-font-he" style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.6', color: '#B5B8C2' }}>
                  {renderNotesText(note.handoff)}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

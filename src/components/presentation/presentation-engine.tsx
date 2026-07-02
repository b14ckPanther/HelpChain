'use client';

/**
 * PresentationEngine
 * Core slide engine with keyboard controls, touch navigation, fullscreen,
 * Framer Motion transitions, and overlay management.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SPEAKER_NOTES, SLIDE_TITLES } from './presentation-copy';
import { PresentationProgress } from './presentation-progress';
import { PresentationControls } from './presentation-controls';
import { PresentationNotesPanel } from './presentation-notes-panel';
import { PresentationOverview } from './presentation-overview';
import { PresentationHelpOverlay } from './presentation-help-overlay';
import type { SlideDirection, OverlayType } from './presentation-types';

// Import all slide components
import { Slide01Intro } from './slides/slide-01-intro';
import { Slide02Problem } from './slides/slide-02-problem';
import { Slide03Market } from './slides/slide-03-three-sided-market';
import { Slide04SystemOverview } from './slides/slide-04-system-overview';
import { Slide05RequesterPersonas } from './slides/slide-05-requester-personas';
import { Slide06VolunteerPartnerPersonas } from './slides/slide-06-volunteer-partner-personas';
import { Slide07Registration } from './slides/slide-07-registration-verification';
import { Slide08UserJourney } from './slides/slide-08-user-journey';
import { Slide09DoubleValidation } from './slides/slide-09-double-validation';
import { Slide10Rewards } from './slides/slide-10-rewards-partners';
import { Slide11Security } from './slides/slide-11-security';
import { Slide12Nfr } from './slides/slide-12-nfr';
import { Slide13Matching } from './slides/slide-13-matching-algorithm';
import { Slide14UseCases } from './slides/slide-14-use-cases';
import { Slide15Gantt } from './slides/slide-15-gantt';
import { Slide16LiveDemo } from './slides/slide-16-live-demo';

const SLIDES = [
  Slide01Intro,
  Slide02Problem,
  Slide03Market,
  Slide04SystemOverview,
  Slide05RequesterPersonas,
  Slide06VolunteerPartnerPersonas,
  Slide07Registration,
  Slide08UserJourney,
  Slide09DoubleValidation,
  Slide10Rewards,
  Slide11Security,
  Slide12Nfr,
  Slide13Matching,
  Slide14UseCases,
  Slide15Gantt,
  Slide16LiveDemo,
];

const TOTAL = SLIDES.length;

// Framer Motion direction-aware slide variants
const slideVariants = {
  enter: (dir: SlideDirection) => ({
    x: dir === 'forward' ? '40%' : '-40%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: SlideDirection) => ({
    x: dir === 'forward' ? '-40%' : '40%',
    opacity: 0,
  }),
};

const reducedVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function PresentationEngine() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>('forward');
  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const announceRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Navigation
  const goTo = useCallback((index: number, dir?: SlideDirection) => {
    if (index < 0 || index >= TOTAL) return;
    setDirection(dir ?? (index > current ? 'forward' : 'backward'));
    setCurrent(index);
    setOverlay(null);
  }, [current]);

  const next = useCallback(() => {
    if (current < TOTAL - 1) goTo(current + 1, 'forward');
  }, [current, goTo]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1, 'backward');
  }, [current, goTo]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Overlay toggles
  const toggleOverlay = useCallback((type: OverlayType) => {
    setOverlay((prev) => (prev === type ? null : type));
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          if (overlay) { setOverlay(null); return; }
          next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          if (overlay) { setOverlay(null); return; }
          prev();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0, 'backward');
          break;
        case 'End':
          e.preventDefault();
          goTo(TOTAL - 1, 'forward');
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          toggleOverlay('notes');
          break;
        case 'o':
        case 'O':
          e.preventDefault();
          toggleOverlay('overview');
          break;
        case '?':
          e.preventDefault();
          toggleOverlay('help');
          break;
        case 'Escape':
          e.preventDefault();
          if (overlay) {
            setOverlay(null);
          } else if (isFullscreen) {
            document.exitFullscreen?.().catch(() => {});
          }
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, goTo, toggleFullscreen, toggleOverlay, overlay, isFullscreen]);

  // Touch/click navigation
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking controls, overlays, or interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="toolbar"], [role="dialog"], [role="complementary"], video')) return;
    if (overlay) return;

    const x = e.clientX;
    const mid = window.innerWidth / 2;
    // RTL: left half = next, right half = previous
    if (x < mid) {
      next();
    } else {
      prev();
    }
  }, [next, prev, overlay]);

  // Auto-hide controls
  useEffect(() => {
    const showControls = () => {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
    };

    window.addEventListener('mousemove', showControls);
    window.addEventListener('touchstart', showControls);

    // Initial show
    showControls();

    return () => {
      window.removeEventListener('mousemove', showControls);
      window.removeEventListener('touchstart', showControls);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Announce slide changes
  useEffect(() => {
    if (announceRef.current) {
      announceRef.current.textContent = `שקף ${current + 1} מתוך ${TOTAL}: ${SLIDE_TITLES[current]}`;
    }
  }, [current]);

  const SlideComponent = SLIDES[current];
  const currentNote = SPEAKER_NOTES[current];

  return (
    <div className="pres-canvas" onClick={handleCanvasClick}>
      {/* Accessible announcer */}
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Progress bar + counter */}
      <PresentationProgress current={current} total={TOTAL} />

      {/* Slide with transitions */}
      <div className="pres-slide-container">
        <div className="pres-slide-inner">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={reduced ? reducedVariants : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.15 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            >
              <SlideComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <PresentationControls
        current={current}
        total={TOTAL}
        isFullscreen={isFullscreen}
        showNotes={overlay === 'notes'}
        visible={controlsVisible}
        onPrev={prev}
        onNext={next}
        onToggleFullscreen={toggleFullscreen}
        onToggleNotes={() => toggleOverlay('notes')}
        onToggleOverview={() => toggleOverlay('overview')}
        onToggleHelp={() => toggleOverlay('help')}
      />

      {/* Notes panel */}
      <PresentationNotesPanel
        note={currentNote}
        visible={overlay === 'notes'}
      />

      {/* Overview grid */}
      <PresentationOverview
        current={current}
        visible={overlay === 'overview'}
        onSelect={(i) => goTo(i)}
        onClose={() => setOverlay(null)}
      />

      {/* Help overlay */}
      <PresentationHelpOverlay
        visible={overlay === 'help'}
        onClose={() => setOverlay(null)}
      />
    </div>
  );
}

'use client';

/**
 * PresentationControls
 * Bottom control bar with navigation, fullscreen, notes, and overview toggles.
 */

import {
  ChevronRight,
  ChevronLeft,
  Maximize,
  Minimize,
  StickyNote,
  LayoutGrid,
  HelpCircle,
} from 'lucide-react';

interface PresentationControlsProps {
  current: number;
  total: number;
  isFullscreen: boolean;
  showNotes: boolean;
  visible: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleFullscreen: () => void;
  onToggleNotes: () => void;
  onToggleOverview: () => void;
  onToggleHelp: () => void;
}

export function PresentationControls({
  current,
  total,
  isFullscreen,
  showNotes,
  visible,
  onPrev,
  onNext,
  onToggleFullscreen,
  onToggleNotes,
  onToggleOverview,
  onToggleHelp,
}: PresentationControlsProps) {
  return (
    <div
      className={`pres-controls ${!visible ? 'pres-controls--hidden' : ''}`}
      role="toolbar"
      aria-label="בקרי מצגת"
    >
      <button
        className="pres-control-btn"
        onClick={onPrev}
        disabled={current === 0}
        aria-label="שקף קודם"
        title="שקף קודם"
      >
        <ChevronRight size={20} />
      </button>
      <button
        className="pres-control-btn"
        onClick={onNext}
        disabled={current === total - 1}
        aria-label="שקף הבא"
        title="שקף הבא"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="pres-control-divider" />

      <button
        className="pres-control-btn"
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? 'יציאה ממסך מלא' : 'מסך מלא'}
        title={isFullscreen ? 'יציאה ממסך מלא' : 'מסך מלא'}
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
      <button
        className="pres-control-btn"
        onClick={onToggleNotes}
        aria-label={showNotes ? 'הסתר הערות דובר' : 'הצג הערות דובר'}
        title={showNotes ? 'הסתר הערות דובר' : 'הצג הערות דובר'}
        aria-pressed={showNotes}
      >
        <StickyNote size={18} />
      </button>
      <button
        className="pres-control-btn"
        onClick={onToggleOverview}
        aria-label="סקירת שקפים"
        title="סקירת שקפים"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        className="pres-control-btn"
        onClick={onToggleHelp}
        aria-label="קיצורי מקלדת"
        title="קיצורי מקלדת"
      >
        <HelpCircle size={18} />
      </button>
    </div>
  );
}

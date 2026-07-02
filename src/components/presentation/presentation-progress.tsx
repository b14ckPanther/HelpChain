'use client';

/**
 * PresentationProgress
 * Top progress bar and slide counter.
 */

interface PresentationProgressProps {
  current: number;
  total: number;
}

export function PresentationProgress({ current, total }: PresentationProgressProps) {
  const pct = ((current + 1) / total) * 100;
  const display = String(current + 1).padStart(2, '0');
  const totalDisplay = String(total).padStart(2, '0');

  return (
    <>
      <div className="pres-progress" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="pres-progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="pres-slide-counter" aria-hidden="true">
        {display} / {totalDisplay}
      </div>
    </>
  );
}

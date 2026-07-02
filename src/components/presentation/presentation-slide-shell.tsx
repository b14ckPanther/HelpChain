'use client';

/**
 * PresentationSlideShell
 * Wrapper for each slide providing consistent layout, background image support,
 * and scrim overlay for text readability.
 */

import Image from 'next/image';
import type { SlideAsset } from './presentation-types';

interface PresentationSlideShellProps {
  children: React.ReactNode;
  backgroundImage?: SlideAsset;
  scrimType?: 'dark' | 'heavy' | 'gradient-bottom' | 'none';
  className?: string;
}

export function PresentationSlideShell({
  children,
  backgroundImage,
  scrimType = 'dark',
  className = '',
}: PresentationSlideShellProps) {
  return (
    <div className={`pres-slide ${className}`}>
      {backgroundImage && (
        <div className="pres-bg-image">
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          {scrimType !== 'none' && (
            <div className={`pres-bg-scrim pres-bg-scrim--${scrimType}`} />
          )}
        </div>
      )}
      <div className="pres-slide-content">
        {children}
      </div>
    </div>
  );
}

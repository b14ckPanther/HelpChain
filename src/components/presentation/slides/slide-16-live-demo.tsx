'use client';

/**
 * Slide 16 — Live Demo Finale
 * Attempts to play a video, gracefully falls back if MP4 doesn't exist.
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { SLIDE_16 } from '../presentation-copy';
import { VIDEO_ASSET, PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';

export function Slide16LiveDemo() {
  const reduced = useReducedMotion();
  const [videoError, setVideoError] = useState(false);

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.finale} scrimType="gradient-bottom">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '2rem', textAlign: 'center' }}>
        <motion.h1
          className="pres-title"
          lang="en"
          dir="ltr"
          style={{ fontFamily: 'var(--font-ubuntu), Ubuntu, system-ui, sans-serif', textAlign: 'center' }}
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_16.title}
        </motion.h1>

        <motion.p
          className="pres-subtitle"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {SLIDE_16.subtitle}
        </motion.p>

        {/* Video or fallback */}
        <motion.div
          className="pres-video-container"
          initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {!videoError ? (
            <video
              src={VIDEO_ASSET.src}
              poster={VIDEO_ASSET.poster}
              muted
              autoPlay
              loop
              playsInline
              onError={() => setVideoError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}

          {videoError && (
            <div className="pres-video-fallback">
              <Play size={48} style={{ color: '#A990FF', opacity: 0.5 }} />
              <p className="pres-body" style={{ color: '#F8F7F4', fontWeight: 600 }}>
                {SLIDE_16.fallbackPrimary}
              </p>
              <p className="pres-body" style={{ fontSize: '0.875rem' }}>
                {SLIDE_16.fallbackSecondary}
              </p>
            </div>
          )}
        </motion.div>

        <motion.p
          className="pres-title"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1rem' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {SLIDE_16.finalLine}
        </motion.p>
      </div>
    </PresentationSlideShell>
  );
}

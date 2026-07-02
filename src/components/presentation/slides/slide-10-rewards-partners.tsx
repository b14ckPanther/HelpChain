'use client';

/**
 * Slide 10 — Rewards & Partners
 */

import { motion, useReducedMotion } from 'framer-motion';
import { WalletCards, Ticket, QrCode, ArrowLeft } from 'lucide-react';
import { SLIDE_10 } from '../presentation-copy';
import { PRESENTATION_ASSETS } from '../presentation-assets';
import { PresentationSlideShell } from '../presentation-slide-shell';

const ICONS = { WalletCards, Ticket, QrCode } as const;

export function Slide10Rewards() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell backgroundImage={PRESENTATION_ASSETS.rewardsPartners} scrimType="dark">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_10.title}
        </motion.h1>

        {/* Reward loop */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
          initial={reduced ? {} : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {SLIDE_10.loop.map((item, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="pres-badge--gold pres-badge">{item}</span>
              {i < SLIDE_10.loop.length - 1 && <ArrowLeft size={16} style={{ color: '#F6B94D' }} />}
            </span>
          ))}
        </motion.div>

        {/* Callout cards */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {SLIDE_10.callouts.map((callout, i) => {
            const IconComp = ICONS[callout.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={callout.label}
                className="pres-card"
                style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: '1 1 200px' }}
                initial={reduced ? {} : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.12 }}
              >
                <div className="pres-icon pres-icon--gold">
                  <IconComp size={22} />
                </div>
                <span className="pres-body" style={{ color: '#F8F7F4' }}>{callout.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PresentationSlideShell>
  );
}

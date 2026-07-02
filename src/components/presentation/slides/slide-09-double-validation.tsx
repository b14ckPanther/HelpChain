'use client';

/**
 * Slide 09 — Double Validation
 */

import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, Handshake, Star } from 'lucide-react';
import { SLIDE_09 } from '../presentation-copy';
import { PresentationSlideShell } from '../presentation-slide-shell';

export function Slide09DoubleValidation() {
  const reduced = useReducedMotion();

  return (
    <PresentationSlideShell>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '2rem' }}>
        <motion.h1
          className="pres-title"
          style={{ textAlign: 'center' }}
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {SLIDE_09.title}
        </motion.h1>

        <div className="pres-dual-validation">
          {/* Volunteer card */}
          <motion.div
            className="pres-validation-card"
            initial={reduced ? {} : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="pres-icon pres-icon--violet" style={{ marginBottom: '0.75rem', justifyContent: 'center' }}>
              <BadgeCheck size={28} />
            </div>
            <p className="pres-label" style={{ marginBottom: '0.5rem' }}>מתנדב</p>
            <p className="pres-body" style={{ color: '#F8F7F4', fontWeight: 600 }}>{SLIDE_09.volunteerConfirm}</p>
          </motion.div>

          {/* Center verification */}
          <motion.div
            className="pres-validation-center"
            initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="pres-icon pres-icon--success">
              <Handshake size={36} />
            </div>
            <p className="pres-body" style={{ color: '#35D07F', fontWeight: 700 }}>{SLIDE_09.center}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
              <Star size={20} className="pres-icon--gold" fill="#F6B94D" />
              <span className="pres-en-term pres-body" lang="en" dir="ltr" style={{ color: '#F6B94D', fontWeight: 700 }}>
                {SLIDE_09.outcome}
              </span>
            </div>
          </motion.div>

          {/* Requester card */}
          <motion.div
            className="pres-validation-card"
            initial={reduced ? {} : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="pres-icon pres-icon--red" style={{ marginBottom: '0.75rem', justifyContent: 'center' }}>
              <BadgeCheck size={28} />
            </div>
            <p className="pres-label" style={{ marginBottom: '0.5rem' }}>מבקש עזרה</p>
            <p className="pres-body" style={{ color: '#F8F7F4', fontWeight: 600 }}>{SLIDE_09.requesterConfirm}</p>
          </motion.div>
        </div>

        <motion.p
          className="pres-subtitle"
          style={{ textAlign: 'center', maxWidth: '600px' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {SLIDE_09.bottomLine}
        </motion.p>
      </div>
    </PresentationSlideShell>
  );
}

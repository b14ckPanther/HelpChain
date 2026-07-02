/**
 * Presentation Asset Manifest
 * Central registry of all generated Nano Banana visuals with Hebrew alt text.
 */

import type { SlideAsset } from './presentation-types';

export const PRESENTATION_ASSETS: Record<string, SlideAsset> = {
  heroNetwork: {
    src: '/presentation-images/01-hero-helpchain-network.png',
    alt: 'טלפון חכם נגיש עם כפתור עזרה אדום, שולח קווי חיבור סגולים לאנשים בסביבה עירונית',
    width: 1024,
    height: 1024,
  },
  problemSituations: {
    src: '/presentation-images/02-problem-situations.png',
    alt: 'שני מצבים יומיומיים: מבוגר עם לקות ראייה בתחנת תחבורה ומשתמש בכיסא גלגלים מנסה להגיע למדף גבוה',
    width: 1024,
    height: 1024,
  },
  requesterPersonas: {
    src: '/presentation-images/03-requester-personas.png',
    alt: 'שני מבקשי עזרה: אישה עם לקות ראייה וגבר המשתמש בכיסא גלגלים, שניהם מוצגים בכבוד ובעצמאות',
    width: 1024,
    height: 1024,
  },
  volunteerPartnerPersonas: {
    src: '/presentation-images/04-volunteer-partner-personas.png',
    alt: 'סטודנטית מתנדבת ובעל בית קפה שותף, עומדים יחד בסביבה קהילתית חמה',
    width: 1024,
    height: 1024,
  },
  liveConnection: {
    src: '/presentation-images/05-live-human-connection.png',
    alt: 'חיבור אנושי דרך טכנולוגיה: טלפון יוצר קשר עזרה קרובה עם קווי רשת חמים',
    width: 1024,
    height: 1024,
  },
  rewardsPartners: {
    src: '/presentation-images/06-rewards-and-partners.png',
    alt: 'סצנת תגמול קהילתית: טלפון מציג קופון מופשט בדלפק בית קפה עם נגיעות זהב',
    width: 1024,
    height: 1024,
  },
  safetyTrust: {
    src: '/presentation-images/07-safety-and-trust.png',
    alt: 'חזון בטיחות ואמון: מגן מגן סביב שני אנשים וטלפון חכם עם סמלי אימות',
    width: 1024,
    height: 1024,
  },
  finale: {
    src: '/presentation-images/08-presentation-finale.png',
    alt: 'רשת עזרה אנושית מחוברת דרך טלפון נגיש אחד, עם אור אדום, סגול וזהב חם',
    width: 1024,
    height: 1024,
  },
} as const;

export const VIDEO_ASSET = {
  src: '/presentation-media/helpchain-live-demo.mp4',
  poster: '/presentation-images/08-presentation-finale.png',
} as const;

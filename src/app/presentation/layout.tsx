'use client';

import { useEffect } from 'react';
import { Heebo, Ubuntu } from 'next/font/google';
import './presentation.css';

const heebo = Heebo({
  variable: '--font-heebo',
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export default function PresentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Dynamic html/body overrides on mount to avoid Next.js hydration mismatch
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlDir = html.dir;
    const originalHtmlLang = html.lang;
    const originalHtmlClassName = html.className;
    const originalBodyClassName = body.className;
    const originalBodyStyle = body.style.cssText;

    // Apply presentation-specific attributes
    html.dir = 'rtl';
    html.lang = 'he';
    html.classList.add(heebo.variable, ubuntu.variable);

    body.style.margin = '0';
    body.style.padding = '0';
    body.style.overflow = 'hidden';
    body.style.background = '#0A0B0E';
    body.style.color = '#F8F7F4';
    body.style.fontFamily = 'var(--font-heebo), Heebo, system-ui, sans-serif';
    body.style.minHeight = '100vh';
    body.style.minWidth = '100vw';

    return () => {
      // Restore original attributes on unmount
      html.dir = originalHtmlDir;
      html.lang = originalHtmlLang;
      html.className = originalHtmlClassName;
      body.className = originalBodyClassName;
      body.style.cssText = originalBodyStyle;
    };
  }, []);

  return (
    <div className={`${heebo.variable} ${ubuntu.variable} pres-font-he w-full h-full min-h-screen text-[#F8F7F4] bg-[#0A0B0E]`}>
      {children}
    </div>
  );
}

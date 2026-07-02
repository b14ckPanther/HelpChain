import type { Metadata, Viewport } from 'next';
import { PresentationEngine } from '@/components/presentation/presentation-engine';

export const metadata: Metadata = {
  title: 'HelpChain — מצגת',
  description: 'מצגת אינטראקטיבית של אב-הטיפוס HelpChain — רשת עזרה קהילתית בזמן אמת',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0B0E',
};

export default function PresentationPage() {
  return <PresentationEngine />;
}

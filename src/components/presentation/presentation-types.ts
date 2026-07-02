/**
 * Presentation Types
 * Core type definitions for the Helpchain slide engine.
 */

export interface SlideDefinition {
  id: string;
  index: number;
  title: string;
  speakerPerson: number;
  notes: SpeakerNote;
}

export interface SpeakerNote {
  speakerPerson: number;
  speakerLabel: string;
  slideNumber: number;
  recommendedDuration: string;
  speakerScript: string;
  audienceTakeaway: string;
  handoff?: string;
}

export interface SlideAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type SlideDirection = 'forward' | 'backward';

export interface PresentationState {
  currentSlide: number;
  totalSlides: number;
  direction: SlideDirection;
  showNotes: boolean;
  showOverview: boolean;
  showHelp: boolean;
  isFullscreen: boolean;
}

export type OverlayType = 'notes' | 'overview' | 'help' | null;

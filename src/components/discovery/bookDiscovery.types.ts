import { ReactNode } from 'react';
import { Book } from '../../data/books';

export type DiscoveryState =
  | 'idle'
  | 'starting'
  | 'shuffling'
  | 'slowing'
  | 'fake-stop'
  | 'revealing'
  | 'result'
  | 'error';

export type DiscoveryMoodId =
  | 'feel-good'
  | 'knowledge'
  | 'fun'
  | 'self-growth'
  | 'relax'
  | 'surprise';

export interface DiscoveryMood {
  id: DiscoveryMoodId;
  label: string;
  shortLabel: string;
  icon: ReactNode;
  categories: string[];
  description: string;
}

export interface UseBookDiscoveryOptions {
  books?: Book[];
  onSelect?: (book: Book) => void;
  candidateCount?: number;
  testMode?: boolean;
  deterministicIndex?: number;
}

export interface UseBookDiscoveryReturn {
  state: DiscoveryState;
  selectedBook: Book | null;
  currentCyclingBook: Book | null;
  candidateBooks: Book[];
  selectedMood: DiscoveryMoodId;
  setSelectedMood: (moodId: DiscoveryMoodId) => void;
  startDiscovery: () => void;
  resetDiscovery: () => void;
  isRunning: boolean;
  isReducedMotion: boolean;
  history: string[];
  error: string | null;
  setHoverState: (isHovered: boolean) => void;
}

export interface BookDiscoveryProps {
  books?: Book[];
  onSelectBook?: (book: Book) => void;
  className?: string;
  testMode?: boolean;
}

export interface BookDiscoverySceneProps {
  state: DiscoveryState;
  selectedBook: Book | null;
  currentCyclingBook: Book | null;
  candidateBooks: Book[];
  isReducedMotion: boolean;
  onSceneClick?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

export interface BookDiscoveryButtonProps {
  state: DiscoveryState;
  onClick: () => void;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

export interface BookDiscoveryResultProps {
  book: Book;
  onRollAgain: () => void;
  isReducedMotion?: boolean;
  className?: string;
  mood?: DiscoveryMoodId;
}

export interface BookMoodSelectorProps {
  selectedMood: DiscoveryMoodId;
  onSelectMood: (moodId: DiscoveryMoodId) => void;
  disabled?: boolean;
  className?: string;
}

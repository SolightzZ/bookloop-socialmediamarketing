import { useState, useEffect, useRef, useCallback } from 'react';
import { Book, books as defaultBooks } from '../../data/books';
import {
  DiscoveryState,
  DiscoveryMoodId,
  UseBookDiscoveryOptions,
  UseBookDiscoveryReturn,
} from './bookDiscovery.types';

const MOOD_CATEGORY_MAP: Record<DiscoveryMoodId, string[]> = {
  'feel-good': ['นิยาย', 'เด็ก'],
  'knowledge': ['ความรู้', 'การศึกษา'],
  'fun': ['การ์ตูน', 'นิยาย'],
  'self-growth': ['พัฒนาตนเอง', 'ธุรกิจ'],
  'relax': ['นิยาย', 'หนังสือสะสม', 'เด็ก'],
  'surprise': [], // All categories
};

export const getRandomDiscoveryBook = (
  candidates: Book[],
  previousBookId?: string,
  deterministicIndex?: number
): Book | null => {
  if (!candidates || candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  if (typeof deterministicIndex === 'number' && deterministicIndex >= 0) {
    return candidates[deterministicIndex % candidates.length];
  }

  // Filter out previous book to avoid immediate consecutive duplicates
  const filtered = previousBookId
    ? candidates.filter((b) => b.id !== previousBookId)
    : candidates;

  const pool = filtered.length > 0 ? filtered : candidates;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

export const useBookDiscovery = (
  options: UseBookDiscoveryOptions = {}
): UseBookDiscoveryReturn => {
  const {
    books = defaultBooks,
    onSelect,
    candidateCount = 6,
    testMode = false,
    deterministicIndex,
  } = options;

  const [state, setState] = useState<DiscoveryState>('idle');
  const [selectedMood, setSelectedMoodState] = useState<DiscoveryMoodId>('surprise');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentCyclingBook, setCurrentCyclingBook] = useState<Book | null>(null);
  const [candidateBooks, setCandidateBooks] = useState<Book[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const timeoutIdsRef = useRef<number[]>([]);
  const isRunningRef = useRef(false);

  const clearTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeouts();
    };
  }, [clearTimeouts]);

  const isRunning =
    state === 'starting' ||
    state === 'shuffling' ||
    state === 'slowing' ||
    state === 'fake-stop' ||
    state === 'revealing';

  isRunningRef.current = isRunning;

  const setSelectedMood = useCallback(
    (moodId: DiscoveryMoodId) => {
      if (isRunningRef.current) return;
      setSelectedMoodState(moodId);
    },
    []
  );

  const setHoverState = useCallback((_isHovered: boolean) => {
    // Keep state clean and predictable without bouncing
  }, []);

  const resetDiscovery = useCallback(() => {
    clearTimeouts();
    setState('idle');
    setSelectedBook(null);
    setCurrentCyclingBook(null);
    setCandidateBooks([]);
    setError(null);
    isRunningRef.current = false;
  }, [clearTimeouts]);

  const startDiscovery = useCallback(() => {
    if (isRunningRef.current) return;

    clearTimeouts();
    setError(null);

    // Filter books in stock
    const inStockBooks = books.filter((b) => (b.stock ?? 1) > 0);

    if (inStockBooks.length === 0) {
      setState('error');
      setError('ยังไม่มีหนังสือให้สุ่มในขณะนี้');
      return;
    }

    // Filter by mood categories if specified
    const moodCategories = MOOD_CATEGORY_MAP[selectedMood] || [];
    let pool = inStockBooks;
    if (moodCategories.length > 0) {
      const matched = inStockBooks.filter((b) => moodCategories.includes(b.category));
      if (matched.length > 0) {
        pool = matched;
      }
    }

    const previousId = history[history.length - 1];
    const targetBook = getRandomDiscoveryBook(
      pool,
      previousId,
      testMode ? deterministicIndex : undefined
    );

    if (!targetBook) {
      setState('error');
      setError('ไม่สามารถเลือกหนังสือได้ กรุณาลองใหม่อีกครั้ง');
      return;
    }

    // Candidate books for the visible shuffle
    const count = Math.min(candidateCount, pool.length);
    const otherCandidates = pool
      .filter((b) => b.id !== targetBook.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.max(1, count - 1));

    // Ensure decoy candidate exists for fake stop
    const decoyBook = otherCandidates[0] || targetBook;
    const candidateList = [...otherCandidates, targetBook];
    setCandidateBooks(candidateList);

    // Reduced motion: 250ms direct fade
    if (isReducedMotion) {
      setState('starting');
      const timer = window.setTimeout(() => {
        setSelectedBook(targetBook);
        setCurrentCyclingBook(targetBook);
        setState('result');
        setHistory((prev) => [...prev, targetBook.id]);
        if (onSelect) onSelect(targetBook);
      }, 250);
      timeoutIdsRef.current.push(timer);
      return;
    }

    // =========================================================================
    // HIGH-SUSPENSE ANIMATION TIMELINE (~4.0s total)
    // =========================================================================
    // Phase 1: Anticipation (350ms)
    setState('starting');
    setCurrentCyclingBook(candidateList[0]);

    let cumulativeDelay = 350;

    // Phase 2 & 3: Start & Rapid Shuffle (1200ms)
    // Quick cycling intervals: 160ms -> 120ms -> 95ms -> 80ms -> 80ms -> 80ms...
    const rapidIntervals = [160, 120, 100, 90, 80, 80, 80];
    const shuffleTimer = window.setTimeout(() => {
      setState('shuffling');
    }, cumulativeDelay);
    timeoutIdsRef.current.push(shuffleTimer);

    for (let i = 0; i < rapidIntervals.length; i++) {
      cumulativeDelay += rapidIntervals[i];
      const stepBook = candidateList[i % candidateList.length];
      const stepTimer = window.setTimeout(() => {
        setCurrentCyclingBook(stepBook);
      }, cumulativeDelay);
      timeoutIdsRef.current.push(stepTimer);
    }

    // Phase 4: Slow Down (Climax Deceleration - 1300ms)
    // Intervals visibly increase: 120ms -> 180ms -> 260ms -> 380ms -> 500ms
    const slowIntervals = [120, 180, 260, 380, 500];
    const slowTimer = window.setTimeout(() => {
      setState('slowing');
    }, cumulativeDelay);
    timeoutIdsRef.current.push(slowTimer);

    for (let j = 0; j < slowIntervals.length; j++) {
      cumulativeDelay += slowIntervals[j];
      // On the final slow interval, stop on the decoy book to build suspense
      const stepBook =
        j === slowIntervals.length - 1
          ? decoyBook
          : candidateList[(rapidIntervals.length + j) % candidateList.length];

      const decelTimer = window.setTimeout(() => {
        setCurrentCyclingBook(stepBook);
      }, cumulativeDelay);
      timeoutIdsRef.current.push(decelTimer);
    }

    // Phase 5: Fake Stop (Suspense Hesitation - 350ms)
    // The book seems to have stopped on the decoy book... "เอ๊ะ จะเป็นเล่มนี้ไหม?"
    const fakeStopTimer = window.setTimeout(() => {
      setState('fake-stop');
      setCurrentCyclingBook(decoyBook);
    }, cumulativeDelay);
    timeoutIdsRef.current.push(fakeStopTimer);

    // ...Then one final movement tick (120ms) to the TRUE winner book!
    cumulativeDelay += 350;
    const finalTickTimer = window.setTimeout(() => {
      setCurrentCyclingBook(targetBook);
    }, cumulativeDelay);
    timeoutIdsRef.current.push(finalTickTimer);

    // Phase 6: Final Reveal (380ms)
    cumulativeDelay += 120;
    const revealTimer = window.setTimeout(() => {
      setState('revealing');
      setSelectedBook(targetBook);
      setCurrentCyclingBook(targetBook);
    }, cumulativeDelay);
    timeoutIdsRef.current.push(revealTimer);

    // Settled Result State
    cumulativeDelay += 380;
    const resultTimer = window.setTimeout(() => {
      setState('result');
      setHistory((prev) => [...prev, targetBook.id]);
      if (onSelect) onSelect(targetBook);
    }, cumulativeDelay);
    timeoutIdsRef.current.push(resultTimer);
  }, [
    books,
    candidateCount,
    clearTimeouts,
    deterministicIndex,
    history,
    isReducedMotion,
    onSelect,
    selectedMood,
    testMode,
  ]);

  return {
    state,
    selectedBook,
    currentCyclingBook,
    candidateBooks,
    selectedMood,
    setSelectedMood,
    startDiscovery,
    resetDiscovery,
    isRunning,
    isReducedMotion,
    history,
    error,
    setHoverState,
  };
};

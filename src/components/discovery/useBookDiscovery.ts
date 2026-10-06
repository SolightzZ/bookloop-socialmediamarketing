import { useState, useEffect, useRef, useCallback } from 'react';
import { Book, books as defaultBooks } from '../../data/books';
import { DiscoveryState, DiscoveryMoodId, UseBookDiscoveryOptions, UseBookDiscoveryReturn } from './bookDiscovery.types';

const MOOD_CATEGORY_MAP: Record<DiscoveryMoodId, string[]> = {
   'feel-good': ['นิยาย', 'เด็ก'],
   knowledge: ['ความรู้', 'การศึกษา'],
   fun: ['การ์ตูน', 'นิยาย'],
   'self-growth': ['พัฒนาตนเอง', 'ธุรกิจ'],
   relax: ['นิยาย', 'หนังสือสะสม', 'เด็ก'],
   surprise: [], // All categories
};

const getRandomDiscoveryBook = (candidates: Book[], previousBookId?: string, deterministicIndex?: number): Book | null => {
   if (!candidates || candidates.length === 0) return null;
   if (candidates.length === 1) return candidates[0];

   if (typeof deterministicIndex === 'number' && deterministicIndex >= 0) {
      return candidates[deterministicIndex % candidates.length];
   }

   // Filter out previous book to avoid immediate consecutive duplicates
   const filtered = previousBookId ? candidates.filter((b) => b.id !== previousBookId) : candidates;

   const pool = filtered.length > 0 ? filtered : candidates;
   const randomIndex = Math.floor(Math.random() * pool.length);
   return pool[randomIndex];
};

export const useBookDiscovery = (options: UseBookDiscoveryOptions = {}): UseBookDiscoveryReturn => {
   const { books = defaultBooks, onSelect, candidateCount = 6, testMode = false, deterministicIndex } = options;

   const [state, setState] = useState<DiscoveryState>('idle');
   const [selectedMood, setSelectedMoodState] = useState<DiscoveryMoodId>('surprise');
   const [selectedBook, setSelectedBook] = useState<Book | null>(null);
   const [currentCyclingBook, setCurrentCyclingBook] = useState<Book | null>(null);
   const [candidateBooks, setCandidateBooks] = useState<Book[]>([]);
   const [history, setHistory] = useState<string[]>([]);
   const [hasRandomizedOnce, setHasRandomizedOnce] = useState(false);
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

   const isRunning = state === 'starting' || state === 'shuffling' || state === 'slowing' || state === 'fake-stop' || state === 'revealing';

   isRunningRef.current = isRunning;

   const setSelectedMood = useCallback((moodId: DiscoveryMoodId) => {
      if (isRunningRef.current) return;
      setSelectedMoodState(moodId);
   }, []);

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
      setHasRandomizedOnce(false);
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
         setError('ยังไม่มีหนังสือที่เหมาะกับคุณในตอนนี้');
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
      const targetBook = getRandomDiscoveryBook(pool, previousId, testMode ? deterministicIndex : undefined);

      if (!targetBook) {
         setState('error');
         setError('ไม่สามารถเลือกหนังสือได้ในขณะนี้');
         return;
      }

      // Candidate books for the visible shuffle
      const count = Math.min(candidateCount, pool.length);
      const otherCandidates = pool
         .filter((b) => b.id !== targetBook.id)
         .sort(() => 0.5 - Math.random())
         .slice(0, Math.max(1, count - 1));

      const candidateList = [...otherCandidates, targetBook];
      setCandidateBooks(candidateList);

      // Reduced motion: 150ms direct transition
      if (isReducedMotion) {
         setState('starting');
         const timer = window.setTimeout(() => {
            setSelectedBook(targetBook);
            setCurrentCyclingBook(targetBook);
            setState('result');
            setHasRandomizedOnce(true);
            setHistory((prev) => [...prev, targetBook.id]);
            if (onSelect) onSelect(targetBook);
         }, 150);
         timeoutIdsRef.current.push(timer);
         return;
      }

      // =========================================================================
      // 3D GACHA PULL ANIMATION TIMELINE (~4.0s total cinematic duration)
      // 1. Charge & Summon Aura (600ms)
      // 2. 3D Card Vortex & Shuffle Carousel (1800ms)
      // 3. Climax Pull & Slow Down (900ms)
      // 4. Reveal & Impact Shockwave Burst (700ms)
      // 5. Result -> Opens PopUp Modal
      // =========================================================================
      setState('starting');
      setCurrentCyclingBook(candidateList[0]);

      // Phase 1: Charge up & summoning aura (600ms)
      let cumulativeDelay = 600;
      const shuffleTimer = window.setTimeout(() => {
         setState('shuffling');
      }, cumulativeDelay);
      timeoutIdsRef.current.push(shuffleTimer);

      // Phase 2: Rapid card draw vortex (1800ms total across 12 cycles)
      const rapidIntervals = [150, 130, 120, 110, 100, 100, 110, 120, 140, 160, 180, 200, 280];
      for (let i = 0; i < rapidIntervals.length; i++) {
         cumulativeDelay += rapidIntervals[i];
         const stepBook = candidateList[(i + 1) % candidateList.length];
         const stepTimer = window.setTimeout(() => {
            setCurrentCyclingBook(stepBook);
         }, cumulativeDelay);
         timeoutIdsRef.current.push(stepTimer);
      }

      // Phase 3: Climax card deceleration & dramatic suspense focus (900ms)
      const slowTimer = window.setTimeout(() => {
         setState('slowing');
      }, cumulativeDelay);
      timeoutIdsRef.current.push(slowTimer);

      cumulativeDelay += 900;

      // Phase 4: Winner reveal & hero shockwave burst (700ms)
      const revealTimer = window.setTimeout(() => {
         setState('revealing');
         setCurrentCyclingBook(targetBook);
         setSelectedBook(targetBook);
      }, cumulativeDelay);
      timeoutIdsRef.current.push(revealTimer);

      // Phase 5: Settle to result state -> triggers PopUp modal
      cumulativeDelay += 700;
      const resultTimer = window.setTimeout(() => {
         setState('result');
         setHasRandomizedOnce(true);
         setHistory((prev) => [...prev, targetBook.id]);
         if (onSelect) onSelect(targetBook);
      }, cumulativeDelay);
      timeoutIdsRef.current.push(resultTimer);
   }, [books, candidateCount, clearTimeouts, deterministicIndex, history, isReducedMotion, onSelect, selectedMood, testMode]);

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
      hasRandomizedOnce,
      setHoverState,
   };
};

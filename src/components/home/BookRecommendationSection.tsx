import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Star, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { Book, books as defaultBooks } from '../../data/books';
import { AppContainer } from '../common/Container';
import { useWishlist } from '../../hooks/useWishlist';
import { trackEvent } from '../../utils/analytics';

// ============================================================================
// Types & Constants
// ============================================================================

export interface BookRecommendationSectionProps {
   books?: Book[];
   title?: string;
   subtitle?: string;
   eyebrow?: string;
   allBooksCount?: number;
}

const NUM_INDICATORS = 5;

/**
 * Total duration for one full carousel loop cycle.
 * The WAAPI animation plays `translate3d(0,0,0) → translate3d(-50%,0,0)`.
 * `-50%` of the doubled track = exactly one copy's width → seamless loop.
 * At 42 s, speed ≈ 50–70 px/s for a typical 10-card set (200px + 20px gap).
 */
const CYCLE_DURATION_MS = 42_000;

// ============================================================================
// Helper: Condition badge (pre-computed map, no closure allocation per render)
// ============================================================================

const CONDITION_CONFIG_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
   Excellent: {
      label: 'สภาพ: ดีเยี่ยม (95%+)',
      color: '#065F46',
      bg: '#ECFDF5',
      border: 'rgba(53,168,117,0.3)',
   },
   'Very Good': {
      label: 'สภาพ: ดีมาก (85-94%)',
      color: '#1D4ED8',
      bg: '#EFF6FF',
      border: 'rgba(25,118,210,0.3)',
   },
   Good: {
      label: 'สภาพ: ปานกลาง (70-84%)',
      color: '#B45309',
      bg: '#FFFBEB',
      border: 'rgba(245,158,11,0.3)',
   },
   Acceptable: {
      label: 'สภาพ: พอใช้ (50-69%)',
      color: '#475569',
      bg: '#F8FAFC',
      border: '#E2E8F0',
   },
};

const FALLBACK_CONDITION = CONDITION_CONFIG_MAP['Acceptable'];

// ============================================================================
// 1. BookCard — memoized, CSS-contained, individually GPU-promoted
// ============================================================================

export interface BookCardProps {
   book: Book;
   isFirstScreen?: boolean;
   hasDraggedRef?: React.RefObject<boolean>;
}

export const BookCard = memo(function BookCard({ book, isFirstScreen = false, hasDraggedRef }: BookCardProps) {
   const { toggleWishlist, isInWishlist } = useWishlist();
   const isFavorite = isInWishlist(book.id);
   const cc = CONDITION_CONFIG_MAP[book.condition] ?? FALLBACK_CONDITION;

   const handleCardClick = useCallback(
      (e: React.MouseEvent) => {
         if (hasDraggedRef?.current) {
            e.preventDefault();
            return;
         }
         trackEvent('view_product', {
            bookId: book.id,
            title: book.title,
            price: book.price,
         });
      },
      [book.id, book.title, book.price, hasDraggedRef],
   );

   const handleToggleWishlist = useCallback(
      (e: React.MouseEvent) => {
         e.stopPropagation();
         e.preventDefault();
         toggleWishlist(book);
      },
      [book, toggleWishlist],
   );

   return (
      <Box
         component={RouterLink}
         to={`/books/${book.id}`}
         aria-label={`${book.title} โดย ${book.author} ราคา ${book.price} บาท`}
         onClick={handleCardClick}
         sx={{
            textDecoration: 'none',
            color: 'inherit',
            width: { xs: 180, sm: 195, md: 200 },
            flex: '0 0 auto',
            bgcolor: '#FFFFFF',
            border: '1px solid #DCE7F2',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(16,42,67,0.04)',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            // CSS Containment: isolates layout/style/paint from siblings and parent.
            // Combined with will-change on the track, each card gets its own compositor layer
            // only during hover transitions — not at rest — preventing unnecessary layer memory.
            contain: 'layout style paint',
            transition: 'transform 260ms ease-out, box-shadow 260ms ease-out, border-color 260ms ease-out',
            '&:hover': {
               transform: 'translateY(-4px)',
               boxShadow: '0 12px 24px rgba(16,42,67,0.09)',
               borderColor: '#CBD5E1',
            },
            '&:focus-visible': {
               outline: '2px solid #1976D2',
               outlineOffset: '2px',
            },
         }}>
         {/* Cover (2:3 aspect ratio — fixed in CSS to prevent CLS) */}
         <Box
            sx={{
               position: 'relative',
               width: '100%',
               aspectRatio: '2 / 3',
               bgcolor: '#F0F4F8',
               overflow: 'hidden',
               borderTopLeftRadius: '13px',
               borderTopRightRadius: '13px',
            }}>
            <img
               src={book.cover}
               alt={`ปกหนังสือ ${book.title}`}
               loading={isFirstScreen ? 'eager' : 'lazy'}
               fetchPriority={isFirstScreen ? 'high' : 'auto'}
               decoding="async"
               draggable={false}
               style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none',
               }}
               onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80';
               }}
            />

            {/* Wishlist button */}
            <Box
               component="button"
               type="button"
               onClick={handleToggleWishlist}
               aria-label={isFavorite ? `นำ ${book.title} ออกจากรายการโปรด` : 'เพิ่มหนังสือในรายการโปรด'}
               sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(16,42,67,0.1)',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'transform 150ms ease, border-color 150ms ease',
                  '&:hover': { transform: 'scale(1.08)', borderColor: '#CBD5E1' },
                  '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
               }}>
               <Heart size={16} fill={isFavorite ? '#EF4444' : 'none'} color={isFavorite ? '#EF4444' : '#6B8299'} strokeWidth={2} />
            </Box>
         </Box>

         {/* Body */}
         <Box sx={{ p: { xs: 1.5, sm: 1.75 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {/* Category */}
            <Typography
               variant="caption"
               sx={{
                  color: '#1976D2',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 0.6,
               }}>
               {book.category}
            </Typography>

            {/* Condition pill */}
            <Box
               sx={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  px: 1,
                  py: 0.25,
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  bgcolor: cc.bg,
                  color: cc.color,
                  border: `1px solid ${cc.border}`,
                  mb: 1,
               }}>
               {cc.label}
            </Box>

            {/* Title */}
            <Typography
               component="h3"
               sx={{
                  fontWeight: 700,
                  lineHeight: 1.35,
                  height: '2.7em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  color: '#102A43',
                  fontSize: '0.925rem',
                  letterSpacing: '-0.01em',
                  mb: 0.5,
               }}
               title={book.title}>
               {book.title}
            </Typography>

            {/* Author */}
            <Typography
               variant="caption"
               sx={{
                  color: '#6B8299',
                  fontSize: '0.8125rem',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mb: 1,
               }}
               title={book.author}>
               {book.author}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.25 }}>
               <Star size={14} fill="#F59E0B" color="#F59E0B" />
               <Typography component="span" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#102A43' }}>
                  {book.rating.toFixed(1)}
               </Typography>
               <Typography component="span" sx={{ color: '#6B8299', fontSize: '0.75rem' }}>
                  ({book.reviewCount})
               </Typography>
            </Box>

            {/* Price */}
            <Box
               sx={{
                  mt: 'auto',
                  pt: 1.25,
                  borderTop: '1px solid #F0F4F8',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 1,
               }}>
               <Typography component="span" sx={{ fontWeight: 800, color: '#102A43', fontSize: '1.15rem', lineHeight: 1 }}>
                  ฿{book.price.toLocaleString()}
               </Typography>
               {book.originalPrice && book.originalPrice > book.price && (
                  <Typography component="span" sx={{ color: '#6B8299', textDecoration: 'line-through', fontSize: '0.8125rem' }}>
                     ฿{book.originalPrice.toLocaleString()}
                  </Typography>
               )}
            </Box>
         </Box>
      </Box>
   );
});

// ============================================================================
// 2. Navigation Buttons (Liquid Glass Theme)
// ============================================================================

export interface NavigationButtonProps {
   onClick: () => void;
   ariaLabel: string;
}

const liquidGlassButtonStyles = {
   position: 'absolute' as const,
   top: '50%',
   transform: 'translateY(-50%)',
   width: { xs: 40, sm: 48, md: 52 },
   height: { xs: 40, sm: 48, md: 52 },
   borderRadius: '50%',
   // Liquid Glass base styling:
   bgcolor: 'rgba(255, 255, 255, 0.7)',
   backdropFilter: 'blur(16px) saturate(190%)',
   WebkitBackdropFilter: 'blur(16px) saturate(190%)',
   border: '1px solid rgba(255, 255, 255, 0.85)',
   boxShadow: '0 8px 24px -4px rgba(15, 45, 74, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(15, 45, 74, 0.05)',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   color: '#0F2D4A',
   cursor: 'pointer',
   zIndex: 25,
   WebkitTapHighlightColor: 'transparent',
   transition: 'transform 240ms cubic-bezier(0.25, 1, 0.5, 1), background-color 200ms ease, box-shadow 240ms ease, border-color 200ms ease, color 200ms ease',
   '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.92)',
      borderColor: 'rgba(255, 255, 255, 1)',
      color: '#1976D2',
      transform: 'translateY(-50%) scale(1.08)',
      boxShadow: '0 12px 32px -4px rgba(15, 45, 74, 0.12), inset 0 2px 3px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(15, 45, 74, 0.05)',
   },
   '&:active': {
      transform: 'translateY(-50%) scale(0.95)',
      bgcolor: 'rgba(255, 255, 255, 0.98)',
      boxShadow: '0 4px 12px -2px rgba(15, 45, 74, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
   },
   '&:focus-visible': {
      outline: '2px solid #1976D2',
      outlineOffset: '3px',
   },
};

export const PreviousButton: React.FC<NavigationButtonProps> = ({ onClick, ariaLabel }) => (
   <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
         ...liquidGlassButtonStyles,
         left: { xs: 6, sm: -14, md: -24 },
      }}>
      <ChevronLeft size={24} strokeWidth={2.5} />
   </Box>
);

export const NextButton: React.FC<NavigationButtonProps> = ({ onClick, ariaLabel }) => (
   <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
         ...liquidGlassButtonStyles,
         right: { xs: 6, sm: -14, md: -24 },
      }}>
      <ChevronRight size={24} strokeWidth={2.5} />
   </Box>
);

// ============================================================================
// 3. CarouselIndicators
// ============================================================================

export interface CarouselIndicatorsProps {
   count: number;
   activeIndex: number;
   onSelect: (index: number) => void;
}

export const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({ count, activeIndex, onSelect }) => (
   <Box
      role="tablist"
      aria-label="ตัวเลือกหน้าหนังสือแนะนำ"
      sx={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         gap: 1,
         mt: { xs: 3.5, sm: 4, md: 5 },
      }}>
      {Array.from({ length: count }).map((_, index) => {
         const isActive = activeIndex === index;
         return (
            <Box
               key={index}
               component="button"
               type="button"
               role="tab"
               aria-selected={isActive}
               aria-label={`หน้า ${index + 1}`}
               onClick={() => onSelect(index)}
               sx={{
                  width: isActive ? { xs: 28, sm: 36 } : { xs: 20, sm: 24 },
                  height: 4,
                  borderRadius: 2,
                  bgcolor: isActive ? '#1976D2' : '#D2DFEC',
                  border: 'none',
                  p: 0,
                  cursor: 'pointer',
                  transition: 'all 280ms cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': { bgcolor: isActive ? '#1976D2' : '#B8D1EB' },
                  '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
               }}
            />
         );
      })}
   </Box>
);

// ============================================================================
// 4. CarouselTrack
// ============================================================================

export interface CarouselTrackProps {
   trackRef: React.RefObject<HTMLDivElement | null>;
   children: React.ReactNode;
}

export const CarouselTrack: React.FC<CarouselTrackProps> = ({ trackRef, children }) => (
   <Box
      ref={trackRef}
      sx={{
         display: 'flex',
         gap: '20px',
         width: 'max-content',
         // willChange promotes the layer once; WAAPI then drives compositing directly.
         // Do NOT set willChange on each card — that would fragment compositor layers.
         willChange: 'transform',
         backfaceVisibility: 'hidden',
         WebkitBackfaceVisibility: 'hidden',
      }}>
      {children}
   </Box>
);

// ============================================================================
// 5. BookCarousel — WAAPI-driven infinite marquee
//
// Performance architecture:
//
//   Autoplay  → element.animate() keyframe runs fully on the GPU compositor thread.
//               Zero JS touches the main thread during normal scroll.
//
//   Drag      → anim.pause() suspends compositor; pointermove queues a single
//               anim.currentTime write per rAF frame (RAF-batched). On release,
//               anim.play() hands back to compositor. No inline style hacks.
//
//   Arrows    → anim.currentTime += jumpMs — instant compositor seek, no RAF.
//
//   Indicator → setInterval at 500 ms reads anim.currentTime once, batches a
//               single React setState. Never runs on the animation frame budget.
//
//   Suspend   → IntersectionObserver + Page Visibility API call anim.pause() /
//               anim.play(). Zero CPU/GPU when tab is hidden or section is
//               scrolled far out of view.
// ============================================================================

export interface BookCarouselProps {
   books: Book[];
   activeIndicator?: number;
   onIndicatorChange?: (index: number) => void;
   carouselRef?: React.MutableRefObject<{
      slidePrevious: () => void;
      slideNext: () => void;
      slideToIndex: (index: number) => void;
   } | null>;
}

export const BookCarousel: React.FC<BookCarouselProps> = ({ books, activeIndicator = 0, onIndicatorChange, carouselRef }) => {
   const prefersReduced = useReducedMotion();

   // Double the dataset for seamless looping (pad to ≥ 8 so it always fills viewport)
   // 3 identical copies: Copy 0 (buffer left), Copy 1 (active center), Copy 2 (buffer right).
   // This guarantees that moving in either direction ALWAYS has visible cards with zero blank gaps.
   const carouselBooks = useMemo(() => {
      let list = books;
      while (list.length < 8 && list.length > 0) list = [...list, ...list];
      return [...list, ...list, ...list];
   }, [books]);

   const numCards = carouselBooks.length / 3;

   const viewportRef = useRef<HTMLDivElement>(null);
   const trackRef = useRef<HTMLDivElement>(null);

   // Position & layout refs (zero React re-renders during motion)
   const offsetRef = useRef<number>(0);
   const targetOffsetRef = useRef<number>(0);
   const copyWidthRef = useRef<number>(0);
   const stepPxRef = useRef<number>(220);
   const hasInitializedRef = useRef<boolean>(false);

   // Interaction refs
   const isHoveredRef = useRef<boolean>(false);
   const isDraggingRef = useRef<boolean>(false);
   const hasDraggedRef = useRef<boolean>(false);
   const isHorizontalDragRef = useRef<boolean>(false);
   const isVisibleInViewportRef = useRef<boolean>(true);
   const pointerStartXRef = useRef<number>(0);
   const pointerStartYRef = useRef<number>(0);
   const dragStartOffsetRef = useRef<number>(0);
   const lastUserActionTimeRef = useRef<number>(0);
   const lastIndicatorTimeRef = useRef<number>(0);
   const activeIndicatorRef = useRef<number>(activeIndicator);

   // Keep indicator ref in sync with prop
   useEffect(() => {
      activeIndicatorRef.current = activeIndicator;
   }, [activeIndicator]);

   // ------------------------------------------------------------------
   // Layout measurement (runs on mount and on resize)
   // ------------------------------------------------------------------
   const measure = useCallback(() => {
      const track = trackRef.current;
      if (!track || numCards <= 0) return;

      const firstCard = track.children[0] as HTMLElement | undefined;
      const secondCard = track.children[1] as HTMLElement | undefined;
      const secondCopyCard = track.children[numCards] as HTMLElement | undefined;

      if (firstCard && secondCopyCard) {
         const copyW = secondCopyCard.offsetLeft - firstCard.offsetLeft;
         if (copyW > 0) copyWidthRef.current = copyW;
      }
      if (firstCard && secondCard) {
         const step = secondCard.offsetLeft - firstCard.offsetLeft;
         if (step > 0) stepPxRef.current = step;
      }

      // Set initial position to center copy (-copyWidth) if not yet initialized
      if (!hasInitializedRef.current && copyWidthRef.current > 0) {
         offsetRef.current = -copyWidthRef.current;
         targetOffsetRef.current = -copyWidthRef.current;
         track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
         hasInitializedRef.current = true;
      }
   }, [numCards]);

   useEffect(() => {
      measure();

      const track = trackRef.current;
      if (!track) return;

      let rafId: number | null = null;
      const ro = new ResizeObserver(() => {
         if (rafId !== null) return;
         rafId = requestAnimationFrame(() => {
            measure();
            rafId = null;
         });
      });

      ro.observe(track);

      return () => {
         ro.disconnect();
         if (rafId !== null) cancelAnimationFrame(rafId);
      };
   }, [measure]);

   // ------------------------------------------------------------------
   // High-performance RAF animation loop (compositor-direct 60/120/165Hz)
   // ------------------------------------------------------------------
   useEffect(() => {
      const track = trackRef.current;
      if (!track) return;

      let rafId: number | null = null;
      let lastTime = performance.now();

      const loop = (now: number) => {
         rafId = requestAnimationFrame(loop);

         const dt = Math.min((now - lastTime) / 1000, 0.05); // clamp max 50ms
         lastTime = now;

         const oneCopyWidth = copyWidthRef.current;
         if (!oneCopyWidth) return;

         const isInteracting = isDraggingRef.current;
         const isPaused = isHoveredRef.current || !isVisibleInViewportRef.current || document.hidden || Boolean(prefersReduced);

         if (!isInteracting) {
            const dist = targetOffsetRef.current - offsetRef.current;

            // Smooth physics-based glide toward target (from arrow button click or drag release)
            if (Math.abs(dist) > 0.3) {
               // Exponential ease-out: ultra-smooth at any refresh rate
               const factor = 1 - Math.exp(-14 * dt);
               offsetRef.current += dist * factor;
            } else {
               offsetRef.current = targetOffsetRef.current;

               // Autoplay: resume gentle continuous scroll after 2.5s cooldown from user action
               const isUserActionCooldown = now - lastUserActionTimeRef.current < 2500;
               if (!isPaused && !isUserActionCooldown) {
                  const autoScrollSpeed = 48; // px/sec: smooth, legible, calm
                  offsetRef.current -= autoScrollSpeed * dt;
                  targetOffsetRef.current = offsetRef.current;
               }
            }
         }

         // Seamless infinite wrapping around center copy [-2*W, -W]
         while (offsetRef.current <= -2 * oneCopyWidth) {
            offsetRef.current += oneCopyWidth;
            targetOffsetRef.current += oneCopyWidth;
         }
         while (offsetRef.current > -oneCopyWidth) {
            offsetRef.current -= oneCopyWidth;
            targetOffsetRef.current -= oneCopyWidth;
         }

         // Direct GPU transform update (zero React re-renders)
         track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;

         // Periodically update active indicator
         if (now - lastIndicatorTimeRef.current > 250) {
            lastIndicatorTimeRef.current = now;
            const normalized = (((-offsetRef.current - oneCopyWidth) % oneCopyWidth) + oneCopyWidth) % oneCopyWidth;
            const idx = Math.min(Math.floor((normalized / oneCopyWidth) * NUM_INDICATORS), NUM_INDICATORS - 1);
            if (idx !== activeIndicatorRef.current) {
               activeIndicatorRef.current = idx;
               onIndicatorChange?.(idx);
            }
         }
      };

      rafId = requestAnimationFrame(loop);

      return () => {
         if (rafId !== null) cancelAnimationFrame(rafId);
      };
   }, [prefersReduced, onIndicatorChange]);

   // ------------------------------------------------------------------
   // IntersectionObserver & Visibility API (saves 100% CPU when off-screen)
   // ------------------------------------------------------------------
   useEffect(() => {
      const el = viewportRef.current;
      if (!el) return;

      const io = new IntersectionObserver(
         ([entry]) => {
            isVisibleInViewportRef.current = entry.isIntersecting;
         },
         { rootMargin: '200px' },
      );

      io.observe(el);
      return () => io.disconnect();
   }, []);

   // ------------------------------------------------------------------
   // Arrow Navigation Controls (smoothly glide by 1 card with ease-out)
   // ------------------------------------------------------------------
   const slideNext = useCallback(() => {
      lastUserActionTimeRef.current = performance.now();
      const step = stepPxRef.current || 220;
      // Advance target by 1 step from current target (queuing multiple clicks seamlessly)
      const baseTarget = Math.min(offsetRef.current, targetOffsetRef.current);
      const nearestCard = Math.floor(-baseTarget / step);
      targetOffsetRef.current = -((nearestCard + 1) * step);
   }, []);

   const slidePrevious = useCallback(() => {
      lastUserActionTimeRef.current = performance.now();
      const step = stepPxRef.current || 220;
      // Go back by 1 step from current target (queuing multiple clicks seamlessly)
      const baseTarget = Math.max(offsetRef.current, targetOffsetRef.current);
      const nearestCard = Math.ceil(-baseTarget / step);
      targetOffsetRef.current = -((nearestCard - 1) * step);
   }, []);

   const slideToIndex = useCallback((index: number) => {
      lastUserActionTimeRef.current = performance.now();
      const oneCopyWidth = copyWidthRef.current;
      if (!oneCopyWidth) return;
      targetOffsetRef.current = -oneCopyWidth - (index / NUM_INDICATORS) * oneCopyWidth;
   }, []);

   useEffect(() => {
      if (carouselRef) {
         carouselRef.current = { slidePrevious, slideNext, slideToIndex };
      }
   }, [carouselRef, slidePrevious, slideNext, slideToIndex]);

   // ------------------------------------------------------------------
   // Hover & Gesture Handling
   // ------------------------------------------------------------------
   const handleMouseEnter = useCallback(() => {
      isHoveredRef.current = true;
   }, []);

   const handleMouseLeave = useCallback(() => {
      isHoveredRef.current = false;
   }, []);

   const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      isHorizontalDragRef.current = false;
      pointerStartXRef.current = e.clientX;
      pointerStartYRef.current = e.clientY;
      dragStartOffsetRef.current = offsetRef.current;
      targetOffsetRef.current = offsetRef.current;
      lastUserActionTimeRef.current = performance.now();
   }, []);

   const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - pointerStartXRef.current;
      const dy = e.clientY - pointerStartYRef.current;

      if (!isHorizontalDragRef.current) {
         if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
            isDraggingRef.current = false;
            try {
               if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  e.currentTarget.releasePointerCapture(e.pointerId);
               }
            } catch {
               // Ignored
            }
            return;
         }
         if (Math.abs(dx) > 8) {
            isHorizontalDragRef.current = true;
            try {
               e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
               // Ignored
            }
         }
      }

      if (!isHorizontalDragRef.current) return;

      hasDraggedRef.current = true;
      offsetRef.current = dragStartOffsetRef.current + dx;
      targetOffsetRef.current = offsetRef.current;
   }, []);

   const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      try {
         if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
         }
      } catch {
         // Ignored
      }

      // Snap to nearest card upon release only if user dragged horizontally
      if (isHorizontalDragRef.current) {
         const step = stepPxRef.current || 220;
         const nearestCard = Math.round(-offsetRef.current / step);
         targetOffsetRef.current = -(nearestCard * step);
         lastUserActionTimeRef.current = performance.now();
      }

      if (hasDraggedRef.current) {
         setTimeout(() => {
            hasDraggedRef.current = false;
         }, 100);
      }
   }, []);

   return (
      <Box sx={{ position: 'relative', width: '100%' }}>
         {/* Viewport — clips overflow and captures gesture events */}
         <Box
            ref={viewportRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            sx={{
               overflow: 'hidden',
               py: 2.5, // breathing room for card hover lift + shadow
               touchAction: 'pan-y', // native vertical scroll; horizontal is captured by JS
               cursor: 'grab',
               '&:active': { cursor: 'grabbing' },
            }}>
            <CarouselTrack trackRef={trackRef}>
               {carouselBooks.map((book, index) => (
                  <BookCard key={`${book.id}-c${index}`} book={book} isFirstScreen={index >= numCards && index < numCards + 6} hasDraggedRef={hasDraggedRef} />
               ))}
            </CarouselTrack>
         </Box>

         <PreviousButton onClick={slidePrevious} ariaLabel="หนังสือก่อนหน้า" />
         <NextButton onClick={slideNext} ariaLabel="หนังสือถัดไป" />
      </Box>
   );
};

// ============================================================================
// 6. BookRecommendationSection
// ============================================================================

export const BookRecommendationSection: React.FC<BookRecommendationSectionProps> = ({
   books = defaultBooks.filter((b) => b.featured),
   title = 'หนังสือแนะนำประจำสัปดาห์',
   subtitle = 'หนังสือมือสองคุณภาพดีที่ทีมงานคัดจากคลังของชุมชน BookLoop',
   eyebrow = 'CURATED SELECTION',
   allBooksCount = defaultBooks.length,
}) => {
   const navigate = useNavigate();

   const carouselControlsRef = useRef<{
      slidePrevious: () => void;
      slideNext: () => void;
      slideToIndex: (index: number) => void;
   } | null>(null);

   return (
      <Box
         component="section"
         id="recommended-books"
         aria-labelledby="recommended-books-heading"
         sx={{
            py: { xs: 8, sm: 10, md: 12 },
            bgcolor: '#F3F8FE',
            borderTop: '1px solid #DCE7F2',
            borderBottom: '1px solid #DCE7F2',
            position: 'relative',
            overflow: 'hidden',
         }}>
         <AppContainer>
            {/* Section Header */}
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                  gap: { xs: 2, sm: 3 },
                  mb: { xs: 4, sm: 5, md: 6 },
               }}>
               <Box sx={{ maxWidth: '680px' }}>
                  <Typography
                     variant="overline"
                     component="span"
                     sx={{
                        display: 'inline-block',
                        color: '#1976D2',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        mb: 1,
                        textTransform: 'uppercase',
                     }}>
                     {eyebrow}
                  </Typography>

                  <Typography
                     id="recommended-books-heading"
                     variant="h2"
                     component="h2"
                     sx={{
                        fontWeight: 800,
                        color: '#102A43',
                        fontSize: { xs: '1.75rem', sm: '2.15rem', md: '2.5rem', lg: '2.75rem' },
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                        mb: subtitle ? 1.25 : 0,
                     }}>
                     {title}
                  </Typography>

                  {subtitle && (
                     <Typography
                        variant="body1"
                        sx={{
                           color: '#6B8299',
                           fontSize: { xs: '0.9375rem', sm: '1.0625rem' },
                           lineHeight: 1.65,
                           fontWeight: 400,
                        }}>
                        {subtitle}
                     </Typography>
                  )}
               </Box>

               <Button
                  variant="text"
                  onClick={() => navigate('/books')}
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                     fontWeight: 700,
                     fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                     px: 1.5,
                     py: 0.75,
                     borderRadius: 2,
                     alignSelf: { xs: 'flex-start', sm: 'flex-end' },
                     whiteSpace: 'nowrap',
                     color: '#1976D2',
                     '&:hover': {
                        bgcolor: 'rgba(25,118,210,0.08)',
                        transform: 'translateX(2px)',
                     },
                     transition: 'all 0.2s ease',
                  }}>
                  {`ดูหนังสือทั้งหมด (${allBooksCount})`}
               </Button>
            </Box>

            <BookCarousel books={books} carouselRef={carouselControlsRef} />
         </AppContainer>
      </Box>
   );
};

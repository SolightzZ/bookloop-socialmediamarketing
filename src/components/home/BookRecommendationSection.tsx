import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  ArrowRight,
} from 'lucide-react';
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

const CONDITION_CONFIG_MAP: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
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

export const BookCard = memo(function BookCard({
  book,
  isFirstScreen = false,
  hasDraggedRef,
}: BookCardProps) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(book.id);
  const cc = CONDITION_CONFIG_MAP[book.condition] ?? FALLBACK_CONDITION;

  const handleCardClick = useCallback(() => {
    if (hasDraggedRef?.current) return;
    trackEvent('view_product', {
      bookId: book.id,
      title: book.title,
      price: book.price,
    });
    navigate(`/books/${book.id}`);
  }, [book.id, book.title, book.price, navigate, hasDraggedRef]);

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      toggleWishlist(book);
    },
    [book, toggleWishlist]
  );

  return (
    <Box
      role="link"
      tabIndex={0}
      aria-label={`${book.title} โดย ${book.author} ราคา ${book.price} บาท`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
      sx={{
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
        transition:
          'transform 260ms ease-out, box-shadow 260ms ease-out, border-color 260ms ease-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(16,42,67,0.09)',
          borderColor: '#CBD5E1',
        },
        '&:focus-visible': {
          outline: '2px solid #1976D2',
          outlineOffset: '2px',
        },
      }}
    >
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
        }}
      >
        <img
          src={book.cover}
          alt={`ปกหนังสือ ${book.title}`}
          loading={isFirstScreen ? 'eager' : 'lazy'}
          fetchPriority={isFirstScreen ? 'high' : 'auto'}
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80';
          }}
        />

        {/* Wishlist button */}
        <Box
          component="button"
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            isFavorite
              ? `นำ ${book.title} ออกจากรายการโปรด`
              : 'เพิ่มหนังสือในรายการโปรด'
          }
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
          }}
        >
          <Heart
            size={16}
            fill={isFavorite ? '#EF4444' : 'none'}
            color={isFavorite ? '#EF4444' : '#6B8299'}
            strokeWidth={2}
          />
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
          }}
        >
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
          }}
        >
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
          title={book.title}
        >
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
          title={book.author}
        >
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
          }}
        >
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
// 2. Navigation Buttons
// ============================================================================

export interface NavigationButtonProps {
  onClick: () => void;
  ariaLabel: string;
}

export const PreviousButton: React.FC<NavigationButtonProps> = ({ onClick, ariaLabel }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    sx={{
      position: 'absolute',
      top: '50%',
      left: { xs: 4, sm: -14, md: -22 },
      transform: 'translateY(-50%)',
      width: 44,
      height: 44,
      borderRadius: '50%',
      bgcolor: '#FFFFFF',
      border: '1px solid #DCE7F2',
      boxShadow: '0 4px 12px rgba(16,42,67,0.08)',
      display: { xs: 'none', sm: 'flex' },
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1976D2',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
      '&:hover': {
        borderColor: '#90CAF9',
        transform: 'translateY(-50%) scale(1.03)',
        boxShadow: '0 6px 16px rgba(16,42,67,0.12)',
      },
      '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
    }}
  >
    <ChevronLeft size={22} strokeWidth={2.5} />
  </Box>
);

export const NextButton: React.FC<NavigationButtonProps> = ({ onClick, ariaLabel }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    sx={{
      position: 'absolute',
      top: '50%',
      right: { xs: 4, sm: -14, md: -22 },
      transform: 'translateY(-50%)',
      width: 44,
      height: 44,
      borderRadius: '50%',
      bgcolor: '#FFFFFF',
      border: '1px solid #DCE7F2',
      boxShadow: '0 4px 12px rgba(16,42,67,0.08)',
      display: { xs: 'none', sm: 'flex' },
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1976D2',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
      '&:hover': {
        borderColor: '#90CAF9',
        transform: 'translateY(-50%) scale(1.03)',
        boxShadow: '0 6px 16px rgba(16,42,67,0.12)',
      },
      '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
    }}
  >
    <ChevronRight size={22} strokeWidth={2.5} />
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

export const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  count,
  activeIndex,
  onSelect,
}) => (
  <Box
    role="tablist"
    aria-label="ตัวเลือกหน้าหนังสือแนะนำ"
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1,
      mt: { xs: 3.5, sm: 4, md: 5 },
    }}
  >
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
    }}
  >
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
  activeIndicator: number;
  onIndicatorChange: (index: number) => void;
  carouselRef?: React.MutableRefObject<{
    slidePrevious: () => void;
    slideNext: () => void;
    slideToIndex: (index: number) => void;
  } | null>;
}

export const BookCarousel: React.FC<BookCarouselProps> = ({
  books,
  activeIndicator,
  onIndicatorChange,
  carouselRef,
}) => {
  const prefersReduced = useReducedMotion();

  // Double the dataset for seamless looping (pad to ≥ 8 so it always fills viewport)
  const carouselBooks = useMemo(() => {
    let list = books;
    while (list.length < 8 && list.length > 0) list = [...list, ...list];
    return [...list, ...list]; // Two copies — animation moves exactly -50% for one loop
  }, [books]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const animRef     = useRef<Animation | null>(null);

  // Physical width of one copy in px — computed once, updated on resize.
  // Used for arrow-navigation currentTime math and drag delta mapping.
  const copyWidthRef = useRef<number>(0);

  // Behavioural state (refs → zero React re-renders during animation or drag)
  const isPausedByHoverRef     = useRef(false);
  const isVisibleInViewportRef = useRef(true);
  const isDraggingRef          = useRef(false);
  const hasDraggedRef          = useRef(false);
  const isHorizontalDragRef    = useRef(false);
  const pointerStartXRef       = useRef(0);
  const pointerStartYRef       = useRef(0);
  const dragAnimStartTimeRef   = useRef(0); // anim.currentTime snapshot at drag start
  const pendingTimeRef         = useRef(0); // buffered value for RAF-batched write
  const dragRafIdRef           = useRef<number | null>(null);

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  /** Returns true when autoplay is allowed right now. */
  const canPlay = useCallback((): boolean =>
    !prefersReduced &&
    !isPausedByHoverRef.current &&
    !isDraggingRef.current &&
    isVisibleInViewportRef.current &&
    !document.hidden,
  [prefersReduced]);

  /** Safe resume — only resumes if all gate conditions pass. */
  const tryPlay = useCallback(() => {
    if (canPlay()) animRef.current?.play();
  }, [canPlay]);

  // ------------------------------------------------------------------
  // Create / destroy the WAAPI animation
  // ------------------------------------------------------------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReduced) return;

    /**
     * The keyframe animates translate3d(0,0,0) → translate3d(-50%,0,0).
     * Because the track contains exactly two copies of the book list,
     * its total width = 2 × copyWidth. So -50% of total = -copyWidth.
     * This is a perfect seamless loop: when the first copy has scrolled
     * fully off, the second copy is in the exact same start position.
     *
     * The `-50%` is a CSS percentage value resolved by the browser each
     * frame against the element's own computed width — meaning it adapts
     * automatically to viewport/font-size changes without JS pixel math.
     */
    const anim = track.animate(
      [
        { transform: 'translate3d(0,0,0)' },
        { transform: 'translate3d(-50%,0,0)' },
      ],
      {
        duration: CYCLE_DURATION_MS,
        iterations: Infinity,
        easing: 'linear',
      }
    );

    animRef.current = anim;

    return () => {
      anim.cancel();
      animRef.current = null;
    };
  }, [prefersReduced, carouselBooks]); // Recreate if books or reduced-motion changes

  // ------------------------------------------------------------------
  // Measure physical copy width (for arrow/drag math only)
  // ------------------------------------------------------------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      // scrollWidth = total track width; half = one copy's width
      const half = track.scrollWidth / 2;
      if (half > 0) copyWidthRef.current = half;
    };

    measure();

    // RAF-throttled ResizeObserver — prevents notification-loop jank
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
  }, [carouselBooks]);

  // ------------------------------------------------------------------
  // IntersectionObserver — suspend when section is off-screen
  // ------------------------------------------------------------------
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleInViewportRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          animRef.current?.pause();
        } else {
          tryPlay();
        }
      },
      { rootMargin: '200px' } // start 200px before entering viewport
    );

    io.observe(el);
    return () => io.disconnect();
  }, [tryPlay]);

  // ------------------------------------------------------------------
  // Page Visibility API — suspend when tab is hidden / minimised
  // ------------------------------------------------------------------
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        animRef.current?.pause();
      } else {
        tryPlay();
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [tryPlay]);

  // ------------------------------------------------------------------
  // Indicator update — low-frequency interval instead of per-frame RAF
  // ------------------------------------------------------------------
  useEffect(() => {
    if (prefersReduced) return;

    const id = setInterval(() => {
      const anim = animRef.current;
      if (!anim || anim.playState !== 'running') return;
      const ct = (anim.currentTime as number) ?? 0;
      const fraction = (ct % CYCLE_DURATION_MS) / CYCLE_DURATION_MS;
      onIndicatorChange(
        Math.min(Math.floor(fraction * NUM_INDICATORS), NUM_INDICATORS - 1)
      );
    }, 500);

    return () => clearInterval(id);
  }, [onIndicatorChange, prefersReduced]);

  // ------------------------------------------------------------------
  // Arrow navigation — instant compositor seek via currentTime
  // ------------------------------------------------------------------
  const slideNext = useCallback(() => {
    const anim = animRef.current;
    if (!anim) return;
    const numCards = carouselBooks.length / 2;
    const jumpMs = (1 / numCards) * CYCLE_DURATION_MS;
    const ct = (anim.currentTime as number) ?? 0;
    anim.currentTime = (ct + jumpMs) % CYCLE_DURATION_MS;
  }, [carouselBooks.length]);

  const slidePrevious = useCallback(() => {
    const anim = animRef.current;
    if (!anim) return;
    const numCards = carouselBooks.length / 2;
    const jumpMs = (1 / numCards) * CYCLE_DURATION_MS;
    const ct = (anim.currentTime as number) ?? 0;
    anim.currentTime = ((ct - jumpMs) + CYCLE_DURATION_MS) % CYCLE_DURATION_MS;
  }, [carouselBooks.length]);

  const slideToIndex = useCallback((index: number) => {
    const anim = animRef.current;
    if (!anim) return;
    anim.currentTime = (index / NUM_INDICATORS) * CYCLE_DURATION_MS;
  }, []);

  useEffect(() => {
    if (carouselRef) {
      carouselRef.current = { slidePrevious, slideNext, slideToIndex };
    }
  }, [carouselRef, slidePrevious, slideNext, slideToIndex]);

  // ------------------------------------------------------------------
  // Hover pause / resume
  // ------------------------------------------------------------------
  const handleMouseEnter = useCallback(() => {
    isPausedByHoverRef.current = true;
    animRef.current?.pause();
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPausedByHoverRef.current = false;
    tryPlay();
  }, [tryPlay]);

  // ------------------------------------------------------------------
  // Drag — pauses WAAPI, scrubs currentTime via RAF-batched writes,
  //         then resumes on release. No inline style mutations.
  // ------------------------------------------------------------------
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }

    const anim = animRef.current;
    if (anim) {
      anim.pause();
      dragAnimStartTimeRef.current = (anim.currentTime as number) ?? 0;
    }

    isDraggingRef.current       = true;
    hasDraggedRef.current       = false;
    isHorizontalDragRef.current = false;
    pointerStartXRef.current    = e.clientX;
    pointerStartYRef.current    = e.clientY;
    pendingTimeRef.current      = dragAnimStartTimeRef.current;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - pointerStartXRef.current;
    const dy = e.clientY - pointerStartYRef.current;

    if (!isHorizontalDragRef.current) {
      // If vertical scroll intent is detected first, release drag cleanly
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        isDraggingRef.current = false;
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
        tryPlay();
        return;
      }
      if (Math.abs(dx) > 8) isHorizontalDragRef.current = true;
    }

    if (!isHorizontalDragRef.current) return;

    hasDraggedRef.current = true;
    const copyWidth = copyWidthRef.current;
    if (!copyWidth) return;

    // Dragging left (dx < 0) → scroll forward → later in the animation
    const deltaPx = -dx;
    const fraction = deltaPx / copyWidth;
    const newTime  =
      ((dragAnimStartTimeRef.current + fraction * CYCLE_DURATION_MS)
        % CYCLE_DURATION_MS + CYCLE_DURATION_MS)
      % CYCLE_DURATION_MS;

    pendingTimeRef.current = newTime;

    // Batch the compositor write to one per animation frame
    if (dragRafIdRef.current === null) {
      dragRafIdRef.current = requestAnimationFrame(() => {
        const anim = animRef.current;
        if (anim) anim.currentTime = pendingTimeRef.current;
        dragRafIdRef.current = null;
      });
    }
  }, [tryPlay]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Flush any pending RAF write before resuming
    if (dragRafIdRef.current !== null) {
      cancelAnimationFrame(dragRafIdRef.current);
      dragRafIdRef.current = null;
      const anim = animRef.current;
      if (anim) anim.currentTime = pendingTimeRef.current;
    }

    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }

    tryPlay();

    if (hasDraggedRef.current) {
      // Brief cooldown so BookCard click handler doesn't fire after a swipe
      setTimeout(() => { hasDraggedRef.current = false; }, 80);
    }
  }, [tryPlay]);

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
        }}
      >
        <CarouselTrack trackRef={trackRef}>
          {carouselBooks.map((book, index) => (
            <BookCard
              key={`${book.id}-c${index}`}
              book={book}
              isFirstScreen={index < 7}
              hasDraggedRef={hasDraggedRef}
            />
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
  const [activeIndicator, setActiveIndicator] = useState(0);

  const carouselControlsRef = useRef<{
    slidePrevious: () => void;
    slideNext: () => void;
    slideToIndex: (index: number) => void;
  } | null>(null);

  const handleSelectIndicator = useCallback((index: number) => {
    setActiveIndicator(index);
    carouselControlsRef.current?.slideToIndex(index);
  }, []);

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
      }}
    >
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
          }}
        >
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
              }}
            >
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
              }}
            >
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
                }}
              >
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
            }}
          >
            {`ดูหนังสือทั้งหมด (${allBooksCount})`}
          </Button>
        </Box>

        <BookCarousel
          books={books}
          activeIndicator={activeIndicator}
          onIndicatorChange={setActiveIndicator}
          carouselRef={carouselControlsRef}
        />

        <CarouselIndicators
          count={NUM_INDICATORS}
          activeIndex={activeIndicator}
          onSelect={handleSelectIndicator}
        />
      </AppContainer>
    </Box>
  );
};

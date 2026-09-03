/**
 * Motion Configuration — Premium 2D Animated Hero
 * All values match the detailed spec. Centralized for zero duplication.
 */

export const motionConfig = {
  // ── Girl (primary focal point) ──────────────────────────────────
  girl: {
    body: {
      breathing: { duration: 4, scaleY: [1, 1.008, 1] },
    },
    head: {
      float: {
        duration: 5,
        y: [0, -2, 0],
        rotate: [-0.5, 0.5, -0.5],
      },
    },
    hair: {
      back: {
        rotate: [-0.25, 0.35, -0.25],
        duration: 4.2,
        delay: 0.18,
      },
      front: {
        rotate: [-0.2, 0.3, -0.2],
        duration: 3.8,
        delay: 0.22,
      },
    },
    eyes: {
      blink: {
        duration: 0.15, // 120–180ms
        scaleY: [1, 0.05, 1],
        interval: { min: 3000, max: 6000 },
      },
      lookAt: {
        maxOffset: 1.5, // 1–2px toward book
        duration: 2,
      },
    },
    face: {
      smile: { duration: 6, opacity: [0.3, 0.45, 0.3] },
    },
    arms: {
      breathe: { y: [0, 0.8, 0], duration: 4 },
    },
  },

  // ── Book in girl's hands ────────────────────────────────────────
  book: {
    float: {
      duration: 4,
      y: [0, -2, 0],
      rotate: [-0.5, 0.5, -0.5],
    },
    pages: {
      micro: { duration: 3, y: [0, 0.8, 0] },
      rareLift: {
        interval: { min: 8000, max: 15000 },
        y: [0, -2, 0],
        duration: 1.2,
      },
    },
  },

  // ── Cat (secondary character) ───────────────────────────────────
  cat: {
    body: {
      breathing: { duration: 5, scaleY: [1, 1.01, 1] },
    },
    tail: {
      wag: { duration: 5.5, rotate: [-4, 5, -4] },
    },
    ears: {
      left: {
        rotate: [0, -2, 0],
        interval: { min: 8000, max: 15000 },
        duration: 0.4,
      },
      right: {
        rotate: [0, 2, 0],
        interval: { min: 9000, max: 16000 },
        duration: 0.4,
      },
    },
    eyes: {
      blink: {
        duration: 0.12,
        scaleY: [1, 0.05, 1],
        interval: { min: 4000, max: 8000 },
      },
    },
    head: {
      adjust: {
        x: [0, 2, 0],
        rotate: [-1, 1, 0],
        duration: 2,
        interval: { min: 8000, max: 15000 },
      },
    },
  },

  // ── Bookshelf ───────────────────────────────────────────────────
  bookshelf: {
    books: {
      book1: { duration: 7, y: [0, -2, 0] },
      book2: { duration: 8, rotate: [0, 1, 0] },
      book3: { duration: 6, opacity: [0.85, 1, 0.85] },
    },
  },

  // ── Plant ───────────────────────────────────────────────────────
  plant: {
    leafA: { duration: 5, rotate: [-2, 2, -2], delay: 0 },
    leafB: { duration: 5.5, rotate: [1, -2, 1], delay: 1.2 },
    leafC: { duration: 6, rotate: [-1, 1, -1], delay: 2.5 },
    leafD: { duration: 6.5, rotate: [1.5, -1.5, 1.5], delay: 3.8 },
  },

  // ── Clouds ──────────────────────────────────────────────────────
  clouds: {
    cloudA: { duration: 30, x: [-10, 10, -10], opacity: 0.5 },
    cloudB: { duration: 40, x: [-10, 10, -10], opacity: 0.4 },
    cloudC: { duration: 50, x: [-10, 10, -10], opacity: 0.3 },
  },

  // ── Floating books ──────────────────────────────────────────────
  floatingBooks: {
    bookA: { duration: 6, y: [0, -8, 0], rotate: [-2, 2, -2] },
    bookB: { duration: 8, x: [0, 6, 0], rotate: [-1.5, 1.5, -1.5] },
    bookC: {
      duration: 7,
      x: [0, 4, 0],
      y: [0, -5, 0],
      rotate: [-2, 1, -2],
    },
  },

  // ── Paper plane ─────────────────────────────────────────────────
  paperPlane: {
    duration: 10,
    x: [0, 12, 0],
    y: [0, -6, 0],
    rotate: [0, 4, 0],
  },

  // ── Sparkles ────────────────────────────────────────────────────
  sparkles: {
    pulse: { duration: 3, opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] },
    maxVisible: 5,
  },

  // ── Book icon (orange floating) ─────────────────────────────────
  bookIcon: {
    float: { duration: 5, y: [0, -5, 0], rotate: [-1, 1, -1] },
  },

  // ── Ambient light ───────────────────────────────────────────────
  light: {
    cycle: { duration: 15, opacity: [0.03, 0.08, 0.03] },
  },

  // ── Parallax (per-layer depth) ──────────────────────────────────
  parallax: {
    background: { sensitivity: 0.015, maxPx: 2 },
    environment: { sensitivity: 0.03, maxPx: 4 },
    girl: { sensitivity: 0.05, maxPx: 6 },
    cat: { sensitivity: 0.06, maxPx: 7 },
    foreground: { sensitivity: 0.08, maxPx: 10 },
  },

  // ── Entrance stagger (ms) ───────────────────────────────────────
  entrance: {
    background: 0,
    bookshelf: 100,
    environment: 200,
    girl: 300,
    cat: 400,
    floatingBooks: 500,
    sparkles: 650,
    totalDuration: 1400,
  },

  // ── Responsive ──────────────────────────────────────────────────
  responsive: {
    mobile: {
      keepAnimations: ['girl', 'cat', 'sparkles', 'clouds'],
      disableParallax: true,
    },
    tablet: {
      parallaxScale: 0.6,
    },
  },
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/** Convert readonly keyframe arrays to mutable for framer-motion */
export const kf = <T extends readonly number[]>(arr: T): number[] => [...arr] as number[];

/** Scale duration for device type */
export const getDuration = (base: number, device: DeviceType): number => {
  switch (device) {
    case 'mobile': return base * 1.5;
    case 'tablet': return base * 1.2;
    default: return base;
  }
};

/** Check if an animation type should run */
export const shouldAnimateType = (
  type: string,
  device: DeviceType,
  reducedMotion: boolean,
): boolean => {
  if (reducedMotion) return false;
  if (device === 'mobile') {
    return (motionConfig.responsive.mobile.keepAnimations as readonly string[]).includes(type);
  }
  return true;
};

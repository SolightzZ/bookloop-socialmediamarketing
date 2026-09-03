import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motionConfig, type DeviceType } from './motionConfig';

export interface AnimationState {
  prefersReducedMotion: boolean;
  deviceType: DeviceType;
  isHovered: boolean;
  isInView: boolean;
  hasEntered: boolean;
  mousePosition: { x: number; y: number };
}

/**
 * Animation state hook — handles reduced motion, device detection,
 * viewport intersection, mouse tracking, and blink timers.
 */
export const useAnimationState = () => {
  const [state, setState] = useState<AnimationState>({
    prefersReducedMotion: false,
    deviceType: 'desktop',
    isHovered: false,
    isInView: false,
    hasEntered: false,
    mousePosition: { x: 0, y: 0 },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const blinkTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ── Reduced motion ──────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setState((p) => ({ ...p, prefersReducedMotion: mq.matches }));
    const h = (e: MediaQueryListEvent) => setState((p) => ({ ...p, prefersReducedMotion: e.matches }));
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // ── Device type ─────────────────────────────────────────────────
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const dt: DeviceType = w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
      setState((p) => ({ ...p, deviceType: dt }));
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Intersection Observer ───────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState((p) => ({ ...p, isInView: true, hasEntered: true }));
        } else {
          setState((p) => ({ ...p, isInView: false }));
        }
      },
      { threshold: 0.15, rootMargin: '50px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Mouse parallax ──────────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.prefersReducedMotion || state.deviceType === 'mobile') return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setState((p) => ({ ...p, mousePosition: { x, y } }));
    },
    [state.prefersReducedMotion, state.deviceType],
  );

  // ── Hover ───────────────────────────────────────────────────────
  const isTouch = useMemo(
    () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    [],
  );

  const handleMouseEnter = useCallback(() => {
    if (!isTouch) setState((p) => ({ ...p, isHovered: true }));
  }, [isTouch]);

  const handleMouseLeave = useCallback(() => {
    setState((p) => ({ ...p, isHovered: false, mousePosition: { x: 0, y: 0 } }));
  }, []);

  // ── Blinking ────────────────────────────────────────────────────
  const setupBlinking = useCallback(
    (
      id: string,
      minMs: number,
      maxMs: number,
      onBlink: () => void,
    ): (() => void) => {
      if (state.prefersReducedMotion) return () => {};
      const rand = (min: number, max: number) => Math.random() * (max - min) + min;
      const loop = () => {
        onBlink();
        blinkTimers.current.set(id, setTimeout(loop, rand(minMs, maxMs)));
      };
      blinkTimers.current.set(id, setTimeout(loop, rand(minMs, maxMs)));
      return () => {
        const t = blinkTimers.current.get(id);
        if (t) { clearTimeout(t); blinkTimers.current.delete(id); }
      };
    },
    [state.prefersReducedMotion],
  );

  useEffect(() => {
    return () => {
      blinkTimers.current.forEach((t) => clearTimeout(t));
      blinkTimers.current.clear();
    };
  }, []);

  // ── Parallax offset ─────────────────────────────────────────────
  const getParallax = useCallback(
    (layer: 'background' | 'environment' | 'girl' | 'cat' | 'foreground') => {
      if (state.prefersReducedMotion || state.deviceType === 'mobile') return { x: 0, y: 0 };
      const cfg = motionConfig.parallax[layer];
      const scale = state.deviceType === 'tablet'
        ? (motionConfig.responsive.tablet.parallaxScale ?? 1)
        : 1;
      const intensity = state.isHovered ? 1 : 0.5;
      const sx = state.mousePosition.x * 100 * cfg.sensitivity * scale * intensity;
      const sy = state.mousePosition.y * 100 * cfg.sensitivity * scale * intensity;
      const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
      return { x: clamp(sx, cfg.maxPx), y: clamp(sy, cfg.maxPx) };
    },
    [state.prefersReducedMotion, state.deviceType, state.mousePosition, state.isHovered],
  );

  // ── Convenience ─────────────────────────────────────────────────
  const shouldAnimate = useCallback(
    (type: string): boolean => {
      if (state.prefersReducedMotion) return false;
      if (state.deviceType === 'mobile') {
        return (motionConfig.responsive.mobile.keepAnimations as readonly string[]).includes(type);
      }
      return true;
    },
    [state.prefersReducedMotion, state.deviceType],
  );

  const getDur = useCallback(
    (base: number): number => {
      switch (state.deviceType) {
        case 'mobile': return base * 1.5;
        case 'tablet': return base * 1.2;
        default: return base;
      }
    },
    [state.deviceType],
  );

  return {
    state,
    containerRef,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    getParallax,
    setupBlinking,
    shouldAnimate,
    getDur,
  };
};

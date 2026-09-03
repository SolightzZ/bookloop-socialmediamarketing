import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroIllustration } from './HeroIllustration';
import { AppContainer } from '../common/Container';

export interface HeroProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

/**
 * Hero — "Cozy Book Breeze" Premium Hero (hero-only boundary)
 *
 *  Boundary: position:relative + overflow:hidden — no bg leaks outside Hero.
 *  Background: 7 layers inside HeroBackground (ambient glow, gradient flow,
 *               clouds, book outlines, dust, sparkles, breathing light).
 *  Parallax: pointer-based, desktop only, spec 1-7px, spring-smoothed.
 *            Disabled on touch / (hover:none) / prefers-reduced-motion.
 *  Pause: IntersectionObserver pauses bg animations when Hero off-screen.
 */
export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const isTouchDevice = useRef(false);
  const isHeroVisible = useRef(true);

  const springConfig = { stiffness: 0.04, damping: 0.88 };

  // Spec parallax: BG 1-2px, Glow 2-3px, Clouds 3-4px, Books 3-5px, Dust 5-7px
  // Girl/Cat move via HeroIllustration's own parallax (≤2px), not here.
  const parallaxMultipliers: Record<string, number> = {
    glow: 2.5,
    cloud: 3.5,
    book: 4,
    dust: 6,
  };

  const updateParallax = useCallback(() => {
    if (isTouchDevice.current || !isHeroVisible.current) {
      animationFrame.current = requestAnimationFrame(updateParallax);
      return;
    }

    const dx = mousePos.current.x - currentPos.current.x;
    const dy = mousePos.current.y - currentPos.current.y;
    currentPos.current.x += dx * springConfig.stiffness;
    currentPos.current.y += dy * springConfig.stiffness;

    const els = heroRef.current?.querySelectorAll<HTMLElement>('[data-parallax]');
    els?.forEach((el) => {
      const key = el.getAttribute('data-parallax') || 'glow';
      const mul = parallaxMultipliers[key] ?? 2;
      const ox = (currentPos.current.x - 0.5) * mul;
      const oy = (currentPos.current.y - 0.5) * mul;
      el.style.setProperty('--parallax-x', `${ox}px`);
      el.style.setProperty('--parallax-y', `${oy}px`);
      // Combine with CSS animation transform via extra wrapper would be ideal;
      // we use translate on a CSS variable so keyframe animations (which also
      // set transform) are not clobbered — consume via filter in CSS if needed.
      // For now use direct translate3d but preserve via translate layer:
      // Apply as additional translate that stacks with animation's transform.
      el.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
    });

    animationFrame.current = requestAnimationFrame(updateParallax);
  }, []);

  useEffect(() => {
    const checkTouch = () => {
      isTouchDevice.current =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(hover: none)').matches;
    };
    checkTouch();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isTouchDevice.current = true;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice.current || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mousePos.current.x = (e.clientX - rect.left) / rect.width;
      mousePos.current.y = (e.clientY - rect.top) / rect.height;
    };

    // Pause expensive bg animations when Hero leaves viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroVisible.current = entry.isIntersecting;
        if (heroRef.current) {
          heroRef.current.classList.toggle('hero-paused', !entry.isIntersecting);
        }
      },
      { threshold: 0.05 },
    );
    if (heroRef.current) observer.observe(heroRef.current);

    if (!isTouchDevice.current) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      animationFrame.current = requestAnimationFrame(updateParallax);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [updateParallax]);

  return (
    <Box
      ref={heroRef}
      component="section"
      id="hero"
      aria-label="BookLoop Hero Section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#F7FAFC',
        minHeight: { xs: 'auto', md: 620, lg: 660 },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 5, sm: 6, md: 8, lg: 9 },
      }}
    >
      {/* Hero-only background — absolute inset-0, pointer-events none, z-0 */}
      <HeroBackground />

      <AppContainer sx={{ position: 'relative', zIndex: 10 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '48% 52%' },
            alignItems: 'center',
            gap: { xs: 3, sm: 4, md: 2, lg: 3 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 10 }}>
            <HeroContent
              searchQuery={searchQuery}
              onSearchQueryChange={onSearchQueryChange}
              onSearchSubmit={onSearchSubmit}
            />
          </Box>

          <Box
            sx={{
              position: 'relative',
              zIndex: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              overflow: 'visible',
            }}
          >
            <HeroIllustration />
          </Box>
        </Box>
      </AppContainer>
    </Box>
  );
};

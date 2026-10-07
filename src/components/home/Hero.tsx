import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroIllustration } from './HeroIllustration';
import { AppContainer } from '../common/Container';

// Spec parallax: BG 1-2px, Glow 2-3px, Clouds 3-4px, Books 3-5px, Dust 5-7px
// Girl/Cat move via HeroIllustration's own parallax (≤2px), not here.
// โมดูลคงที่ — ไม่สร้าง object ใหม่ทุก render
const PARALLAX_MULTIPLIERS: Record<string, number> = {
   glow: 2.5,
   cloud: 3.5,
   book: 4,
   dust: 6,
};

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
export const Hero: React.FC<HeroProps> = ({ searchQuery, onSearchQueryChange, onSearchSubmit }) => {
   const heroRef = useRef<HTMLDivElement>(null);
   const mousePos = useRef({ x: 0.5, y: 0.5 });
   const currentPos = useRef({ x: 0.5, y: 0.5 });
   const animationFrame = useRef<number | null>(null);
   const isTouchDevice = useRef(false);
   const isHeroVisible = useRef(true);
   const isAnimating = useRef(false);
   const cachedEls = useRef<{ el: HTMLElement; mul: number }[] | null>(null);
   const heroRect = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

   const springConfig = { stiffness: 0.04, damping: 0.88 };

   const updateParallax = useCallback(() => {
      if (isTouchDevice.current || !isHeroVisible.current) {
         isAnimating.current = false;
         return;
      }

      const dx = mousePos.current.x - currentPos.current.x;
      const dy = mousePos.current.y - currentPos.current.y;

      // Settle threshold: sleep when stationary to prevent layout thrashing & CPU burn
      if (Math.abs(dx) < 0.0004 && Math.abs(dy) < 0.0004) {
         isAnimating.current = false;
         return;
      }

      currentPos.current.x += dx * springConfig.stiffness;
      currentPos.current.y += dy * springConfig.stiffness;

      if (!cachedEls.current && heroRef.current) {
         const nodeList = heroRef.current.querySelectorAll<HTMLElement>('[data-parallax]');
         cachedEls.current = Array.from(nodeList).map((el) => {
            const key = el.getAttribute('data-parallax') || 'glow';
            return { el, mul: PARALLAX_MULTIPLIERS[key] ?? 2 };
         });
      }

      const items = cachedEls.current;
      if (items) {
         const px = currentPos.current.x - 0.5;
         const py = currentPos.current.y - 0.5;
         for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // ข้ามโหนดที่ CSS ซ่อนไว้ (mobile/tablet display:none) — ประหยัด CPU โดยไม่แตะ DOM
            if (item.el.offsetParent === null) continue;
            const ox = px * item.mul;
            const oy = py * item.mul;
            item.el.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`;
         }
      }

      animationFrame.current = requestAnimationFrame(updateParallax);
   }, []);

   useEffect(() => {
      const checkTouch = () => {
         isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
      };
      checkTouch();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
         isTouchDevice.current = true;
      }

      const updateHeroRect = () => {
         if (heroRef.current) {
            const r = heroRef.current.getBoundingClientRect();
            heroRect.current = {
               left: r.left,
               top: r.top,
               width: r.width || 1,
               height: r.height || 1,
            };
         }
      };
      updateHeroRect();

      const handleMouseMove = (e: MouseEvent) => {
         if (isTouchDevice.current || !isHeroVisible.current) return;
         let rect = heroRect.current;
         if (!rect) {
            updateHeroRect();
            rect = heroRect.current;
         }
         if (!rect) return;
         mousePos.current.x = (e.clientX - rect.left) / rect.width;
         mousePos.current.y = (e.clientY - rect.top) / rect.height;

         // Wake up animation loop on pointer movement
         if (!isAnimating.current) {
            isAnimating.current = true;
            animationFrame.current = requestAnimationFrame(updateParallax);
         }
      };

      const handleScrollOrResize = () => {
         updateHeroRect();
      };

      // Pause expensive bg animations when Hero leaves viewport
      const observer = new IntersectionObserver(
         ([entry]) => {
            isHeroVisible.current = entry.isIntersecting;
            if (heroRef.current) {
               heroRef.current.classList.toggle('hero-paused', !entry.isIntersecting);
            }
            if (!entry.isIntersecting) {
               if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
               isAnimating.current = false;
            } else if (!isAnimating.current && !isTouchDevice.current) {
               updateHeroRect();
               isAnimating.current = true;
               animationFrame.current = requestAnimationFrame(updateParallax);
            }
         },
         { threshold: 0.05 },
      );
      if (heroRef.current) observer.observe(heroRef.current);

      if (!isTouchDevice.current) {
         window.addEventListener('mousemove', handleMouseMove, { passive: true });
         window.addEventListener('resize', handleScrollOrResize, { passive: true });
         window.addEventListener('scroll', handleScrollOrResize, { passive: true });
         isAnimating.current = true;
         animationFrame.current = requestAnimationFrame(updateParallax);
      }

      return () => {
         window.removeEventListener('mousemove', handleMouseMove);
         window.removeEventListener('resize', handleScrollOrResize);
         window.removeEventListener('scroll', handleScrollOrResize);
         observer.disconnect();
         if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
         isAnimating.current = false;
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
            minHeight: 'auto',
            display: 'flex',
            alignItems: 'center',
            pt: { xs: 9, sm: 10, md: 11.5, lg: 13 },
            pb: { xs: 4, sm: 4.5, md: 5 },
         }}>
         {/* Hero-only background — absolute inset-0, pointer-events none, z-0 */}
         <HeroBackground />

         <AppContainer sx={{ position: 'relative', zIndex: 10 }}>
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                     xs: '1fr',
                     md: '54% 46%',
                     lg: '48% 52%',
                  },
                  alignItems: 'center',
                  gap: { xs: 3, sm: 2.5, md: 3, lg: 4 },
               }}>
               <Box sx={{ position: 'relative', zIndex: 10 }}>
                  <HeroContent searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} onSearchSubmit={onSearchSubmit} />
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
                  }}>
                  <HeroIllustration />
               </Box>
            </Box>
         </AppContainer>
      </Box>
   );
};

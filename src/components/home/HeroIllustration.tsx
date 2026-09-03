import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Box } from '@mui/material';
import { useAnimationState } from './HeroIllustration/useAnimationState';
import { motionConfig } from './HeroIllustration/motionConfig';
import { Background } from './HeroIllustration/Background';
import { Bookshelf } from './HeroIllustration/Bookshelf';
import { Plant } from './HeroIllustration/Plant';
import { Character } from './HeroIllustration/Character';
import { Cat } from './HeroIllustration/Cat';
import { FloatingBooks } from './HeroIllustration/FloatingBooks';
import { Sparkles } from './HeroIllustration/Sparkles';

/**
 * HeroIllustration — Premium Layered 2D Animated Bookstore Scene
 *
 * 10 animation layers with independent motion:
 *  1. Background (sky, window, clouds, floor, light)
 *  2. Bookshelf (micro book animations)
 *  3. Plant (breeze-affected leaves)
 *  4–6. Girl (body, head, hair, eyes, arms, book)
 *  7. Cat (body, tail, ears, eyes, head)
 *  8. Floating books + paper plane + book icon
 *  9. Sparkles + particles
 * 10. Mouse parallax, hover interaction, entrance stagger
 */
export const HeroIllustration: React.FC = () => {
  const {
    state, containerRef,
    handleMouseMove, handleMouseEnter, handleMouseLeave,
    getParallax, setupBlinking, shouldAnimate, getDur,
  } = useAnimationState();

  const prefersReducedMotion = useReducedMotion() ?? state.prefersReducedMotion;
  const entrance = motionConfig.entrance;

  // ── Entrance variants ────────────────────────────────────────────
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  }), []);

  const makeLayerVariant = useMemo(() => (delayMs: number) => ({
    hidden: { opacity: 0, scale: 0.97, y: 6 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: {
        duration: 0.5,
        delay: delayMs / 1000,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      },
    },
  }), []);

  // ── Parallax offsets ─────────────────────────────────────────────
  const bgPar = getParallax('background');
  const envPar = getParallax('environment');
  const girlPar = getParallax('girl');
  const catPar = getParallax('cat');
  const fgPar = getParallax('foreground');

  // ── Animation toggles ───────────────────────────────────────────
  const aBg = shouldAnimate('clouds');
  const aBk = shouldAnimate('bookshelf');
  const aPl = shouldAnimate('plant');
  const aGrl = shouldAnimate('girl');
  const aCat = shouldAnimate('cat');
  const aFb = shouldAnimate('sparkles');
  const aSp = shouldAnimate('sparkles');

  return (
    <Box
      ref={containerRef}
      id="bookloop-hero-illustration"
      role="img"
      aria-label="Animated 2D illustration of a cozy BookLoop bookstore scene — a girl reading with a cat"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: 400, sm: 520, md: 600, lg: 660 },
        mx: 'auto',
        transform: { xs: 'none', md: 'scale(1.08)', lg: 'scale(1.15)' },
        transformOrigin: 'center center',
        userSelect: 'none',
        cursor: 'default',
      }}
    >
      {/* Soft edge fade */}
      <Box
        sx={{
          position: 'absolute', inset: 0, borderRadius: '16px', zIndex: 10, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(247,250,252,0.4) 80%, rgba(247,250,252,1) 100%)',
        }}
      />

      {/* SVG Scene */}
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        animate={state.hasEntered ? 'visible' : 'hidden'}
        style={{ width: '100%', overflow: 'visible', aspectRatio: '5 / 4' }}
      >
        <svg viewBox="0 0 520 440" xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
          aria-hidden="true"
        >
          {/* Layer 1: Background */}
          <motion.g variants={makeLayerVariant(entrance.background)}
            style={{ transform: `translate(${bgPar.x}px, ${bgPar.y}px)` }}
          >
            <Background shouldAnimate={aBg} getDur={getDur} />
          </motion.g>

          {/* Layer 2: Bookshelf */}
          <motion.g variants={makeLayerVariant(entrance.bookshelf)}
            style={{ transform: `translate(${bgPar.x}px, ${bgPar.y}px)` }}
          >
            <Bookshelf shouldAnimate={aBk} getDur={getDur} />
          </motion.g>

          {/* Layer 3: Plant */}
          <motion.g variants={makeLayerVariant(entrance.environment)}
            style={{ transform: `translate(${envPar.x}px, ${envPar.y}px)` }}
          >
            <Plant shouldAnimate={aPl} getDur={getDur} />
          </motion.g>

          {/* Layer 4–6: Girl */}
          <motion.g variants={makeLayerVariant(entrance.girl)}
            style={{ transform: `translate(${girlPar.x}px, ${girlPar.y}px)` }}
          >
            <Character shouldAnimate={aGrl} getDur={getDur} setupBlinking={setupBlinking} />
          </motion.g>

          {/* Layer 7: Cat */}
          <motion.g variants={makeLayerVariant(entrance.cat)}
            style={{ transform: `translate(${catPar.x}px, ${catPar.y}px)` }}
          >
            <Cat shouldAnimate={aCat} getDur={getDur} setupBlinking={setupBlinking} />
          </motion.g>

          {/* Layer 8: Floating books */}
          <motion.g variants={makeLayerVariant(entrance.floatingBooks)}
            style={{ transform: `translate(${fgPar.x}px, ${fgPar.y}px)` }}
          >
            <FloatingBooks shouldAnimate={aFb} getDur={getDur} />
          </motion.g>

          {/* Layer 9: Sparkles */}
          <motion.g variants={makeLayerVariant(entrance.sparkles)}
            style={{ transform: `translate(${fgPar.x}px, ${fgPar.y}px)` }}
          >
            <Sparkles shouldAnimate={aSp} getDur={getDur} isHovered={state.isHovered} />
          </motion.g>
        </svg>
      </motion.div>
    </Box>
  );
};

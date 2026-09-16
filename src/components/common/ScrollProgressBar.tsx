import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

/**
 * ScrollProgressBar (Scroll-linked progress bar from motion.dev)
 * Elegant, ultra-thin reading/browsing indicator fixed at the very top of the page.
 */
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#1976D2] via-[#60A5FA] to-[#F59E0B] origin-left z-[1301] pointer-events-none"
    />
  );
};

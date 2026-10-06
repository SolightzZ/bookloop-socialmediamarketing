import React, { useCallback, useEffect, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import { KeyboardArrowUp as ArrowUpIcon } from '@mui/icons-material';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface ScrollToTopProps {
   /** Scroll distance in px before the button appears. */
   threshold?: number;
   /** Accessible label + tooltip (Thai by default). */
   label?: string;
}

const DEFAULT_THRESHOLD = 480;

/**
 * ScrollToTop — editorial-minimal back-to-top control.
 *
 * Rest: crisp white disc, hairline border, ink-navy arrow (brand blue is
 * reserved for the interactive moment per the Ten Percent Rule).
 * Hover: blue fill, -2px lift, ink-navy ambient shadow.
 * Active: deep ink navy. Keyboard: native button + themed focus ring.
 */
export const ScrollToTop: React.FC<ScrollToTopProps> = ({ threshold = DEFAULT_THRESHOLD, label = 'กลับขึ้นด้านบน' }) => {
   const [visible, setVisible] = useState(false);
   const reduceMotion = useReducedMotion();

   useEffect(() => {
      let raf = 0;
      const onScroll = () => {
         cancelAnimationFrame(raf);
         raf = requestAnimationFrame(() => {
            setVisible(window.scrollY > threshold);
         });
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
         cancelAnimationFrame(raf);
         window.removeEventListener('scroll', onScroll);
      };
   }, [threshold]);

   const handleClick = useCallback(() => {
      window.scrollTo({
         top: 0,
         left: 0,
         behavior: reduceMotion ? 'auto' : 'smooth',
      });
   }, [reduceMotion]);

   return (
      <AnimatePresence>
         {visible && (
            <motion.div
               initial={{ opacity: 0, y: 10, scale: 0.92 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 10, scale: 0.92 }}
               transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
               className="scroll-to-top-anchor fixed right-8 bottom-8 z-[1200] hidden lg:block">
               <Tooltip title={label} placement="left" arrow>
                  <Box
                     component="button"
                     type="button"
                     onClick={handleClick}
                     aria-label={label}
                     sx={{
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '9999px',
                        bgcolor: '#FFFFFF',
                        color: '#0F2D4A',
                        border: '1px solid #E5EAF0',
                        cursor: 'pointer',
                        p: 0,
                        transition: 'background-color 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
                        '&:hover': {
                           bgcolor: '#1976D2',
                           borderColor: '#1976D2',
                           color: '#FFFFFF',
                           transform: 'translateY(-2px)',
                           boxShadow: '0 8px 20px rgba(15, 47, 82, 0.16)',
                        },
                        '&:active': {
                           bgcolor: '#0F2D4A',
                           borderColor: '#0F2D4A',
                           color: '#FFFFFF',
                           transform: 'translateY(0)',
                           boxShadow: '0 1px 3px rgba(15, 47, 82, 0.12)',
                        },
                        '&:focus-visible': {
                           outline: '2px solid #1976D2',
                           outlineOffset: 3,
                        },
                     }}>
                     <ArrowUpIcon sx={{ fontSize: 22 }} />
                  </Box>
               </Tooltip>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

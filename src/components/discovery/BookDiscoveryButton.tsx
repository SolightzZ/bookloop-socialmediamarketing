import React from 'react';
import { CircularProgress } from '@mui/material';
import { AutoAwesomeRounded, RefreshRounded } from '@mui/icons-material';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BookDiscoveryButtonProps } from './bookDiscovery.types';

export const BookDiscoveryButton: React.FC<BookDiscoveryButtonProps> = ({ state, onClick, disabled = false, hasRandomizedOnce = false, onMouseEnter, onMouseLeave, className = '' }) => {
   const shouldReduceMotion = useReducedMotion();

   const isRunning = state === 'starting' || state === 'shuffling' || state === 'slowing' || state === 'fake-stop' || state === 'revealing';

   const isDisabled = disabled || isRunning;

   let labelKey = 'idle';
   let labelText = hasRandomizedOnce || state === 'result' ? 'สุ่มอีกครั้ง' : 'สุ่มหนังสือให้ฉัน';
   let icon = <AutoAwesomeRounded sx={{ fontSize: 20 }} />;

   if (isRunning) {
      labelKey = 'running';
      labelText = 'กำลังเลือกหนังสือให้คุณ...';
      icon = <CircularProgress size={18} color="inherit" thickness={4} />;
   } else if (hasRandomizedOnce || state === 'result') {
      labelKey = 'result';
      labelText = 'สุ่มอีกครั้ง';
      icon = <RefreshRounded sx={{ fontSize: 20 }} />;
   }

   return (
      <motion.button
         type="button"
         onClick={onClick}
         disabled={isDisabled}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         whileHover={!isDisabled && !shouldReduceMotion ? { scale: 1.018, y: -1 } : undefined}
         whileTap={!isDisabled && !shouldReduceMotion ? { scale: 0.985, y: 0 } : undefined}
         transition={{ type: 'spring', stiffness: 450, damping: 26 }}
         aria-label={isRunning ? 'กำลังค้นหาและสุ่มหนังสือ' : labelText}
         aria-busy={isRunning}
         aria-disabled={isDisabled}
         className={`relative flex items-center justify-center gap-2.5 w-full sm:w-[230px] h-[48px] rounded-xl text-[0.95rem] font-bold text-white outline-none select-none cursor-pointer transition-all ${
            isDisabled
               ? 'bg-[#EAF4FF] border border-[#DCEEFF] text-[#94A3B8] cursor-not-allowed shadow-none'
               : 'bg-[#1677E8] hover:bg-[#1264C4] active:bg-[#0E51A0] border border-[#1677E8] text-white shadow-none hover:shadow-none'
         } ${className}`}>
         {/* SVG Icon */}
         <span className="relative z-10 flex items-center justify-center">{icon}</span>

         {/* Rolling text animation (100% clean Thai text, zero emojis) */}
         <div className="relative z-10 h-5 overflow-hidden flex items-center">
            <AnimatePresence mode="popLayout" initial={false}>
               <motion.span
                  key={labelKey}
                  initial={shouldReduceMotion ? { opacity: 0 } : { y: 16, opacity: 0 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { y: -16, opacity: 0 }}
                  transition={shouldReduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 26 }}
                  className="block whitespace-nowrap font-sans font-bold">
                  {labelText}
               </motion.span>
            </AnimatePresence>
         </div>
      </motion.button>
   );
};

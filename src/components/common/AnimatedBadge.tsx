import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimatedBadgeProps {
  count: number;
  max?: number;
  color?: 'primary' | 'error';
  className?: string;
  children: React.ReactNode;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  count,
  max = 99,
  color = 'primary',
  className = '',
  children,
}) => {
  const displayCount = count > max ? `${max}+` : count;
  const showBadge = count > 0;

  const bgClasses =
    color === 'error'
      ? 'bg-[#E11D48] text-white'
      : 'bg-[#1976D2] text-white';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {children}

      <AnimatePresence>
        {showBadge && (
          <motion.div
            key="badge-container"
            className="absolute -top-1 -right-1.5 pointer-events-none z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            {/* Ripple Pulse on count update */}
            <motion.span
              key={`ripple-${count}`}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`absolute inset-0 rounded-full ${bgClasses} opacity-60`}
            />

            {/* Badge Pill with pop scale animation */}
            <motion.span
              key={`count-${count}`}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className={`relative flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold rounded-full shadow-sm leading-none select-none ${bgClasses}`}
            >
              {displayCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

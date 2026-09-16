import React from 'react';
import { CircularProgress } from '@mui/material';
import { CasinoRounded, RefreshRounded } from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { BookDiscoveryButtonProps } from './bookDiscovery.types';

export const BookDiscoveryButton: React.FC<BookDiscoveryButtonProps> = ({
  state,
  onClick,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
  className = '',
}) => {
  const isRunning =
    state === 'starting' ||
    state === 'shuffling' ||
    state === 'slowing' ||
    state === 'fake-stop' ||
    state === 'revealing';

  const isDisabled = disabled || isRunning;

  let labelKey = 'idle';
  let labelText = 'สุ่มหนังสือให้ฉัน';
  let icon = <CasinoRounded sx={{ fontSize: 20 }} />;

  if (isRunning) {
    labelKey = 'running';
    labelText = 'กำลังสุ่มในวงโคจร...';
    icon = <CircularProgress size={17} color="inherit" thickness={4} />;
  } else if (state === 'result') {
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
      whileHover={!isDisabled ? { scale: 1.03, y: -2 } : undefined}
      whileTap={!isDisabled ? { scale: 0.96, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 450, damping: 24 }}
      aria-label={isRunning ? 'กำลังค้นหาและสุ่มหนังสือ' : labelText}
      aria-busy={isRunning}
      aria-disabled={isDisabled}
      className={`relative flex items-center justify-center gap-2 w-full sm:w-[215px] h-[46px] rounded-full text-[0.95rem] font-bold text-white outline-none select-none cursor-pointer transition-colors shadow-md overflow-hidden ${
        isDisabled
          ? 'bg-slate-400 opacity-80 cursor-not-allowed shadow-none'
          : state === 'result'
          ? 'bg-[#0F2D4A] hover:bg-[#1E3A5F] shadow-[0_4px_14px_rgba(15,45,74,0.25)]'
          : 'bg-[#1976D2] hover:bg-[#1565C0] shadow-[0_4px_16px_rgba(25,118,210,0.3)]'
      } ${className}`}
    >
      {/* Subtle background light sweep / shimmer when not running */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: 'linear',
            repeatDelay: 1.2,
          }}
        />
      )}

      {/* Icon with spin reaction */}
      <span className="relative z-10 flex items-center justify-center">
        {icon}
      </span>

      {/* Rolling text animation */}
      <div className="relative z-10 h-5 overflow-hidden flex items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={labelKey}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="block whitespace-nowrap"
          >
            {labelText}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

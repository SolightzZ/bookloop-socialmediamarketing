import React, { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'motion/react';
import { formatCurrency } from '../../utils/formatCurrency';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  isCurrency?: boolean;
}

/**
 * AnimatedCounter (Number counter from motion.dev)
 * Smooth spring-interpolated counter for prices, stats, and totals.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  className = '',
  isCurrency = true,
}) => {
  const motionVal = useMotionValue(value);
  const springVal = useSpring(motionVal, {
    stiffness: 120,
    damping: 24,
    mass: 0.8,
  });

  const displayVal = useTransform(springVal, (current) => {
    const rounded = Math.round(current);
    return isCurrency ? formatCurrency(rounded) : rounded.toLocaleString('th-TH');
  });

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return <motion.span className={className}>{displayVal}</motion.span>;
};

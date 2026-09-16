import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { formatCurrency } from '../../utils/formatCurrency';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  isCurrency?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  className = '',
  isCurrency = true,
}) => {
  const spring = useSpring(value, {
    stiffness: 120,
    damping: 18,
    mass: 0.8,
  });

  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {isCurrency ? formatCurrency(displayValue) : displayValue}
    </motion.span>
  );
};

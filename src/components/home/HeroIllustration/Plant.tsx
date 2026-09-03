import React from 'react';
import { motion } from 'motion/react';
import { motionConfig } from './motionConfig';

interface LeafProps {
  x: number; y: number; width: number; height: number;
  rotation: number; duration: number; delay: number; color: string;
}

const Leaf: React.FC<LeafProps> = ({ x, y, width, height, rotation, duration, delay, color }) => (
  <motion.g
    style={{ transformOrigin: `${x}px ${y + height}px` }}
    animate={{ rotate: [0, rotation, 0], y: [0, -1.2, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path
      d={`M ${x} ${y + height} Q ${x - width * 0.5} ${y + height * 0.45} ${x} ${y} Q ${x + width * 0.5} ${y + height * 0.45} ${x} ${y + height}`}
      fill={color} opacity={0.88}
    />
    <line x1={x} y1={y + 2} x2={x} y2={y + height - 2} stroke={color} strokeWidth={0.8} opacity={0.35} />
  </motion.g>
);

interface PlantProps {
  shouldAnimate: boolean;
  getDur: (base: number) => number;
}

export const Plant: React.FC<PlantProps> = ({ shouldAnimate, getDur }) => {
  const p = motionConfig.plant;
  return (
    <g id="hero-layer-plant">
      <path d="M 370 322 L 358 372 L 412 372 L 400 322 Z" fill="#B8733A" opacity={0.9} />
      <rect x="356" y="318" width="56" height="6" rx="3" fill="#C4956A" />
      <ellipse cx="385" cy="320" rx="18" ry="5" fill="#6D4C2A" opacity={0.7} />
      <line x1="385" y1="320" x2="385" y2="252" stroke="#5B8C5A" strokeWidth="2.5" opacity={0.7} />

      <Leaf x={372} y={252} width={22} height={55} rotation={p.leafA.rotate[1] as number} duration={getDur(p.leafA.duration)} delay={p.leafA.delay} color="#4A7C59" />
      <Leaf x={398} y={258} width={20} height={50} rotation={p.leafB.rotate[1] as number} duration={getDur(p.leafB.duration)} delay={p.leafB.delay} color="#5B8C5A" />
      <Leaf x={360} y={278} width={16} height={38} rotation={p.leafC.rotate[1] as number} duration={getDur(p.leafC.duration)} delay={p.leafC.delay} color="#4A7C59" />
      <Leaf x={410} y={282} width={18} height={34} rotation={p.leafD.rotate[1] as number} duration={getDur(p.leafD.duration)} delay={p.leafD.delay} color="#5B8C5A" />
    </g>
  );
};

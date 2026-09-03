import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { motionConfig, kf } from './motionConfig';

interface CatProps {
  shouldAnimate: boolean;
  getDur: (base: number) => number;
  setupBlinking: (id: string, min: number, max: number, onBlink: () => void) => () => void;
}

export const Cat: React.FC<CatProps> = ({ shouldAnimate, getDur, setupBlinking }) => {
  const [blink, setBlink] = useState(false);
  const [earLeftActive, setEarLeftActive] = useState(false);
  const [earRightActive, setEarRightActive] = useState(false);
  const [headActive, setHeadActive] = useState(false);
  const [glancingAtGirl, setGlancingAtGirl] = useState(false);

  const startBlink = useCallback(() => setBlink(true), []);
  const endBlink = useCallback(() => setBlink(false), []);

  // Eye blink
  useEffect(() => {
    if (!shouldAnimate) return;
    const { blink: b } = motionConfig.cat.eyes;
    return setupBlinking('cat-eyes', b.interval.min, b.interval.max, () => {
      startBlink();
      setTimeout(endBlink, b.duration * 1000);
    });
  }, [shouldAnimate, setupBlinking, startBlink, endBlink]);

  // Left ear twitch
  useEffect(() => {
    if (!shouldAnimate) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const { min, max } = motionConfig.cat.ears.left.interval;
      t = setTimeout(() => {
        setEarLeftActive(true);
        setTimeout(() => setEarLeftActive(false), motionConfig.cat.ears.left.duration * 1000);
        schedule();
      }, Math.random() * (max - min) + min);
    };
    schedule();
    return () => clearTimeout(t);
  }, [shouldAnimate]);

  // Right ear twitch
  useEffect(() => {
    if (!shouldAnimate) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const { min, max } = motionConfig.cat.ears.right.interval;
      t = setTimeout(() => {
        setEarRightActive(true);
        setTimeout(() => setEarRightActive(false), motionConfig.cat.ears.right.duration * 1000);
        schedule();
      }, Math.random() * (max - min) + min);
    };
    schedule();
    return () => clearTimeout(t);
  }, [shouldAnimate]);

  // Head adjustment
  useEffect(() => {
    if (!shouldAnimate) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const { min, max } = motionConfig.cat.head.adjust.interval;
      t = setTimeout(() => {
        setHeadActive(true);
        setTimeout(() => setHeadActive(false), motionConfig.cat.head.adjust.duration * 1000);
        schedule();
      }, Math.random() * (max - min) + min);
    };
    schedule();
    return () => clearTimeout(t);
  }, [shouldAnimate]);

  // Glance toward girl (occasional)
  useEffect(() => {
    if (!shouldAnimate) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const interval = 10000 + Math.random() * 12000; // 10–22 sec
      t = setTimeout(() => {
        setGlancingAtGirl(true);
        setTimeout(() => setGlancingAtGirl(false), 2500 + Math.random() * 1500);
        schedule();
      }, interval);
    };
    schedule();
    return () => clearTimeout(t);
  }, [shouldAnimate]);

  const c = motionConfig.cat;

  return (
    <g id="hero-layer-cat">
      {/* ── Cat body group (breathing) ── */}
      <motion.g
        style={{ transformOrigin: '442px 358px' }}
        animate={shouldAnimate ? { scaleY: kf(c.body.breathing.scaleY) } : undefined}
        transition={shouldAnimate ? { duration: getDur(c.body.breathing.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        {/* Soft shadow under cat */}
        <ellipse cx="442" cy="370" rx="38" ry="4" fill="#000" opacity={0.05} />

        {/* Tail (behind body) */}
        <motion.g
          style={{ transformOrigin: '408px 358px' }}
          animate={shouldAnimate ? { rotate: kf(c.tail.wag.rotate) } : undefined}
          transition={shouldAnimate ? { duration: getDur(c.tail.wag.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <path d="M 408 358 Q 395 348 390 358 Q 385 370 392 380"
            fill="none" stroke="#E8985A" strokeWidth="7" strokeLinecap="round" />
          <circle cx="392" cy="380" r="4.5" fill="#D4823A" opacity={0.8} />
          {/* Tail tip detail */}
          <circle cx="392" cy="380" r="2.5" fill="#C07028" opacity={0.5} />
        </motion.g>

        {/* Cat body — round, fluffy */}
        <ellipse cx="442" cy="355" rx="38" ry="20" fill="#E8985A" />
        {/* Belly lighter patch */}
        <ellipse cx="442" cy="359" rx="28" ry="12" fill="#F0B87A" opacity={0.5} />
        {/* Fur texture stripes */}
        <path d="M 422 348 Q 432 342 442 348" fill="none" stroke="#D4823A" strokeWidth="1.2" opacity={0.3} />
        <path d="M 432 351 Q 442 345 452 351" fill="none" stroke="#D4823A" strokeWidth="1.2" opacity={0.3} />
        <path d="M 442 349 Q 452 343 462 349" fill="none" stroke="#D4823A" strokeWidth="1.2" opacity={0.3} />

        {/* Paws */}
        <ellipse cx="462" cy="362" rx="9" ry="5.5" fill="#F0B87A" />
        <ellipse cx="455" cy="363" rx="6" ry="4" fill="#F0B87A" opacity={0.75} />
        {/* Paw pads */}
        <circle cx="460" cy="363" r="1.5" fill="#E8A070" opacity={0.4} />
        <circle cx="455" cy="364" r="1.2" fill="#E8A070" opacity={0.4} />

        {/* ── Cat head ── */}
        <motion.g
          style={{ transformOrigin: '468px 336px' }}
          animate={shouldAnimate && headActive
            ? { x: kf(c.head.adjust.x), rotate: kf(c.head.adjust.rotate) }
            : shouldAnimate && glancingAtGirl
              ? { x: [-3, -3, 0], rotate: [-4, -4, 0] }
              : undefined}
          transition={shouldAnimate
            ? { duration: glancingAtGirl ? 2 : getDur(c.head.adjust.duration), ease: 'easeInOut', repeat: glancingAtGirl ? 0 : 0 }
            : undefined}
        >
          {/* Head base */}
          <circle cx="472" cy="334" r="18" fill="#E8985A" />
          {/* Face lighter area */}
          <ellipse cx="472" cy="337" rx="14" ry="13" fill="#F0B87A" opacity={0.45} />

          {/* Left ear */}
          <motion.g
            style={{ transformOrigin: '460px 322px' }}
            animate={shouldAnimate && earLeftActive ? { rotate: kf(c.ears.left.rotate) } : undefined}
            transition={shouldAnimate ? { duration: getDur(c.ears.left.duration), ease: 'easeInOut' } : undefined}
          >
            <polygon points="457,322 451,304 467,320" fill="#E8985A" />
            <polygon points="458,322 453,309 465,321" fill="#F5C0A0" />
            {/* Inner ear */}
            <polygon points="459,320 455,312 464,319" fill="#F0A080" opacity={0.5} />
          </motion.g>

          {/* Right ear */}
          <motion.g
            style={{ transformOrigin: '484px 322px' }}
            animate={shouldAnimate && earRightActive ? { rotate: kf(c.ears.right.rotate) } : undefined}
            transition={shouldAnimate ? { duration: getDur(c.ears.right.duration), ease: 'easeInOut' } : undefined}
          >
            <polygon points="483,322 478,304 492,320" fill="#E8985A" />
            <polygon points="482,322 480,309 490,321" fill="#F5C0A0" />
            <polygon points="482,320 480,312 488,319" fill="#F0A080" opacity={0.5} />
          </motion.g>

          {/* Eyes */}
          <g>
            {/* Eye whites */}
            <ellipse cx="464" cy="334" rx="4.5" ry="4" fill="white" />
            <ellipse cx="480" cy="334" rx="4.5" ry="4" fill="white" />
            {/* Pupils — shift direction when glancing at girl */}
            <ellipse cx={glancingAtGirl ? 461 : 465} cy="334" rx="3" ry={blink ? 0.4 : 3} fill="#2D1B0E" />
            <ellipse cx={glancingAtGirl ? 477 : 481} cy="334" rx="3" ry={blink ? 0.4 : 3} fill="#2D1B0E" />
            {!blink && (<>
              <circle cx={glancingAtGirl ? 462.5 : 466.5} cy="332.5" r="1" fill="white" opacity={0.75} />
              <circle cx={glancingAtGirl ? 478.5 : 482.5} cy="332.5" r="1" fill="white" opacity={0.75} />
            </>)}
          </g>

          {/* Nose */}
          <ellipse cx="472" cy="338" rx="2.5" ry="1.8" fill="#E87A6A" opacity={0.7} />

          {/* Mouth */}
          <path d="M 469 340 Q 472 343 475 340" fill="none" stroke="#C4956A" strokeWidth="0.8" opacity={0.5} />

          {/* Whiskers */}
          <line x1="450" y1="336" x2="436" y2="333" stroke="#C4956A" strokeWidth="0.6" opacity={0.4} />
          <line x1="450" y1="338" x2="436" y2="340" stroke="#C4956A" strokeWidth="0.6" opacity={0.4} />
          <line x1="494" y1="336" x2="508" y2="333" stroke="#C4956A" strokeWidth="0.6" opacity={0.4} />
          <line x1="494" y1="338" x2="508" y2="340" stroke="#C4956A" strokeWidth="0.6" opacity={0.4} />

          {/* Content expression — slight smile when relaxed */}
          <circle cx="472" cy="338" r="0.8" fill="#E87A6A" opacity={0.4} />
        </motion.g>

        {/* zzz sleep indicator — subtle */}
        {shouldAnimate && (
          <motion.text
            x="488" y="320" fontSize="8" fill="#D4823A" fontFamily="sans-serif"
            animate={{ opacity: [0.1, 0.25, 0.1], y: [320, 316, 320] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >zzz</motion.text>
        )}
      </motion.g>
    </g>
  );
};

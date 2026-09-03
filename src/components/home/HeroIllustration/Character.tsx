import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { motionConfig, kf } from './motionConfig';

interface GirlProps {
  shouldAnimate: boolean;
  getDur: (base: number) => number;
  setupBlinking: (id: string, min: number, max: number, onBlink: () => void) => () => void;
}

export const Character: React.FC<GirlProps> = ({ shouldAnimate, getDur, setupBlinking }) => {
  const [blink, setBlink] = useState(false);
  const [pageLift, setPageLift] = useState(false);

  const startBlink = useCallback(() => setBlink(true), []);
  const endBlink = useCallback(() => setBlink(false), []);

  useEffect(() => {
    if (!shouldAnimate) return;
    const { blink: b } = motionConfig.girl.eyes;
    return setupBlinking('girl-eyes', b.interval.min, b.interval.max, () => {
      startBlink();
      setTimeout(endBlink, b.duration * 1000);
    });
  }, [shouldAnimate, setupBlinking, startBlink, endBlink]);

  useEffect(() => {
    if (!shouldAnimate) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const { min, max } = motionConfig.book.pages.rareLift.interval;
      timer = setTimeout(() => {
        setPageLift(true);
        setTimeout(() => setPageLift(false), motionConfig.book.pages.rareLift.duration * 1000);
        schedule();
      }, Math.random() * (max - min) + min);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [shouldAnimate]);

  const g = motionConfig.girl;
  const b = motionConfig.book;

  return (
    <g id="hero-layer-girl">
      {/* ── Armchair (warm wood tones, softer) ── */}
      <g>
        {/* Chair back */}
        <path d="M 260 225 Q 260 178 310 178 L 390 178 Q 440 178 440 225 L 440 365 L 260 365 Z"
          fill="#9B6B42" opacity={0.82} />
        {/* Chair seat cushion */}
        <rect x="268" y="308" width="164" height="28" rx="8" fill="#B07848" opacity={0.72} />
        {/* Chair bottom rail */}
        <rect x="255" y="338" width="190" height="11" rx="4" fill="#7A4E2D" opacity={0.82} />
        {/* Chair legs */}
        <rect x="260" y="349" width="10" height="44" rx="3" fill="#6B3A1F" />
        <rect x="430" y="349" width="10" height="44" rx="3" fill="#6B3A1F" />
        {/* Chair armrests */}
        <rect x="246" y="282" width="20" height="62" rx="8" fill="#8B5E3C" opacity={0.82} />
        <rect x="434" y="282" width="20" height="62" rx="8" fill="#8B5E3C" opacity={0.82} />
        {/* Soft shadow under chair */}
        <ellipse cx="350" cy="394" rx="95" ry="5" fill="#000" opacity={0.06} />
      </g>

      {/* ── Girl body — breathing ── */}
      <motion.g
        style={{ transformOrigin: '350px 310px' }}
        animate={shouldAnimate ? { scaleY: kf(g.body.breathing.scaleY) } : undefined}
        transition={shouldAnimate ? { duration: getDur(g.body.breathing.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        {/* ── Hair back layer (long flowing, behind body) ── */}
        <motion.g
          style={{ transformOrigin: '350px 185px' }}
          animate={shouldAnimate ? { rotate: kf(g.hair.back.rotate) } : undefined}
          transition={shouldAnimate ? { duration: getDur(g.hair.back.duration), delay: g.hair.back.delay, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          {/* Main long hair flowing down */}
          <path d="M 318 200 Q 310 175 330 162 Q 350 155 370 162 Q 390 175 382 200
                   Q 385 240 388 280 Q 390 310 385 340 Q 380 360 372 370
                   L 370 360 Q 375 330 374 300 Q 372 270 368 250
                   L 350 248 L 332 250 Q 328 270 326 300 Q 325 330 330 360
                   L 328 370 Q 320 360 315 340 Q 310 310 312 280 Q 315 240 318 200 Z"
            fill="#5C3D2E" />
          {/* Hair highlight strands */}
          <path d="M 325 195 Q 322 230 324 270" fill="none" stroke="#7A5740" strokeWidth="2" opacity={0.3} />
          <path d="M 375 195 Q 378 230 376 270" fill="none" stroke="#7A5740" strokeWidth="2" opacity={0.3} />
          {/* Soft glow/outline for separation */}
          <path d="M 318 200 Q 310 175 330 162 Q 350 155 370 162 Q 390 175 382 200
                   Q 385 240 388 280 Q 390 310 385 340 Q 380 360 372 370"
            fill="none" stroke="#4A3020" strokeWidth="1.2" opacity={0.15} />
        </motion.g>

        {/* ── Body / Dress (warm soft tones) ── */}
        <path d="M 328 238 Q 316 262 312 300 L 388 300 Q 384 262 372 238 Z"
          fill="#D4869C" opacity={0.92} />
        {/* Dress neckline detail */}
        <path d="M 338 238 L 350 250 L 362 238" fill="none" stroke="#F8D7DD" strokeWidth="1.8" opacity={0.55} />
        {/* Dress fold details */}
        <path d="M 330 260 Q 338 270 335 290" fill="none" stroke="#C07088" strokeWidth="0.8" opacity={0.3} />
        <path d="M 370 260 Q 362 270 365 290" fill="none" stroke="#C07088" strokeWidth="0.8" opacity={0.3} />
        {/* Dress apron/smock accent */}
        <path d="M 335 265 L 340 298 L 360 298 L 365 265 Z" fill="#F8D7DD" opacity={0.35} />

        {/* ── Head group (float animation) ── */}
        <motion.g
          style={{ transformOrigin: '350px 218px' }}
          animate={shouldAnimate ? { y: kf(g.head.float.y), rotate: kf(g.head.float.rotate) } : undefined}
          transition={shouldAnimate ? { duration: getDur(g.head.float.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          {/* Neck */}
          <rect x="342" y="232" width="16" height="10" rx="4" fill="#F5C8A0" />

          {/* Face / Head shape */}
          <ellipse cx="350" cy="210" rx="30" ry="33" fill="#F5C8A0" />
          {/* Soft face shadow for depth */}
          <ellipse cx="350" cy="215" rx="28" ry="30" fill="#F0BC90" opacity={0.15} />

          {/* Cheek blush */}
          <circle cx="328" cy="220" r="7" fill="#FFB5B5" opacity={0.35} />
          <circle cx="372" cy="220" r="7" fill="#FFB5B5" opacity={0.35} />

          {/* Nose */}
          <ellipse cx="350" cy="216" rx="2.2" ry="1.8" fill="#E8B88A" opacity={0.45} />

          {/* Eyes — large, cute, feminine */}
          <g>
            {/* Eye whites */}
            <ellipse cx="338" cy="208" rx="6" ry="5.5" fill="white" />
            <ellipse cx="362" cy="208" rx="6" ry="5.5" fill="white" />
            {/* Iris */}
            <ellipse cx="339" cy="209" rx="4.5" ry={blink ? 0.5 : 4.5} fill="#3D2B1F" />
            <ellipse cx="363" cy="209" rx="4.5" ry={blink ? 0.5 : 4.5} fill="#3D2B1F" />
            {/* Pupil */}
            {!blink && (<>
              <circle cx="339" cy="208" r="2.5" fill="#1A0F08" />
              <circle cx="363" cy="208" r="2.5" fill="#1A0F08" />
              {/* Eye highlights */}
              <circle cx="341" cy="206.5" r="1.5" fill="white" opacity={0.85} />
              <circle cx="365" cy="206.5" r="1.5" fill="white" opacity={0.85} />
              <circle cx="337.5" cy="210" r="0.8" fill="white" opacity={0.5} />
              <circle cx="361.5" cy="210" r="0.8" fill="white" opacity={0.5} />
            </>)}
            {/* Eyelashes */}
            <path d="M 332 205 Q 335 203 338 204" fill="none" stroke="#3D2B1F" strokeWidth="0.8" opacity={0.5} />
            <path d="M 356 204 Q 359 203 362 205" fill="none" stroke="#3D2B1F" strokeWidth="0.8" opacity={0.5} />
            {/* Eyebrows */}
            <path d="M 332 200 Q 338 197 344 199" fill="none" stroke="#5C3D2E" strokeWidth="1.2" strokeLinecap="round" opacity={0.45} />
            <path d="M 356 199 Q 362 197 368 200" fill="none" stroke="#5C3D2E" strokeWidth="1.2" strokeLinecap="round" opacity={0.45} />
          </g>

          {/* Mouth — gentle warm smile */}
          <motion.path
            d="M 342 225 Q 350 230 358 225"
            fill="none" stroke="#C4956A" strokeWidth="1.3" strokeLinecap="round"
            animate={shouldAnimate ? { opacity: kf(g.face.smile.opacity) } : undefined}
            transition={shouldAnimate ? { duration: getDur(g.face.smile.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
          />

          {/* ── Hair front layer (bangs, side strands) ── */}
          <motion.g
            style={{ transformOrigin: '350px 185px' }}
            animate={shouldAnimate ? { rotate: kf(g.hair.front.rotate) } : undefined}
            transition={shouldAnimate ? { duration: getDur(g.hair.front.duration), delay: g.hair.front.delay, repeat: Infinity, ease: 'easeInOut' } : undefined}
          >
            {/* Main bangs */}
            <path d="M 324 198 Q 326 168 348 160 Q 358 158 368 161 Q 386 170 380 198
                     Q 376 195 370 197 Q 362 193 354 196 Q 346 193 338 197 Q 330 195 324 198 Z"
              fill="#6B4535" opacity={0.88} />
            {/* Side strands — left */}
            <path d="M 324 198 Q 318 210 320 230 Q 322 245 326 252"
              fill="#6B4535" opacity={0.75} />
            {/* Side strands — right */}
            <path d="M 380 198 Q 386 210 384 230 Q 382 245 378 252"
              fill="#6B4535" opacity={0.75} />
            {/* Hair volume highlights */}
            <path d="M 334 170 Q 350 164 366 170" fill="none" stroke="#8A6548" strokeWidth="1.2" opacity={0.3} />
            <path d="M 330 180 Q 350 175 370 180" fill="none" stroke="#8A6548" strokeWidth="0.8" opacity={0.25} />
          </motion.g>
        </motion.g>

        {/* ── Arms (breathing-connected) ── */}
        <motion.g
          animate={shouldAnimate ? { y: kf(g.arms.breathe.y) } : undefined}
          transition={shouldAnimate ? { duration: getDur(g.arms.breathe.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          {/* Left arm */}
          <path d="M 312 258 Q 298 280 304 310" fill="none" stroke="#D4869C" strokeWidth="13" strokeLinecap="round" opacity={0.88} />
          <circle cx="304" cy="310" r="6.5" fill="#F5C8A0" />
          {/* Right arm */}
          <path d="M 388 258 Q 402 280 396 310" fill="none" stroke="#D4869C" strokeWidth="13" strokeLinecap="round" opacity={0.88} />
          <circle cx="396" cy="310" r="6.5" fill="#F5C8A0" />
        </motion.g>

        {/* ── Book (independent float + rare page lift) ── */}
        <motion.g
          style={{ transformOrigin: '350px 298px' }}
          animate={shouldAnimate ? { y: kf(b.float.y), rotate: kf(b.float.rotate) } : undefined}
          transition={shouldAnimate ? { duration: getDur(b.float.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          {/* Book cover */}
          <rect x="322" y="286" width="56" height="38" rx="3" fill="#E8913A" />
          <rect x="320" y="286" width="4" height="38" rx="1" fill="#D07828" />
          {/* Book pages */}
          <rect x="327" y="288" width="48" height="34" rx="2" fill="#FFFBEB" />
          {/* Page lines */}
          <motion.g
            animate={shouldAnimate
              ? { y: pageLift ? kf(b.pages.rareLift.y) : kf(b.pages.micro.y) }
              : undefined}
            transition={shouldAnimate
              ? { duration: pageLift ? b.pages.rareLift.duration : getDur(b.pages.micro.duration), repeat: pageLift ? 0 : Infinity, ease: 'easeInOut' }
              : undefined}
          >
            <line x1="334" y1="296" x2="370" y2="296" stroke="#E5D5B0" strokeWidth="0.8" />
            <line x1="334" y1="301" x2="367" y2="301" stroke="#E5D5B0" strokeWidth="0.8" />
            <line x1="334" y1="306" x2="364" y2="306" stroke="#E5D5B0" strokeWidth="0.8" />
            <line x1="334" y1="311" x2="361" y2="311" stroke="#E5D5B0" strokeWidth="0.8" />
          </motion.g>
          {/* Book decoration */}
          <circle cx="350" cy="304" r="3" fill="#D07828" opacity={0.25} />
        </motion.g>
      </motion.g>
    </g>
  );
};

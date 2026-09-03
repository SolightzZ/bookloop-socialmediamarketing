import React from 'react';
import { motion } from 'motion/react';
import { motionConfig, kf } from './motionConfig';

interface BookshelfProps {
  shouldAnimate: boolean;
  getDur: (base: number) => number;
}

export const Bookshelf: React.FC<BookshelfProps> = ({ shouldAnimate, getDur }) => {
  const bk = motionConfig.bookshelf.books;

  return (
    <g id="hero-layer-bookshelf">
      {/* Shelf frame — warm wood with depth */}
      <g opacity={0.92}>
        <rect x="18" y="98" width="204" height="222" rx="4" fill="#C4956A" opacity={0.25} />
        {/* Shelf boards */}
        <rect x="16" y="158" width="208" height="8" rx="2" fill="#A07048" />
        <rect x="16" y="218" width="208" height="8" rx="2" fill="#A07048" />
        <rect x="16" y="278" width="208" height="8" rx="2" fill="#A07048" />
        {/* Shelf sides */}
        <rect x="16" y="96" width="6" height="192" rx="2" fill="#8B5E3C" />
        <rect x="216" y="96" width="6" height="192" rx="2" fill="#8B5E3C" />
        {/* Shelf shadow */}
        <rect x="18" y="166" width="204" height="3" rx="1" fill="#6B3A1F" opacity={0.12} />
        <rect x="18" y="226" width="204" height="3" rx="1" fill="#6B3A1F" opacity={0.12} />
        <rect x="18" y="286" width="204" height="3" rx="1" fill="#6B3A1F" opacity={0.12} />
      </g>

      {/* Top shelf — varied book spines */}
      <g>
        {[30, 46, 61, 78, 92, 108, 122, 137, 150, 166, 180, 196].map((x, i) => (
          <rect key={`t${i}`} x={x} y={118 + (i % 3) * 2} width={12 + (i % 2) * 2} height={36 + (i % 4) * 2} rx="1.5"
            fill={['#1976D2', '#E53935', '#388E3C', '#F57C00', '#7B1FA2', '#00838F', '#C2185B', '#1565C0', '#2E7D32', '#EF6C00', '#512DA8', '#00695C'][i]} />
        ))}
      </g>

      {/* Middle shelf — 3 animated books */}
      <g>
        <rect x="30" y="178" width="13" height="38" rx="1.5" fill="#F57C00" />
        <rect x="45" y="181" width="11" height="35" rx="1.5" fill="#1976D2" />

        {/* Animated book 1 — subtle Y float */}
        <motion.g
          animate={shouldAnimate ? { y: kf(bk.book1.y) } : undefined}
          transition={shouldAnimate ? { duration: getDur(bk.book1.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <rect x="58" y="176" width="14" height="40" rx="1.5" fill="#E53935" />
          <rect x="60" y="178" width="10" height="36" rx="1" fill="#FFCDD2" />
        </motion.g>

        <rect x="74" y="180" width="12" height="36" rx="1.5" fill="#388E3C" />
        <rect x="88" y="178" width="15" height="38" rx="1.5" fill="#7B1FA2" />
        <rect x="105" y="182" width="11" height="34" rx="1.5" fill="#00838F" />

        {/* Animated book 2 — subtle rotate */}
        <motion.g
          style={{ transformOrigin: '128px 216px' }}
          animate={shouldAnimate ? { rotate: kf(bk.book2.rotate) } : undefined}
          transition={shouldAnimate ? { duration: getDur(bk.book2.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <rect x="118" y="178" width="13" height="38" rx="1.5" fill="#C2185B" />
        </motion.g>

        {/* Animated book 3 — subtle opacity pulse */}
        <motion.rect
          x="133" y="180" width="12" height="36" rx="1.5" fill="#1565C0"
          animate={shouldAnimate ? { opacity: kf(bk.book3.opacity) } : undefined}
          transition={shouldAnimate ? { duration: getDur(bk.book3.duration), repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
        <rect x="135" y="182" width="8" height="32" rx="1" fill="#E3F2FD" />

        <rect x="147" y="178" width="14" height="38" rx="1.5" fill="#2E7D32" />
        <rect x="163" y="181" width="11" height="35" rx="1.5" fill="#EF6C00" />
        <rect x="176" y="179" width="13" height="37" rx="1.5" fill="#512DA8" />
        <rect x="191" y="182" width="12" height="34" rx="1.5" fill="#00695C" />
      </g>

      {/* Bottom shelf */}
      <g>
        {[30, 47, 62, 77, 90, 106, 120, 135, 148, 164, 178, 194].map((x, i) => (
          <rect key={`b${i}`} x={x} y={238 + (i % 3) * 2} width={12 + (i % 2) * 2} height={38 + (i % 3)} rx="1.5"
            fill={['#00838F', '#F57C00', '#1976D2', '#C2185B', '#2E7D32', '#7B1FA2', '#E53950', '#00695C', '#EF6C00', '#512DA8', '#1565C0', '#388E3C'][i]} />
        ))}
      </g>

      {/* Decorative items on shelf */}
      <g>
        {/* Small plant on top shelf */}
        <rect x="178" y="140" width="14" height="16" rx="2" fill="#C4956A" />
        <ellipse cx="185" cy="138" rx="6" ry="8" fill="#5B8C5A" opacity={0.8} />
        {/* Globe/ball */}
        <circle cx="172" cy="268" r="8" fill="#81D4FA" opacity={0.6} />
        <line x1="172" y1="260" x2="172" y2="276" stroke="#90A4AE" strokeWidth="0.8" />
      </g>
    </g>
  );
};

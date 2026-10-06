import React from 'react';
import { Box } from '@mui/material';

interface DiscoveryEffectsProps {
  isReducedMotion?: boolean;
}

export const DiscoveryEffects: React.FC<DiscoveryEffectsProps> = ({ isReducedMotion = false }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        background: 'linear-gradient(180deg, #F0F7FF 0%, #E4F1FF 45%, #EDF6FF 80%, #F5FAFF 100%)',
      }}
      aria-hidden="true"
    >
      {/* 1. Notebook Graph Paper Grid Texture (สมุดจดบันทึก / ตารางกราฟสมุด) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.14,
          backgroundImage: `
            linear-gradient(to right, #1677E8 1px, transparent 1px),
            linear-gradient(to bottom, #1677E8 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />


      {/* 3. Left Library Wall & Bookshelves (ห้องหนังสือ / ชั้นหนังสือฝั่งซ้าย) */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: -80, sm: -40, md: 0 },
          top: '10%',
          bottom: '5%',
          width: { xs: 220, sm: 280, md: 340 },
          opacity: 0.22,
        }}
      >
        <svg
          viewBox="0 0 320 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMinYMid meet"
        >
          {/* Bookshelf Outer Arch & Frame */}
          <path
            d="M30 580V120C30 70 80 30 150 30C220 30 270 70 270 120V580"
            stroke="#1677E8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M20 580H280" stroke="#1677E8" strokeWidth="4" strokeLinecap="round" />

          {/* Shelf 1 (Top Arch with clock & leaning books) */}
          <path d="M30 160H270" stroke="#1677E8" strokeWidth="2.5" />
          <circle cx="150" cy="115" r="26" stroke="#1677E8" strokeWidth="2" />
          <path d="M150 98V115L162 122" stroke="#1677E8" strokeWidth="2" strokeLinecap="round" />
          {/* Leaning books top shelf */}
          <rect x="65" y="100" width="12" height="60" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="80" y="92" width="14" height="68" rx="2" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="97" y="106" width="11" height="54" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <path d="M205 160L222 108H234L217 160H205Z" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />

          {/* Shelf 2 (Row of Study Books & Notebooks) */}
          <path d="M30 270H270" stroke="#1677E8" strokeWidth="2.5" />
          <rect x="45" y="185" width="16" height="85" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="64" y="175" width="20" height="95" rx="2" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="87" y="192" width="15" height="78" rx="2" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="105" y="180" width="22" height="90" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="130" y="196" width="18" height="74" rx="2" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          {/* Horizontal stack of notebooks */}
          <rect x="160" y="250" width="65" height="18" rx="3" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="166" y="234" width="55" height="16" rx="3" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="172" y="220" width="45" height="14" rx="3" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />

          {/* Shelf 3 (Big Hardcover Encyclopedia Volumes) */}
          <path d="M30 400H270" stroke="#1677E8" strokeWidth="2.5" />
          <rect x="46" y="295" width="24" height="105" rx="3" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />
          <line x1="58" y1="310" x2="58" y2="385" stroke="#1677E8" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="73" y="300" width="24" height="100" rx="3" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="100" y="292" width="26" height="108" rx="3" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="129" y="305" width="22" height="95" rx="3" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="154" y="312" width="20" height="88" rx="3" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          {/* Bookend and leaning journal */}
          <path d="M195 400L220 330H234L209 400H195Z" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <path d="M242 400V355H256V400" stroke="#1677E8" strokeWidth="2" />

          {/* Shelf 4 (Bottom Shelf with Study Journal Archive) */}
          <path d="M30 515H270" stroke="#1677E8" strokeWidth="2.5" />
          <rect x="50" y="445" width="70" height="70" rx="4" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <circle cx="85" cy="480" r="10" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="135" y="430" width="22" height="85" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="160" y="425" width="25" height="90" rx="2" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="188" y="435" width="20" height="80" rx="2" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="211" y="440" width="18" height="75" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
        </svg>
      </Box>

      {/* 4. Right Library Bookshelf & Reading Room Details (ชั้นหนังสือฝั่งขวา) */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: -80, sm: -40, md: 0 },
          top: '10%',
          bottom: '5%',
          width: { xs: 220, sm: 280, md: 340 },
          opacity: 0.22,
        }}
      >
        <svg
          viewBox="0 0 320 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMaxYMid meet"
        >
          {/* Bookshelf Outer Arch & Frame */}
          <path
            d="M50 580V120C50 70 100 30 170 30C240 30 290 70 290 120V580"
            stroke="#1677E8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M40 580H300" stroke="#1677E8" strokeWidth="4" strokeLinecap="round" />

          {/* Top Arch with Potted Ivy / Plant */}
          <path d="M50 160H290" stroke="#1677E8" strokeWidth="2.5" />
          <path d="M150 160L156 125H184L190 160" stroke="#1677E8" strokeWidth="1.5" fill="#E0F2FE" />
          <path d="M170 125C155 105 140 120 135 110M170 120C185 98 198 115 208 105M170 125V88" stroke="#1677E8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Shelf 2 (Series of Pocket Books & Notebooks with Ribbon) */}
          <path d="M50 270H290" stroke="#1677E8" strokeWidth="2.5" />
          <rect x="70" y="195" width="16" height="75" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="89" y="185" width="22" height="85" rx="2" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />
          {/* Bookmark Ribbon hanging down */}
          <path d="M100 270V290L105 285L110 290V270" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
          <rect x="114" y="192" width="18" height="78" rx="2" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="135" y="180" width="20" height="90" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="158" y="200" width="16" height="70" rx="2" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          {/* Stack of small notebooks */}
          <rect x="195" y="252" width="60" height="18" rx="3" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="200" y="236" width="50" height="16" rx="3" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />

          {/* Shelf 3 (Thick Study Textbooks) */}
          <path d="M50 400H290" stroke="#1677E8" strokeWidth="2.5" />
          <rect x="72" y="305" width="26" height="95" rx="3" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="101" y="295" width="28" height="105" rx="3" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <line x1="115" y1="310" x2="115" y2="385" stroke="#1677E8" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="132" y="302" width="24" height="98" rx="3" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <path d="M175 400L205 325H220L190 400H175Z" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="228" y="315" width="22" height="85" rx="3" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="253" y="320" width="18" height="80" rx="3" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />

          {/* Shelf 4 (Classic Binder & Book Storage Box) */}
          <path d="M50 515H290" stroke="#1677E8" strokeWidth="2.5" />
          <rect x="75" y="445" width="75" height="70" rx="4" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
          <line x1="90" y1="465" x2="135" y2="465" stroke="#1677E8" strokeWidth="1.5" />
          <line x1="90" y1="480" x2="125" y2="480" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="165" y="435" width="24" height="80" rx="2" fill="#E0F2FE" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="192" y="430" width="26" height="85" rx="2" fill="#93C5FD" stroke="#1677E8" strokeWidth="1.5" />
          <rect x="221" y="440" width="22" height="75" rx="2" fill="#BAE6FD" stroke="#1677E8" strokeWidth="1.5" />
        </svg>
      </Box>

      {/* 5. Floating Open Books & Notebooks (หนังสือเปิด & สมุดบันทึกลอยละล่อง) */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '6%', sm: '8%' },
          left: { xs: '12%', sm: '18%', md: '22%' },
          width: 64,
          height: 48,
          opacity: 0.28,
          transform: 'rotate(-12deg)',
          willChange: 'transform',
          animation: isReducedMotion ? 'none' : 'floatBookLeft 6s ease-in-out infinite',
          '@keyframes floatBookLeft': {
            '0%, 100%': { transform: 'translateY(0px) rotate(-12deg)' },
            '50%': { transform: 'translateY(-10px) rotate(-8deg)' },
          },
        }}
      >
        {/* Open Book Vector */}
        <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M32 14C24 10 12 11 4 15V43C12 39 24 38 32 42C40 38 52 39 60 43V15C52 11 40 10 32 14Z"
            fill="#E0F2FE"
            stroke="#1677E8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M32 14V42" stroke="#1677E8" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 22C18 20 25 21 28 22M12 28C18 26 25 27 28 28M36 22C42 21 49 20 52 22M36 28C42 27 49 26 52 28" stroke="#1677E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: { xs: '10%', sm: '12%' },
          right: { xs: '10%', sm: '16%', md: '20%' },
          width: 58,
          height: 44,
          opacity: 0.26,
          transform: 'rotate(14deg)',
          willChange: 'transform',
          animation: isReducedMotion ? 'none' : 'floatBookRight 7s ease-in-out infinite',
          '@keyframes floatBookRight': {
            '0%, 100%': { transform: 'translateY(0px) rotate(14deg)' },
            '50%': { transform: 'translateY(-12px) rotate(18deg)' },
          },
        }}
      >
        {/* Open Book Vector Right */}
        <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M32 14C24 10 12 11 4 15V43C12 39 24 38 32 42C40 38 52 39 60 43V15C52 11 40 10 32 14Z"
            fill="#BAE6FD"
            stroke="#1677E8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M32 14V42" stroke="#1677E8" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 23C18 21 25 22 28 23M12 29C18 27 25 28 28 29M36 23C42 22 49 21 52 23M36 29C42 28 49 27 52 29" stroke="#1677E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      </Box>

      {/* 6. Bottom Study Desk Horizon Line */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #BAE6FD 30%, #93C5FD 50%, #BAE6FD 70%, transparent 100%)',
        }}
      />
    </Box>
  );
};

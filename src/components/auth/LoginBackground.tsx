import { Bookmark, BookOpen, Coffee, Glasses, Repeat, Sparkles } from 'lucide-react';
import React from 'react';

/**
 * LoginBackground component — Minimalist Icon Wallpaper Sanctuary.
 * Provides an atmospheric, elegant background composed of minimalist reading icons:
 * 1. Seamless Vector Icon Wallpaper Pattern (Book, Coffee, Glasses, Bookmark, Sparkles, Loop)
 * 2. Radial vignette mask (soft & subtle behind the card, crisp & clear around margins)
 * 3. Delicate Floating Frosted Icon Accents at perimeter
 * 4. Warm Daylight Sanctuary ambient color washes
 * - Strictly z-index: 0, pointer-events: none (never interferes with form clicks or typing).
 */
export const LoginBackground: React.FC = () => {
   return (
      <div
         aria-hidden="true"
         role="presentation"
         className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
         style={{
            background: 'linear-gradient(145deg, #F8FAFC 0%, #F1F6FB 45%, #EDF4FC 100%)',
         }}>
         {/* 1. Atmospheric Daylight Radial Glows */}
         {/* Top-Left: Warm Amber Sunlight Wash */}
         <div
            className="absolute -top-[15%] -left-[10%] w-[520px] h-[520px] md:w-[740px] md:h-[740px] rounded-full blur-[110px] opacity-[0.24]"
            style={{
               background: 'radial-gradient(circle, #FDE68A 0%, rgba(254, 243, 199, 0.4) 50%, transparent 75%)',
            }}
         />

         {/* Bottom-Right: Serene Azure BookLoop Wash */}
         <div
            className="absolute -bottom-[12%] -right-[8%] w-[540px] h-[540px] md:w-[760px] md:h-[760px] rounded-full blur-[120px] opacity-[0.20]"
            style={{
               background: 'radial-gradient(circle, #93C5FD 0%, rgba(186, 230, 253, 0.4) 50%, transparent 75%)',
            }}
         />

         {/* Center Card Halo: Soft Warm White Illumination */}
         <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] md:w-[800px] md:h-[800px] rounded-full blur-[90px] opacity-[0.75]"
            style={{
               background: 'radial-gradient(circle, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 40%, transparent 80%)',
            }}
         />

         {/* 2. Repeating Minimalist Reading Icon Wallpaper Pattern (SVG) */}
         <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            style={{
               maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,1) 100%)',
               WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,1) 100%)',
            }}>
            <defs>
               <pattern id="bl-reading-icons" width="170" height="170" patternUnits="userSpaceOnUse">
                  {/* 1. Open Book (Lucide style) at (24, 24) */}
                  <g transform="translate(20, 20) rotate(-6 12 12)" stroke="#1976D2" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.16">
                     <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                     <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </g>

                  {/* 2. Warm Coffee Cup at (110, 20) */}
                  <g transform="translate(110, 18) rotate(4 12 12)" stroke="#B45309" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.14">
                     <path d="M10 2v2 M14 2v2 M6 2v2" />
                     <path d="M18 8a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1" />
                     <path d="M2 8h15v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                     <line x1="6" y1="1" x2="18" y2="1" />
                  </g>

                  {/* 3. Magic Sparkles at (65, 75) */}
                  <g transform="translate(68, 72) scale(0.9)" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.18">
                     <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
                  </g>

                  {/* 4. Bookmark Ribbon at (130, 95) */}
                  <g transform="translate(126, 92) rotate(8 10 12)" stroke="#1976D2" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.16">
                     <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </g>

                  {/* 5. Reading Glasses at (18, 115) */}
                  <g transform="translate(16, 112) rotate(-8 12 12)" stroke="#0F2D4A" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.15">
                     <circle cx="6" cy="12" r="4" />
                     <circle cx="18" cy="12" r="4" />
                     <path d="M10 12a2 2 0 0 1 4 0" />
                     <line x1="2.5" y1="11" x2="2" y2="7" />
                     <line x1="21.5" y1="11" x2="22" y2="7" />
                  </g>

                  {/* 6. Favorite Heart at (145, 48) */}
                  <g transform="translate(144, 46) scale(0.85)" stroke="#E11D48" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.14">
                     <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </g>

                  {/* 7. Circular Loop / Pass-Forward at (80, 130) */}
                  <g transform="translate(80, 128) scale(0.88)" stroke="#0284C7" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.15">
                     <path d="m17 2 4 4-4 4" />
                     <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                     <path d="m7 22-4-4 4-4" />
                     <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                  </g>

                  {/* Subtle Architectural Grid Intersection Points (+) */}
                  <circle cx="85" cy="22" r="1.2" fill="#0F2D4A" opacity="0.12" />
                  <circle cx="155" cy="145" r="1.2" fill="#0F2D4A" opacity="0.12" />
                  <circle cx="15" cy="75" r="1.2" fill="#0F2D4A" opacity="0.12" />
               </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bl-reading-icons)" />
         </svg>

         {/* 3. Floating Frosted Icon Accents at Outer Margins (Tablet / Desktop) */}
         <div className="hidden sm:block">
            {/* Top-Left: Open Book Float */}
            <div
               className="bl-animate-book-float absolute top-[12%] left-[6%] lg:left-[10%] p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-blue-100/70 shadow-[0_4px_16px_rgba(25,118,210,0.06)]"
               style={{ transform: 'rotate(-6deg)' }}>
               <BookOpen size={24} className="text-[#1976D2] opacity-80" strokeWidth={1.8} />
            </div>

            {/* Top-Right: Warm Coffee Float */}
            <div
               className="bl-animate-drift-2 absolute top-[14%] right-[7%] lg:right-[11%] p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-amber-100/70 shadow-[0_4px_16px_rgba(245,158,11,0.06)]"
               style={{ transform: 'rotate(5deg)' }}>
               <Coffee size={24} className="text-[#D97706] opacity-80" strokeWidth={1.8} />
            </div>

            {/* Mid-Left: Circular Loop Float */}
            <div
               className="bl-animate-drift-1 absolute top-[48%] left-[4%] lg:left-[7%] p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-[0_2px_12px_rgba(15,45,74,0.04)]"
               style={{ transform: 'rotate(8deg)' }}>
               <Repeat size={20} className="text-[#0284C7] opacity-75" strokeWidth={1.8} />
            </div>

            {/* Mid-Right: Reading Glasses Float */}
            <div
               className="bl-animate-drift-3 absolute top-[46%] right-[5%] lg:right-[8%] p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-[0_2px_12px_rgba(15,45,74,0.04)]"
               style={{ transform: 'rotate(-8deg)' }}>
               <Glasses size={22} className="text-[#0F2D4A] opacity-70" strokeWidth={1.8} />
            </div>

            {/* Bottom-Left: Bookmark Float */}
            <div
               className="bl-animate-book-float absolute bottom-[14%] left-[7%] lg:left-[11%] p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-emerald-100/70 shadow-[0_4px_16px_rgba(21,128,61,0.06)]"
               style={{ transform: 'rotate(4deg)' }}>
               <Bookmark size={24} className="text-[#15803D] opacity-80" strokeWidth={1.8} />
            </div>

            {/* Bottom-Right: Sparkles Float */}
            <div
               className="bl-animate-sparkle absolute bottom-[15%] right-[6%] lg:right-[10%] p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-amber-100/70 shadow-[0_4px_16px_rgba(245,158,11,0.06)]"
               style={{ transform: 'rotate(-4deg)' }}>
               <Sparkles size={24} className="text-[#F59E0B] opacity-85" strokeWidth={1.8} />
            </div>
         </div>
      </div>
   );
};

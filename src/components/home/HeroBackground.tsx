import React from 'react';

/**
 * HeroBackground — "BookLoop Cozy Story World" Premium Atmospheric System
 *
 * 7 LAYERS — all hero-only, overflow:hidden, pointer-events:none, z-index:0
 *
 *  L01 — Ambient Light Blobs (2-3 oversized, 20-35s, opacity 0.04-0.12)
 *  L02 — Large Gradient Flow (25-40s, ultra-slow)
 *  L03 — Soft Cloud Drift (2-4 clouds, 25-55s, opacity 0.04-0.08)
 *  L04 — Floating Book Outlines (2-4, 8-15s, opacity 0.03-0.07)
 *  L05 — Floating Dust (desktop 16-24 / tablet 10-14 / mobile 6-10, 6-12s)
 *  L06 — Micro Sparkles (4-8, 2-5s, randomized)
 *  L07 — Breathing Light Pulse (8-12s, opacity 0.03-0.08, scale 1-1.015)
 *
 *  + Mouse Parallax (handled in Hero.tsx, disabled on touch)
 *  + IntersectionObserver pause (handled in Hero.tsx)
 *
 *  Performance: Only transform + opacity. No layout properties.
 */

// ── L05: Dust — desktop 20, tablet hides >14, mobile hides >8 via CSS ──
const dustParticles = [
  { id: 1, x: '8%', y: '18%', size: 2, delay: 0, duration: 7.2 },
  { id: 2, x: '22%', y: '42%', size: 1.5, delay: 1.1, duration: 9.4 },
  { id: 3, x: '36%', y: '14%', size: 2.5, delay: 2.3, duration: 6.8 },
  { id: 4, x: '51%', y: '58%', size: 1.8, delay: 0.7, duration: 10.2 },
  { id: 5, x: '64%', y: '28%', size: 1.2, delay: 3.0, duration: 8.1 },
  { id: 6, x: '77%', y: '52%', size: 2, delay: 1.4, duration: 11.0 },
  { id: 7, x: '89%', y: '22%', size: 1.4, delay: 2.7, duration: 7.5 },
  { id: 8, x: '14%', y: '68%', size: 1.8, delay: 0.4, duration: 9.8 },
  // tablet+
  { id: 9, x: '44%', y: '78%', size: 1.3, delay: 1.7, duration: 10.6 },
  { id: 10, x: '71%', y: '12%', size: 2.2, delay: 2.1, duration: 8.4 },
  { id: 11, x: '31%', y: '48%', size: 1, delay: 3.4, duration: 7.9 },
  { id: 12, x: '57%', y: '38%', size: 1.6, delay: 0.9, duration: 11.4 },
  { id: 13, x: '83%', y: '62%', size: 1.2, delay: 1.9, duration: 6.6 },
  { id: 14, x: '7%', y: '33%', size: 1.8, delay: 2.5, duration: 9.1 },
  // desktop only
  { id: 15, x: '41%', y: '24%', size: 2, delay: 3.1, duration: 7.0 },
  { id: 16, x: '67%', y: '72%', size: 1, delay: 0.6, duration: 10.8 },
  { id: 17, x: '19%', y: '82%', size: 1.6, delay: 2.4, duration: 11.8 },
  { id: 18, x: '91%', y: '42%', size: 1.3, delay: 1.2, duration: 8.8 },
  { id: 19, x: '4%', y: '54%', size: 1.5, delay: 3.6, duration: 9.5 },
  { id: 20, x: '74%', y: '18%', size: 1, delay: 0.8, duration: 7.3 },
];

// ── L03: Clouds ──
const clouds = [
  { id: 1, x: '10%', y: '28%', w: 180, h: 56, delay: 0, duration: 42 },
  { id: 2, x: '58%', y: '18%', w: 140, h: 44, delay: 5, duration: 48 },
  { id: 3, x: '34%', y: '62%', w: 160, h: 48, delay: 10, duration: 55 },
];

// ── L04: Book outlines ──
const bookOutlines = [
  { id: 1, x: '7%', y: '16%', rot: -8, size: 42, delay: 0, duration: 10, color: '#1976D2' },
  { id: 2, x: '86%', y: '18%', rot: 5, size: 34, delay: 2.6, duration: 13, color: '#FF8A65' },
  { id: 3, x: '88%', y: '68%', rot: 7, size: 38, delay: 3.9, duration: 12, color: '#FF8A65' },
];

// ── L06: Micro sparkles (CSS-only twinkle) ──
const sparkles = [
  { id: 1, x: '18%', y: '22%', size: 8, delay: 0, duration: 2.8 },
  { id: 2, x: '42%', y: '12%', size: 6, delay: 1.2, duration: 3.4 },
  { id: 3, x: '68%', y: '32%', size: 7, delay: 2.1, duration: 4.2 },
  { id: 4, x: '84%', y: '54%', size: 5, delay: 0.7, duration: 2.4 },
  { id: 5, x: '26%', y: '72%', size: 6, delay: 1.8, duration: 3.8 },
  { id: 6, x: '56%', y: '82%', size: 5, delay: 2.6, duration: 4.6 },
];

export const HeroBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="hero-bg-root absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* ──────────────────────────────────────────────
          L02 — LARGE GRADIENT FLOW (back-most)
          Animated via background-position, 32s cycle
          ────────────────────────────────────────────── */}
      <div
        className="bl-gradient-flow absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(115deg, #E3F2FD 0%, #F7FAFC 32%, #FFFFFF 50%, #FFF8E1 72%, #FFF3E0 100%)',
          backgroundSize: '220% 220%',
          backgroundPosition: '0% 50%',
        }}
      />

      {/* ──────────────────────────────────────────────
          L01 — AMBIENT LIGHT BLOBS (2-3 oversized)
          Opacity 0.04-0.12, 20-35s, ease-in-out
          ────────────────────────────────────────────── */}
      {/* Blob A — BookLoop blue, top-left — wrapper handles parallax, inner handles glow anim */}
      <div className="absolute" data-parallax="glow" style={{ top: '-12%', left: '-6%' }}>
        <div
          className="rounded-full"
          style={{
            width: 'clamp(280px, 36vw, 520px)',
            height: 'clamp(280px, 36vw, 520px)',
            background: 'radial-gradient(circle, #1976D2 0%, rgba(25,118,210,0) 68%)',
            opacity: 0.08,
            animation: 'bl-glow-a 28s ease-in-out infinite',
          }}
        />
      </div>
      {/* Blob B — Warm cream, bottom-right */}
      <div className="absolute" data-parallax="glow" style={{ bottom: '-14%', right: '-6%' }}>
        <div
          className="rounded-full"
          style={{
            width: 'clamp(260px, 30vw, 470px)',
            height: 'clamp(260px, 30vw, 470px)',
            background: 'radial-gradient(circle, #FFE0B2 0%, rgba(255,224,178,0) 68%)',
            opacity: 0.11,
            animation: 'bl-glow-b 32s ease-in-out infinite 2s',
          }}
        />
      </div>
      {/* Blob C — Soft cyan, centre */}
      <div className="bl-blob-c absolute hidden md:block" data-parallax="glow" style={{ top: '38%', left: '48%' }}>
        <div
          className="rounded-full"
          style={{
            width: 'clamp(200px, 24vw, 380px)',
            height: 'clamp(200px, 24vw, 380px)',
            marginLeft: '-50%',
            marginTop: '-50%',
            background: 'radial-gradient(circle, #80DEEA 0%, rgba(128,222,234,0) 68%)',
            opacity: 0.05,
            animation: 'bl-glow-c 35s ease-in-out infinite 4s',
          }}
        />
      </div>

      {/* ──────────────────────────────────────────────
          L07 — BREATHING LIGHT PULSE
          Single ultra-subtle pulse, 10s, opacity 0.03-0.08
          ────────────────────────────────────────────── */}
      <div
        className="bl-breath absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.9) 0%, rgba(255,244,220,0.45) 28%, transparent 62%)',
        }}
      />

      {/* ──────────────────────────────────────────────
          L03 — SOFT CLOUD DRIFT (md+ only)
          Opacity 0.04-0.08, 25-55s, X -15→15
          ────────────────────────────────────────────── */}
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        {clouds.map((c) => (
          <div key={c.id} className="absolute" data-parallax="cloud" style={{ left: c.x, top: c.y }}>
            <div
              className="bl-cloud"
              style={{
                width: `${c.w}px`,
                height: `${c.h}px`,
                borderRadius: '50%',
                opacity: 0.05,
                background:
                  'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
                animation: `bl-cloud-drift ${c.duration}s ease-in-out infinite ${c.delay}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* ──────────────────────────────────────────────
          L04 — FLOATING BOOK OUTLINES (sm+ only)
          Opacity 0.03-0.07, Y 0→-8→0, rot ±1deg, 8-15s
          ────────────────────────────────────────────── */}
      <div className="absolute inset-0 hidden sm:block" aria-hidden="true">
        {bookOutlines.map((b) => (
          <div key={b.id} className="absolute" data-parallax="book" style={{ left: b.x, top: b.y }}>
            <div
              className="bl-book-outline"
              style={{
                opacity: 0.05,
                transform: `rotate(${b.rot}deg)`,
                animation: `bl-book-float ${b.duration}s ease-in-out infinite ${b.delay}s`,
              }}
            >
              <svg
                width={b.size}
                height={b.size * 0.72}
                viewBox="0 0 44 32"
                fill="none"
                stroke={b.color}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 26C16 23 8 23 2 26V6C8 3 16 3 22 6V26Z" />
                <path d="M22 26C28 23 36 23 42 26V6C36 3 28 3 22 6V26Z" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ──────────────────────────────────────────────
          L05 — FLOATING DUST
          Desktop 20 / Tablet 14 / Mobile 8
          Size 1-3px, Y 0→-20→0, X ±4px, opacity 0→0.4→0
          ────────────────────────────────────────────── */}
      <div className="absolute inset-0" aria-hidden="true">
        {dustParticles.map((p) => (
          <div
            key={p.id}
            className={`absolute ${p.id > 14 ? 'hidden lg:block' : p.id > 8 ? 'hidden md:block' : ''}`}
            data-parallax="dust"
            style={{ left: p.x, top: p.y }}
          >
            <div
              className="bl-dust rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: 'linear-gradient(135deg, #1976D2 0%, #64B5F6 100%)',
                opacity: 0,
                animation: `bl-dust-float ${p.duration}s ease-in-out infinite ${p.delay}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* ──────────────────────────────────────────────
          L06 — MICRO SPARKLES (4-8, 2-5s, desync)
          ────────────────────────────────────────────── */}
      <div className="absolute inset-0" aria-hidden="true">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className={`bl-sparkle absolute select-none ${s.id > 4 ? 'hidden sm:block' : ''}`}
            style={{
              left: s.x,
              top: s.y,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animation: `bl-sparkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
            }}
          >
            <svg
              width={s.size}
              height={s.size}
              viewBox="0 0 8 8"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 0L4.6 3.4L8 4L4.6 4.6L4 8L3.4 4.6L0 4L3.4 3.4Z" fill="#F9A825" />
            </svg>
          </div>
        ))}
      </div>

      {/* ──────────────────────────────────────────────
          Subtle dot paper texture (static)
          ────────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.022] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern id="bookloop-hero-dots-v2" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#0F2D4A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bookloop-hero-dots-v2)" />
      </svg>

      {/* Subtle flow line (desktop only, static faint) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.03] hidden lg:block pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 700"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-50,220 C280,120 480,480 720,400 C960,320 1150,580 1550,420"
          stroke="#1976D2"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
      </svg>
    </div>
  );
};

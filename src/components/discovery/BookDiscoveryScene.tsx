import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BookDiscoverySceneProps } from './bookDiscovery.types';

/**
 * Mascot texture with crisp 2D cartoon line art (ZERO GLOW)
 */
function createMascotTexture(expression: 'normal' | 'amazed' | 'happy'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 160, 160);

    // Warm cream mascot head
    ctx.beginPath();
    ctx.arc(80, 80, 68, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFDF7';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#0F2D4A';
    ctx.stroke();

    // Cute ears
    ctx.beginPath();
    ctx.arc(36, 28, 16, 0, Math.PI * 2);
    ctx.arc(124, 28, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#FED7AA';
    ctx.fill();
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = '#0F2D4A';
    ctx.stroke();

    // Peach blush
    ctx.beginPath();
    ctx.arc(42, 92, 11, 0, Math.PI * 2);
    ctx.arc(118, 92, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#FDBA74';
    ctx.fill();

    // Eyes and mouth
    ctx.fillStyle = '#0F2D4A';
    ctx.strokeStyle = '#0F2D4A';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';

    if (expression === 'amazed') {
      ctx.beginPath();
      ctx.arc(58, 72, 8, 0, Math.PI * 2);
      ctx.arc(102, 72, 8, 0, Math.PI * 2);
      ctx.fill();

      // Catchlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(60, 70, 2.5, 0, Math.PI * 2);
      ctx.arc(104, 70, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // O-shaped mouth
      ctx.fillStyle = '#0F2D4A';
      ctx.beginPath();
      ctx.ellipse(80, 98, 7, 11, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (expression === 'happy') {
      // Joyful arc eyes ^^
      ctx.beginPath();
      ctx.arc(58, 74, 9, Math.PI, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(102, 74, 9, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Wide happy smile
      ctx.beginPath();
      ctx.arc(80, 92, 14, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.fillStyle = '#F43F5E';
      ctx.fill();
      ctx.stroke();
    } else {
      // Friendly smile
      ctx.beginPath();
      ctx.arc(58, 74, 6, 0, Math.PI * 2);
      ctx.arc(102, 74, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(60, 72, 2, 0, Math.PI * 2);
      ctx.arc(104, 72, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(80, 92, 9, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Concentric orbit ring texture (clean crisp vector lines, NO GLOW)
 */
function createOrbitRingTexture(radiusX: number, radiusY: number, dashPattern: number[], color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 256);
    ctx.beginPath();
    ctx.ellipse(256, 128, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash(dashPattern);
    ctx.stroke();

    // Jewel node markers along the orbit
    const nodes = 6;
    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2;
      const x = 256 + Math.cos(angle) * radiusX;
      const y = 128 + Math.sin(angle) * radiusY;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#F59E0B' : '#38BDF8';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#0F2D4A';
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Helper to generate compact 2D candidate book texture
 */
function createCandidateBookTexture(colorHex: string, titleShort: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Solid clean cover
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 120, 160);

    // Spine binding strip
    ctx.fillStyle = 'rgba(15, 45, 74, 0.25)';
    ctx.fillRect(0, 0, 16, 160);

    // Crisp inner border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(20, 14, 88, 132);

    // Graphic decorative horizontal lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(30, 36, 68, 6);
    ctx.fillRect(30, 50, 52, 4);

    // Golden Bookmark Ribbon
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(56, 0, 16, 28);
    ctx.beginPath();
    ctx.moveTo(56, 28);
    ctx.lineTo(64, 22);
    ctx.lineTo(72, 28);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Comic action impact spokes texture (clean crisp radial lines, NO GLOW)
 */
function createImpactSpokesTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.translate(128, 128);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const spokes = 10;
    for (let i = 0; i < spokes; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 52);
      ctx.lineTo(0, 88);
      ctx.stroke();
      ctx.rotate((Math.PI * 2) / spokes);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Mystery Book Cover Texture for Shuffle phase (? ? ?)
 * Pure crisp vector graphic on dark cobalt blue canvas, NO GLOW
 */
function createMysteryCoverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich indigo background
    ctx.fillStyle = '#0F2D4A';
    ctx.fillRect(0, 0, 300, 420);

    // Subtle geometrical pattern
    ctx.fillStyle = '#1E3A8A';
    for (let x = 15; x < 300; x += 30) {
      for (let y = 15; y < 420; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Inner gold border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 268, 388);

    // Secondary crisp border
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(24, 24, 252, 372);

    // Center circular medallion
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(150, 190, 68, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Central Question Mark "?"
    ctx.fillStyle = '#F59E0B';
    ctx.font = '900 86px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 150, 186);

    // "BOOKLOOP" branding banner
    ctx.fillStyle = '#38BDF8';
    ctx.font = '800 16px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('BOOKLOOP', 150, 296);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 13px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('SURPRISE PICK', 150, 324);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Dynamic Light Streak / Speed lines texture (inspired by motion.dev crisp anime/comic speed lines)
 * Clean solid crisp lines on transparent canvas, NO BLUR/GLOW
 */
function createLightStreaksTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    ctx.translate(256, 256);

    // 16 dynamic radial speed streak needles
    const streakCount = 16;
    const colors = ['#38BDF8', '#F59E0B', '#60A5FA', '#FBBF24', '#93C5FD'];

    for (let i = 0; i < streakCount; i++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * i) / streakCount + (i % 2 === 0 ? 0.08 : -0.05));
      ctx.fillStyle = colors[i % colors.length];

      // Elongated tapered needle streak
      const rInner = 80 + (i % 3) * 25;
      const rOuter = 230 + (i % 4) * 18;
      const width = (i % 2 === 0) ? 5 : 3;

      ctx.beginPath();
      ctx.moveTo(-width / 2, rInner);
      ctx.lineTo(width / 2, rInner);
      ctx.lineTo(0, rOuter);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const BookDiscoveryScene: React.FC<BookDiscoverySceneProps> = ({
  state,
  selectedBook,
  currentCyclingBook,
  candidateBooks,
  isReducedMotion,
  onSceneClick,
  onPointerEnter,
  onPointerLeave,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const sceneStateRef = useRef({
    state,
    isReducedMotion,
    currentBook: currentCyclingBook,
    selectedBook,
  });

  useEffect(() => {
    sceneStateRef.current = {
      state,
      isReducedMotion,
      currentBook: currentCyclingBook,
      selectedBook,
    };
  }, [state, isReducedMotion, currentCyclingBook, selectedBook]);

  const coverTextureCacheRef = useRef<Map<string, THREE.Texture>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Viewport dimensions
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 220;
    const aspect = width / height;
    const frustumSize = 4.2;

    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Scene & Renderer (NO BLOOM, NO POST-PROCESSING, 60 FPS SOLID SHAPES)
    const scene = new THREE.Scene();
    scene.background = null;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    // =========================================================================
    // 1. DUAL COUNTER-ROTATING ORBIT RINGS (Intricate Celestial Clockwork)
    // =========================================================================
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, -0.05, 0.05);
    scene.add(ringGroup);

    // Outer Ring (Counter-Clockwise)
    // Particle stars & spark particles (Clean, crisp, dazzling)
    const starCount = 36;
    const starGeo = new THREE.PlaneGeometry(0.1, 0.1);
    const starGroup = new THREE.Group();
    scene.add(starGroup);

    interface StarParticle {
      mesh: THREE.Mesh;
      angle: number;
      dist: number;
      speed: number;
      baseScale: number;
      phase: number;
    }
    const starList: StarParticle[] = [];
    const starColors = ['#F59E0B', '#38BDF8', '#60A5FA', '#F43F5E', '#10B981', '#FBBF24'];

    for (let s = 0; s < starCount; s++) {
      const sMat = new THREE.MeshBasicMaterial({
        color: starColors[s % starColors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const sMesh = new THREE.Mesh(starGeo, sMat);
      starGroup.add(sMesh);
      starList.push({
        mesh: sMesh,
        angle: Math.random() * Math.PI * 2,
        dist: 0.8 + Math.random() * 1.5,
        speed: 0.6 + Math.random() * 1.4,
        baseScale: 0.5 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Outer Ring (Counter-clockwise, dashed)
    const outerRingGeo = new THREE.PlaneGeometry(4.4, 2.2);
    const outerRingTex = createOrbitRingTexture(230, 100, [10, 8], '#93C5FD');
    const outerRingMat = new THREE.MeshBasicMaterial({
      map: outerRingTex,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    ringGroup.add(outerRingMesh);

    // Inner Ring (Clockwise, slightly tilted)
    const innerRingGeo = new THREE.PlaneGeometry(3.6, 1.8);
    const innerRingTex = createOrbitRingTexture(170, 74, [6, 6], '#60A5FA');
    const innerRingMat = new THREE.MeshBasicMaterial({
      map: innerRingTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.z = -0.08;
    ringGroup.add(innerRingMesh);

    // Tertiary Energetic Golden Ring
    const goldRingGeo = new THREE.PlaneGeometry(2.8, 1.4);
    const goldRingTex = createOrbitRingTexture(125, 58, [4, 4], '#F59E0B');
    const goldRingMat = new THREE.MeshBasicMaterial({
      map: goldRingTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const goldRingMesh = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRingMesh.rotation.z = 0.12;
    ringGroup.add(goldRingMesh);

    // =========================================================================
    // 2. SIX CANDIDATE BOOKS WITH DYNAMIC 3D WAVE FLIGHT PATH
    // =========================================================================
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const orbitBookCount = 6;
    const orbitMeshes: THREE.Mesh[] = [];
    const orbitBookGeo = new THREE.PlaneGeometry(0.58, 0.78);
    const orbitColors = ['#1976D2', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#0284C7'];

    for (let i = 0; i < orbitBookCount; i++) {
      const tex = createCandidateBookTexture(orbitColors[i % orbitColors.length], `${i + 1}`);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.92,
      });
      const bMesh = new THREE.Mesh(orbitBookGeo, mat);
      orbitGroup.add(bMesh);
      orbitMeshes.push(bMesh);
    }

    // =========================================================================
    // 3. MAIN CENTER BOOK WITH MULTI-PAGE FLUTTERING MECHANISM
    // =========================================================================
    const centerBookGroup = new THREE.Group();
    centerBookGroup.position.set(0, 0, 0.6);
    scene.add(centerBookGroup);

    // Clean drop shadow (solid oval, NO blur glow)
    const shadowGeo = new THREE.PlaneGeometry(1.65, 0.55);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0F2D4A,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -1.02, -0.1);
    centerBookGroup.add(shadowMesh);

    // Mystery Book Cover Texture for suspense shuffle
    const mysteryCoverTex = createMysteryCoverTexture();

    // Main cover book mesh
    const coverWidth = 1.25;
    const coverHeight = 1.72;
    const mainCoverGeo = new THREE.PlaneGeometry(coverWidth, coverHeight);
    const mainCoverMat = new THREE.MeshBasicMaterial({
      color: 0x1976D2,
      transparent: true,
    });
    const mainCoverMesh = new THREE.Mesh(mainCoverGeo, mainCoverMat);
    centerBookGroup.add(mainCoverMesh);

    // Clean Solid Border Frame
    const borderCanvas = document.createElement('canvas');
    borderCanvas.width = 160;
    borderCanvas.height = 220;
    const bCtx = borderCanvas.getContext('2d');
    if (bCtx) {
      bCtx.lineWidth = 6;
      bCtx.strokeStyle = '#0F2D4A';
      bCtx.strokeRect(3, 3, 154, 214);

      // Gold Spine accent
      bCtx.fillStyle = '#F59E0B';
      bCtx.fillRect(70, 0, 20, 36);
    }
    const borderTex = new THREE.CanvasTexture(borderCanvas);
    const borderMat = new THREE.MeshBasicMaterial({
      map: borderTex,
      transparent: true,
      depthWrite: false,
    });
    const borderMesh = new THREE.Mesh(mainCoverGeo, borderMat);
    borderMesh.position.z = 0.05;
    centerBookGroup.add(borderMesh);

    // 4 Animated Multi-Page Flaps (2 Left Pages, 2 Right Pages for realistic thumb-flip flutter)
    const halfPageGeo = new THREE.PlaneGeometry(coverWidth * 0.48, coverHeight * 0.94);
    const pageMatWhite = new THREE.MeshBasicMaterial({
      color: 0xFFFDF7,
      side: THREE.DoubleSide,
    });
    const pageMatCream = new THREE.MeshBasicMaterial({
      color: 0xFEF3C7,
      side: THREE.DoubleSide,
    });

    const leftPage1 = new THREE.Mesh(halfPageGeo, pageMatWhite);
    leftPage1.position.set(-coverWidth * 0.24, 0, 0.08);
    leftPage1.visible = false;
    centerBookGroup.add(leftPage1);

    const leftPage2 = new THREE.Mesh(halfPageGeo, pageMatCream);
    leftPage2.position.set(-coverWidth * 0.24, 0, 0.09);
    leftPage2.visible = false;
    centerBookGroup.add(leftPage2);

    const rightPage1 = new THREE.Mesh(halfPageGeo, pageMatWhite);
    rightPage1.position.set(coverWidth * 0.24, 0, 0.08);
    rightPage1.visible = false;
    centerBookGroup.add(rightPage1);

    const rightPage2 = new THREE.Mesh(halfPageGeo, pageMatCream);
    rightPage2.position.set(coverWidth * 0.24, 0, 0.09);
    rightPage2.visible = false;
    centerBookGroup.add(rightPage2);

    // Dynamic Golden Bookmark Ribbon Tail
    const ribbonGeo = new THREE.PlaneGeometry(0.16, 0.42);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0xF59E0B,
      side: THREE.DoubleSide,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.position.set(0, 0.92, 0.1);
    centerBookGroup.add(ribbonMesh);

    // =========================================================================
    // 4. COMIC IMPACT ACTION SPOKES (Expand on reveal, ZERO GLOW)
    // =========================================================================
    const impactGeo = new THREE.PlaneGeometry(2.8, 2.8);
    const impactTex = createImpactSpokesTexture();
    const impactMat = new THREE.MeshBasicMaterial({
      map: impactTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const impactMesh = new THREE.Mesh(impactGeo, impactMat);
    impactMesh.position.set(0, 0, 0.15);
    scene.add(impactMesh);

    // =========================================================================
    // 4.1. DYNAMIC LIGHT STREAKS / SPEED LINES (Active during high-velocity shuffle)
    // =========================================================================
    const streakGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const streakTex = createLightStreaksTexture();
    const streakMat = new THREE.MeshBasicMaterial({
      map: streakTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const streakMesh = new THREE.Mesh(streakGeo, streakMat);
    streakMesh.position.set(0, 0.1, 0.12);
    scene.add(streakMesh);

    // =========================================================================
    // 5. 24 COLORFUL FLAT PAPER CONFETTI STRIPS (Burst on Reveal, ZERO GLOW)
    // =========================================================================
    const confettiGroup = new THREE.Group();
    scene.add(confettiGroup);

    interface ConfettiParticle {
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      active: boolean;
      life: number;
    }

    const confettiList: ConfettiParticle[] = [];
    const confettiColors = ['#F43F5E', '#F59E0B', '#1D4ED8', '#10B981', '#38BDF8', '#8B5CF6', '#EC4899', '#FBBF24', '#06B6D4'];
    const confettiGeo = new THREE.PlaneGeometry(0.14, 0.22);

    for (let c = 0; c < 48; c++) {
      const cMat = new THREE.MeshBasicMaterial({
        color: confettiColors[c % confettiColors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const cMesh = new THREE.Mesh(confettiGeo, cMat);
      confettiGroup.add(cMesh);
      confettiList.push({
        mesh: cMesh,
        vx: 0,
        vy: 0,
        vz: 0,
        rotSpeedX: (Math.random() - 0.5) * 16,
        rotSpeedY: (Math.random() - 0.5) * 18,
        rotSpeedZ: (Math.random() - 0.5) * 12,
        active: false,
        life: 0,
      });
    }

    const triggerConfettiBurst = () => {
      confettiList.forEach((p, idx) => {
        p.active = true;
        p.life = 1.2;
        p.mesh.position.set(0, 0.15, 0.75);

        // Spectacular explosive radial fireworks spread
        const angle = (idx / 48) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 2.2 + Math.random() * 2.8;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed * 0.9 + 1.4; // majestic upward lift
        p.vz = (Math.random() - 0.5) * 0.6;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
      });

      // Impact spokes flash
      impactMat.opacity = 1.0;
      impactMesh.scale.set(0.4, 0.4, 1);
    };

    // =========================================================================
    // 6. CUTE READER MASCOT WITH JOYFUL CELEBRATION
    // =========================================================================
    const mascotTexNormal = createMascotTexture('normal');
    const mascotTexAmazed = createMascotTexture('amazed');
    const mascotTexHappy = createMascotTexture('happy');

    const mascotGeo = new THREE.PlaneGeometry(0.92, 0.92);
    const mascotMat = new THREE.MeshBasicMaterial({
      map: mascotTexNormal,
      transparent: true,
      depthWrite: false,
    });
    const mascotMesh = new THREE.Mesh(mascotGeo, mascotMat);
    mascotMesh.position.set(1.55, -0.4, 0.5);
    scene.add(mascotMesh);

    // =========================================================================
    // 7. RENDER LOOP & DYNAMIC KINETIC CHOREOGRAPHY
    // =========================================================================
    let animationFrameId: number;
    let lastTimestamp = performance.now();
    let elapsedTime = 0;
    let currentCoverUrl = '';
    let loadedWinnerTex: THREE.Texture | null = null;
    let orbitAngleOffset = 0;
    let prevSceneState = '';

    const textureLoader = new THREE.TextureLoader();

    const animate = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.1) || 0.016;
      lastTimestamp = timestamp;
      elapsedTime += delta;
      const {
        state: curState,
        isReducedMotion: reduced,
        currentBook,
      } = sceneStateRef.current;

      // Trigger Confetti Burst on enter revealing
      if (curState === 'revealing' && prevSceneState !== 'revealing') {
        triggerConfettiBurst();
      }
      prevSceneState = curState;

      // Update Cover Texture dynamically
      if (currentBook?.cover && currentBook.cover !== currentCoverUrl) {
        currentCoverUrl = currentBook.cover;
        if (coverTextureCacheRef.current.has(currentCoverUrl)) {
          loadedWinnerTex = coverTextureCacheRef.current.get(currentCoverUrl)!;
          if (curState !== 'starting' && curState !== 'shuffling' && curState !== 'slowing' && curState !== 'fake-stop') {
            mainCoverMat.map = loadedWinnerTex;
            mainCoverMat.color.setHex(0xffffff);
            mainCoverMat.needsUpdate = true;
          }
        } else {
          textureLoader.load(
            currentCoverUrl,
            (loadedTex) => {
              loadedTex.colorSpace = THREE.SRGBColorSpace;
              coverTextureCacheRef.current.set(currentCoverUrl, loadedTex);
              loadedWinnerTex = loadedTex;
              if (sceneStateRef.current.state !== 'starting' &&
                  sceneStateRef.current.state !== 'shuffling' &&
                  sceneStateRef.current.state !== 'slowing' &&
                  sceneStateRef.current.state !== 'fake-stop') {
                mainCoverMat.map = loadedTex;
                mainCoverMat.color.setHex(0xffffff);
                mainCoverMat.needsUpdate = true;
              }
            },
            undefined,
            () => {
              mainCoverMat.map = null;
              mainCoverMat.color.setHex(0x1976D2);
              mainCoverMat.needsUpdate = true;
            }
          );
        }
      }

      // Reduced motion fast path
      if (reduced) {
        centerBookGroup.position.set(0, 0, 0.6);
        centerBookGroup.scale.set(1, 1, 1);
        mainCoverMesh.visible = true;
        borderMesh.visible = true;
        streakMat.opacity = 0;
        if (loadedWinnerTex) {
          mainCoverMat.map = loadedWinnerTex;
          mainCoverMat.color.setHex(0xffffff);
          mainCoverMat.needsUpdate = true;
        }
        renderer.render(scene, camera);
        return;
      }

      // =======================================================================
      // KINETIC TIMING & ORBIT PHYSICS
      // =======================================================================
      let orbitSpeed = 0.25;
      let waveAmp = 0.08;

      if (curState === 'starting') {
        orbitSpeed = 0.7;
        waveAmp = 0.12;
      } else if (curState === 'shuffling') {
        orbitSpeed = 3.8; // High-velocity vortex!
        waveAmp = 0.22;
      } else if (curState === 'slowing') {
        orbitSpeed = 0.75;
        waveAmp = 0.14;
      } else if (curState === 'fake-stop') {
        orbitSpeed = 0.04; // Suspense freeze
        waveAmp = 0.02;
      } else if (curState === 'revealing') {
        orbitSpeed = 0.15;
      }

      orbitAngleOffset += delta * orbitSpeed;

      // Rotate dual concentric rings in opposite directions!
      outerRingMesh.rotation.z -= delta * orbitSpeed * 0.6;
      innerRingMesh.rotation.z += delta * orbitSpeed * 0.8;
      goldRingMesh.rotation.z += delta * orbitSpeed * 1.2;

      // Animate Star Sparkles in cosmic swarm
      starList.forEach((star, sIdx) => {
        star.angle += delta * star.speed * (curState === 'shuffling' ? 3.5 : 1.0);
        const curDist = star.dist + Math.sin(elapsedTime * 3 + star.phase) * 0.15;
        const sx = Math.cos(star.angle) * curDist * 1.4;
        const sy = Math.sin(star.angle) * curDist * 0.75;
        const sz = 0.2 + Math.sin(elapsedTime * 4 + sIdx) * 0.1;
        star.mesh.position.set(sx, sy, sz);

        // Twinkle scale & spin
        const twinkle = star.baseScale * (0.7 + Math.sin(elapsedTime * 6 + star.phase) * 0.4);
        star.mesh.scale.set(twinkle, twinkle, 1);
        star.mesh.rotation.z += delta * 2.5;
        (star.mesh.material as THREE.MeshBasicMaterial).opacity =
          curState === 'revealing' || curState === 'result' ? 0.95 : 0.65 + Math.sin(elapsedTime * 5 + star.phase) * 0.3;
      });

      // Orbit candidate books with 3D banking and undulating wave
      const xRadius = 2.05;
      const yRadius = 0.95;

      orbitMeshes.forEach((mesh, idx) => {
        const baseAngle = (idx / orbitBookCount) * Math.PI * 2 + orbitAngleOffset;

        // In fake-stop, move the decoy book to hover prominently in the front
        if (curState === 'fake-stop' && idx === 0) {
          mesh.position.lerp(new THREE.Vector3(0, 0.05, 0.85), 0.15);
          mesh.scale.lerp(new THREE.Vector3(1.15, 1.15, 1), 0.15);
          mesh.rotation.z = Math.sin(elapsedTime * 20) * 0.02; // tense shiver
          (mesh.material as THREE.MeshBasicMaterial).opacity = 1;
        } else {
          const x = Math.cos(baseAngle) * xRadius;
          const y = Math.sin(baseAngle) * yRadius - 0.05 + Math.sin(elapsedTime * 3 + idx) * waveAmp;
          const z = 0.3 + Math.sin(baseAngle) * 0.15;

          mesh.position.set(x, y, z);
          // Banking angle along velocity
          mesh.rotation.z = Math.sin(baseAngle) * 0.18;
          mesh.rotation.y = Math.cos(baseAngle) * 0.25;

          const s = 0.88 + Math.sin(baseAngle) * 0.15;
          mesh.scale.set(s, s, 1);
          (mesh.material as THREE.MeshBasicMaterial).opacity = 0.65 + ((Math.sin(baseAngle) + 1) / 2) * 0.35;
        }
      });

      // =======================================================================
      // MAIN BOOK MULTI-PAGE FLUTTER & KINETIC CHOREOGRAPHY
      // =======================================================================
      // Floating bookmark ribbon wave physics
      ribbonMesh.rotation.z = Math.sin(elapsedTime * 4) * 0.15;
      ribbonMesh.rotation.x = Math.cos(elapsedTime * 3) * 0.2;

      if (curState === 'idle') {
        centerBookGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.05;
        centerBookGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.018;
        centerBookGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);

        mainCoverMesh.visible = true;
        borderMesh.visible = true;
        leftPage1.visible = false;
        leftPage2.visible = false;
        rightPage1.visible = false;
        rightPage2.visible = false;

        streakMat.opacity = 0;

        mascotMesh.position.y = -0.4 + Math.sin(elapsedTime * 2) * 0.03;
        mascotMat.map = mascotTexNormal;
      } else if (curState === 'starting') {
        // Anticipation squash & stretch!
        centerBookGroup.position.y = -0.06;
        centerBookGroup.scale.lerp(new THREE.Vector3(1.06, 0.95, 1), 0.2);
        mainCoverMesh.visible = true;
        borderMesh.visible = true;
        streakMat.opacity = 0;
        mascotMat.map = mascotTexAmazed;
      } else if (curState === 'shuffling') {
        // Surprise Mode: Switch book cover to Mystery Question Mark (? BookLoop)
        // High-velocity flight: Book hovers up, rapid multi-page flutter!
        mainCoverMesh.visible = true;
        borderMesh.visible = true;
        if (mainCoverMat.map !== mysteryCoverTex) {
          mainCoverMat.map = mysteryCoverTex;
          mainCoverMat.color.setHex(0xffffff);
          mainCoverMat.needsUpdate = true;
        }

        centerBookGroup.position.y = 0.12 + Math.sin(elapsedTime * 22) * 0.05;
        centerBookGroup.rotation.z = Math.sin(elapsedTime * 18) * 0.03;
        centerBookGroup.scale.set(1.05, 1.05, 1);

        // High velocity light streaks / speed lines animation
        streakMat.opacity = 0.88;
        streakMesh.rotation.z -= delta * 9.5; // Rapid dynamic rotation
        const pulse = 1.0 + Math.sin(elapsedTime * 28) * 0.12;
        streakMesh.scale.set(pulse, pulse, 1);

        // Multi-page thumb-flip flutter
        leftPage1.visible = true;
        leftPage2.visible = true;
        rightPage1.visible = true;
        rightPage2.visible = true;

        leftPage1.rotation.y = -0.35 + Math.sin(elapsedTime * 26) * 0.25;
        leftPage2.rotation.y = -0.55 + Math.sin(elapsedTime * 24 + 0.5) * 0.2;
        rightPage1.rotation.y = 0.35 + Math.sin(elapsedTime * 26 + 1.0) * 0.25;
        rightPage2.rotation.y = 0.55 + Math.sin(elapsedTime * 24 + 1.5) * 0.2;

        mascotMat.map = mascotTexAmazed;
        mascotMesh.position.y = -0.4 + Math.sin(elapsedTime * 12) * 0.04;
      } else if (curState === 'slowing') {
        // Deceleration: Keep mystery cover on while speed streaks decay
        mainCoverMesh.visible = true;
        borderMesh.visible = true;
        if (mainCoverMat.map !== mysteryCoverTex) {
          mainCoverMat.map = mysteryCoverTex;
          mainCoverMat.color.setHex(0xffffff);
          mainCoverMat.needsUpdate = true;
        }

        streakMat.opacity = Math.max(0, streakMat.opacity - delta * 2.2);
        streakMesh.rotation.z -= delta * 4.0;

        centerBookGroup.position.y = 0.08 + Math.sin(elapsedTime * 8) * 0.03;
        centerBookGroup.rotation.z = Math.sin(elapsedTime * 6) * 0.015;

        leftPage1.rotation.y = -0.3 + Math.sin(elapsedTime * 10) * 0.15;
        leftPage2.rotation.y = -0.45 + Math.sin(elapsedTime * 8) * 0.12;
        rightPage1.rotation.y = 0.3 + Math.sin(elapsedTime * 10) * 0.15;
        rightPage2.rotation.y = 0.45 + Math.sin(elapsedTime * 8) * 0.12;

        mascotMat.map = mascotTexAmazed;
      } else if (curState === 'fake-stop') {
        // Suspense hesitation: complete freeze with mystery cover!
        mainCoverMesh.visible = true;
        borderMesh.visible = true;
        if (mainCoverMat.map !== mysteryCoverTex) {
          mainCoverMat.map = mysteryCoverTex;
          mainCoverMat.color.setHex(0xffffff);
          mainCoverMat.needsUpdate = true;
        }
        streakMat.opacity = 0;

        centerBookGroup.position.y = 0.05;
        centerBookGroup.rotation.z = 0;
        mascotMat.map = mascotTexAmazed;
      } else if (curState === 'revealing') {
        // Spectacular Winner Reveal: Swap to REAL winner cover and leap toward user!
        if (loadedWinnerTex && mainCoverMat.map !== loadedWinnerTex) {
          mainCoverMat.map = loadedWinnerTex;
          mainCoverMat.color.setHex(0xffffff);
          mainCoverMat.needsUpdate = true;
        }
        mainCoverMesh.visible = true;
        borderMesh.visible = true;
        streakMat.opacity = 0;

        centerBookGroup.position.lerp(new THREE.Vector3(0, 0.2, 0.95), 0.18);
        centerBookGroup.scale.lerp(new THREE.Vector3(1.24, 1.24, 1), 0.18);
        centerBookGroup.rotation.z = Math.sin(elapsedTime * 6) * 0.04;
        centerBookGroup.rotation.y = Math.sin(elapsedTime * 4) * 0.08;

        leftPage1.visible = true;
        leftPage2.visible = true;
        rightPage1.visible = true;
        rightPage2.visible = true;

        leftPage1.rotation.y = THREE.MathUtils.lerp(leftPage1.rotation.y, -0.75, 0.18);
        leftPage2.rotation.y = THREE.MathUtils.lerp(leftPage2.rotation.y, -0.95, 0.18);
        rightPage1.rotation.y = THREE.MathUtils.lerp(rightPage1.rotation.y, 0.75, 0.18);
        rightPage2.rotation.y = THREE.MathUtils.lerp(rightPage2.rotation.y, 0.95, 0.18);

        // Mascot jumps high in celebration!
        mascotMat.map = mascotTexHappy;
        mascotMesh.position.y = -0.2 + Math.abs(Math.sin(elapsedTime * 7)) * 0.24;
      } else if (curState === 'result') {
        // Settled proud winner with real book cover and gentle celebratory float
        if (loadedWinnerTex && mainCoverMat.map !== loadedWinnerTex) {
          mainCoverMat.map = loadedWinnerTex;
          mainCoverMat.color.setHex(0xffffff);
          mainCoverMat.needsUpdate = true;
        }
        mainCoverMesh.visible = true;
        borderMesh.visible = true;
        streakMat.opacity = 0;

        centerBookGroup.position.y = 0.1 + Math.sin(elapsedTime * 1.8) * 0.035;
        centerBookGroup.scale.lerp(new THREE.Vector3(1.12, 1.12, 1), 0.1);
        centerBookGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.015;
        centerBookGroup.rotation.y = Math.sin(elapsedTime * 1.5) * 0.03;

        leftPage1.visible = false;
        leftPage2.visible = false;
        rightPage1.visible = false;
        rightPage2.visible = false;

        mascotMat.map = mascotTexHappy;
        mascotMesh.position.y = -0.36 + Math.sin(elapsedTime * 2.2) * 0.04;
      }

      // =======================================================================
      // IMPACT SPOKES & PAPER CONFETTI PHYSICS (NO GLOW, CRISP TUMBLE)
      // =======================================================================
      if (impactMat.opacity > 0.01) {
        impactMat.opacity -= delta * 2.8;
        impactMesh.scale.addScalar(delta * 1.8);
      } else {
        impactMat.opacity = 0;
      }

      confettiList.forEach((p) => {
        if (!p.active) return;

        p.life -= delta * 0.65;
        if (p.life <= 0) {
          p.active = false;
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
          return;
        }

        // Gravity & air drag
        p.vy -= 4.2 * delta;
        p.vx *= 0.98;

        p.mesh.position.x += p.vx * delta;
        p.mesh.position.y += p.vy * delta;
        p.mesh.position.z += p.vz * delta;

        p.mesh.rotation.x += p.rotSpeedX * delta;
        p.mesh.rotation.y += p.rotSpeedY * delta;
        p.mesh.rotation.z += p.rotSpeedZ * delta;

        // Fade out on late life
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(1, p.life * 2);
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Responsive resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      const newAspect = w / h;
      camera.left = (-frustumSize * newAspect) / 2;
      camera.right = (frustumSize * newAspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      outerRingGeo.dispose();
      innerRingGeo.dispose();
      orbitBookGeo.dispose();
      shadowGeo.dispose();
      mainCoverGeo.dispose();
      halfPageGeo.dispose();
      ribbonGeo.dispose();
      impactGeo.dispose();
      streakGeo.dispose();
      confettiGeo.dispose();
      mascotGeo.dispose();

      outerRingMat.dispose();
      innerRingMat.dispose();
      shadowMat.dispose();
      mainCoverMat.dispose();
      borderMat.dispose();
      pageMatWhite.dispose();
      pageMatCream.dispose();
      ribbonMat.dispose();
      impactMat.dispose();
      streakMat.dispose();
      mascotMat.dispose();

      orbitMeshes.forEach((m) => (m.material as THREE.Material).dispose());
      confettiList.forEach((c) => (c.mesh.material as THREE.Material).dispose());

      outerRingTex.dispose();
      innerRingTex.dispose();
      borderTex.dispose();
      impactTex.dispose();
      streakTex.dispose();
      mysteryCoverTex.dispose();
      mascotTexNormal.dispose();
      mascotTexAmazed.dispose();
      mascotTexHappy.dispose();

      coverTextureCacheRef.current.forEach((tex) => tex.dispose());
      coverTextureCacheRef.current.clear();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="presentation"
      aria-hidden="true"
      onClick={onSceneClick}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      className="relative w-full max-w-[560px] h-[270px] sm:h-[300px] md:h-[330px] mx-auto flex items-center justify-center cursor-pointer select-none"
    />
  );
};

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
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 300;
    const aspect = width / height;
    const frustumSize = 5.4;

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
    const outerRingGeo = new THREE.PlaneGeometry(4.8, 2.4);
    const outerRingTex = createOrbitRingTexture(230, 100, [10, 8], '#93C5FD');
    const outerRingMat = new THREE.MeshBasicMaterial({
      map: outerRingTex,
      transparent: true,
      opacity: 0.85,
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
      opacity: 0.65,
      depthWrite: false,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.z = -0.08;
    ringGroup.add(innerRingMesh);

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
    const confettiColors = ['#F43F5E', '#F59E0B', '#1D4ED8', '#10B981', '#38BDF8', '#8B5CF6', '#EC4899'];
    const confettiGeo = new THREE.PlaneGeometry(0.12, 0.18);

    for (let c = 0; c < 24; c++) {
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
        rotSpeedX: (Math.random() - 0.5) * 12,
        rotSpeedY: (Math.random() - 0.5) * 14,
        rotSpeedZ: (Math.random() - 0.5) * 8,
        active: false,
        life: 0,
      });
    }

    const triggerConfettiBurst = () => {
      confettiList.forEach((p, idx) => {
        p.active = true;
        p.life = 1.0;
        p.mesh.position.set(0, 0.2, 0.7);

        // Explosive radial spread
        const angle = (idx / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 1.8 + Math.random() * 2.2;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed * 0.85 + 1.2; // upward lift
        p.vz = (Math.random() - 0.5) * 0.4;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
      });

      // Impact spokes flash
      impactMat.opacity = 0.9;
      impactMesh.scale.set(0.5, 0.5, 1);
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
          mainCoverMat.map = coverTextureCacheRef.current.get(currentCoverUrl)!;
          mainCoverMat.color.setHex(0xffffff);
          mainCoverMat.needsUpdate = true;
        } else {
          textureLoader.load(
            currentCoverUrl,
            (loadedTex) => {
              loadedTex.colorSpace = THREE.SRGBColorSpace;
              coverTextureCacheRef.current.set(currentCoverUrl, loadedTex);
              mainCoverMat.map = loadedTex;
              mainCoverMat.color.setHex(0xffffff);
              mainCoverMat.needsUpdate = true;
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

        leftPage1.visible = false;
        leftPage2.visible = false;
        rightPage1.visible = false;
        rightPage2.visible = false;

        mascotMesh.position.y = -0.4 + Math.sin(elapsedTime * 2) * 0.03;
        mascotMat.map = mascotTexNormal;
      } else if (curState === 'starting') {
        // Anticipation squash & stretch!
        centerBookGroup.position.y = -0.06;
        centerBookGroup.scale.lerp(new THREE.Vector3(1.06, 0.95, 1), 0.2);
        mascotMat.map = mascotTexAmazed;
      } else if (curState === 'shuffling') {
        // High-velocity flight: Book hovers up, rapid multi-page flutter!
        centerBookGroup.position.y = 0.12 + Math.sin(elapsedTime * 22) * 0.05;
        centerBookGroup.rotation.z = Math.sin(elapsedTime * 18) * 0.03;
        centerBookGroup.scale.set(1.05, 1.05, 1);

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
        // Deceleration: Pages gently flutter slower
        centerBookGroup.position.y = 0.08 + Math.sin(elapsedTime * 8) * 0.03;
        centerBookGroup.rotation.z = Math.sin(elapsedTime * 6) * 0.015;

        leftPage1.rotation.y = -0.3 + Math.sin(elapsedTime * 10) * 0.15;
        leftPage2.rotation.y = -0.45 + Math.sin(elapsedTime * 8) * 0.12;
        rightPage1.rotation.y = 0.3 + Math.sin(elapsedTime * 10) * 0.15;
        rightPage2.rotation.y = 0.45 + Math.sin(elapsedTime * 8) * 0.12;

        mascotMat.map = mascotTexAmazed;
      } else if (curState === 'fake-stop') {
        // Suspense hesitation: complete freeze!
        centerBookGroup.position.y = 0.05;
        centerBookGroup.rotation.z = 0;
        mascotMat.map = mascotTexAmazed;
      } else if (curState === 'revealing') {
        // Epic Winner Reveal: Winner book leaps forward with celebratory page fan!
        centerBookGroup.position.lerp(new THREE.Vector3(0, 0.14, 0.8), 0.15);
        centerBookGroup.scale.lerp(new THREE.Vector3(1.18, 1.18, 1), 0.15);
        centerBookGroup.rotation.z = 0;

        leftPage1.visible = true;
        leftPage2.visible = true;
        rightPage1.visible = true;
        rightPage2.visible = true;

        leftPage1.rotation.y = THREE.MathUtils.lerp(leftPage1.rotation.y, -0.65, 0.15);
        leftPage2.rotation.y = THREE.MathUtils.lerp(leftPage2.rotation.y, -0.85, 0.15);
        rightPage1.rotation.y = THREE.MathUtils.lerp(rightPage1.rotation.y, 0.65, 0.15);
        rightPage2.rotation.y = THREE.MathUtils.lerp(rightPage2.rotation.y, 0.85, 0.15);

        // Mascot jumps high in celebration!
        mascotMat.map = mascotTexHappy;
        mascotMesh.position.y = -0.25 + Math.abs(Math.sin(elapsedTime * 6)) * 0.18;
      } else if (curState === 'result') {
        // Settled proud winner
        centerBookGroup.position.y = 0.08 + Math.sin(elapsedTime * 1.5) * 0.03;
        centerBookGroup.scale.lerp(new THREE.Vector3(1.1, 1.1, 1), 0.1);
        centerBookGroup.rotation.z = 0;

        leftPage1.visible = false;
        leftPage2.visible = false;
        rightPage1.visible = false;
        rightPage2.visible = false;

        mascotMat.map = mascotTexHappy;
        mascotMesh.position.y = -0.38 + Math.sin(elapsedTime * 2) * 0.03;
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
      mascotMat.dispose();

      orbitMeshes.forEach((m) => (m.material as THREE.Material).dispose());
      confettiList.forEach((c) => (c.mesh.material as THREE.Material).dispose());

      outerRingTex.dispose();
      innerRingTex.dispose();
      borderTex.dispose();
      impactTex.dispose();
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

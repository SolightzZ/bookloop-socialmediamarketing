import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box } from '@mui/material';

const heroSceneImg = `${import.meta.env.BASE_URL}images/hero-scene.jpg`;

/**
 * HeroThreeScene
 * Renders the BookLoop Cute 2D Editorial Reading Scene using Three.js WebGL.
 * Features:
 * - 2D multi-plane scene with Orthographic/Perspective Camera
 * - High-resolution textured 2D illustration plane with gentle breathing loop
 * - Realtime 3D/2D origami paper airplane gliding along a flight path
 * - Floating open book in the sky with gentle rocking motion
 * - Twinkling golden star particle system drifting in sunlight
 * - Responsive pointer parallax (camera lerp) with zero CPU lag
 * - Battery-friendly: pauses rendering when scrolled out of viewport
 */
export const HeroThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Dimensions
    const width = container.clientWidth || 580;
    const height = container.clientHeight || 440;

    // 2. Three.js Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 0.6);
    sunLight.position.set(2, 4, 3);
    scene.add(sunLight);

    // 5. Texture Loader & Main 2D Illustration Plane
    const textureLoader = new THREE.TextureLoader();
    let mainIllustrationMesh: THREE.Mesh | null = null;

    textureLoader.load(heroSceneImg, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // 4:3 Aspect Ratio for the 2D illustration plane
      const planeGeo = new THREE.PlaneGeometry(4.4, 3.3);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });

      mainIllustrationMesh = new THREE.Mesh(planeGeo, planeMat);
      mainIllustrationMesh.position.set(0, 0, 0);
      scene.add(mainIllustrationMesh);
    });

    // 6. Interactive 3D/2D Origami Paper Plane (Built with Three.js triangles)
    const paperPlaneGroup = new THREE.Group();

    // Wings Geometry
    const wingGeo = new THREE.BufferGeometry();
    const wingVertices = new Float32Array([
      // Left Wing
      0, 0, 0,
      -0.42, -0.12, 0.22,
      0, 0.04, 0.44,

      // Right Wing
      0, 0, 0,
      0, 0.04, 0.44,
      0.42, -0.12, 0.22,

      // Center Fold / Keel
      0, 0, 0,
      0, -0.15, 0.32,
      0, 0.04, 0.44,
    ]);
    wingGeo.setAttribute('position', new THREE.BufferAttribute(wingVertices, 3));
    wingGeo.computeVertexNormals();

    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xfde047, // Bright yellow origami
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const paperPlaneMesh = new THREE.Mesh(wingGeo, planeMaterial);
    paperPlaneGroup.add(paperPlaneMesh);
    paperPlaneGroup.scale.set(0.65, 0.65, 0.65);
    paperPlaneGroup.position.set(0.8, 0.8, 0.3);
    scene.add(paperPlaneGroup);

    // 7. Floating Magical Open Book (Top Right Sky)
    const bookGroup = new THREE.Group();
    const pageMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, side: THREE.DoubleSide });
    const coverMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });

    // Left Page
    const leftPageGeo = new THREE.PlaneGeometry(0.3, 0.4);
    const leftPage = new THREE.Mesh(leftPageGeo, pageMat);
    leftPage.position.set(-0.15, 0, 0);
    leftPage.rotation.y = 0.25;
    bookGroup.add(leftPage);

    // Right Page
    const rightPageGeo = new THREE.PlaneGeometry(0.3, 0.4);
    const rightPage = new THREE.Mesh(rightPageGeo, pageMat);
    rightPage.position.set(0.15, 0, 0);
    rightPage.rotation.y = -0.25;
    bookGroup.add(rightPage);

    // Book Cover Spine
    const spineGeo = new THREE.PlaneGeometry(0.64, 0.42);
    const spine = new THREE.Mesh(spineGeo, coverMat);
    spine.position.set(0, 0, -0.01);
    bookGroup.add(spine);

    bookGroup.position.set(1.45, 1.15, 0.25);
    bookGroup.scale.set(0.7, 0.7, 0.7);
    scene.add(bookGroup);

    // 8. Golden Twinkling Sparkles & Dust Motes Particle System
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4.6; // X
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.6; // Y
      particlePositions[i * 3 + 2] = Math.random() * 0.8 - 0.1; // Z
      particleSpeeds[i] = 0.2 + Math.random() * 0.4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom Canvas Circular Sparkle Texture
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 220, 100, 1)');
      gradient.addColorStop(0.4, 'rgba(245, 158, 11, 0.8)');
      gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Parallax Mouse Motion
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = -y * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 10. Visibility Observer (Pause when off-screen)
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 11. Render Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Camera Parallax Lerp
      targetCamX = mouseX * 0.28;
      targetCamY = mouseY * 0.22;
      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.lookAt(0, 0, 0);

      // Subtle Breathing Scale on Main Illustration
      if (mainIllustrationMesh) {
        const breathe = 1 + Math.sin(elapsedTime * 1.6) * 0.006;
        mainIllustrationMesh.scale.set(breathe, breathe, 1);
      }

      // Paper Plane Flight Animation (Figure-eight gliding)
      const planeAngle = elapsedTime * 0.7;
      paperPlaneGroup.position.x = 0.85 + Math.cos(planeAngle) * 0.35;
      paperPlaneGroup.position.y = 0.85 + Math.sin(planeAngle * 2) * 0.12;
      paperPlaneGroup.rotation.z = -Math.PI / 4 + Math.sin(planeAngle) * 0.2;
      paperPlaneGroup.rotation.x = Math.cos(planeAngle) * 0.15;

      // Floating Book Bobbing & Rocking
      bookGroup.position.y = 1.15 + Math.sin(elapsedTime * 1.4) * 0.08;
      bookGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.08;

      // Drifting Golden Sparkles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Drift upward
        positions[i * 3 + 1] += particleSpeeds[i] * 0.003;
        // Sway gently on X
        positions[i * 3] += Math.sin(elapsedTime + i) * 0.001;

        // Reset if drifted too high
        if (positions[i * 3 + 1] > 1.9) {
          positions[i * 3 + 1] = -1.9;
          positions[i * 3] = (Math.random() - 0.5) * 4.6;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 13. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js resources
      wingGeo.dispose();
      planeMaterial.dispose();
      leftPageGeo.dispose();
      rightPageGeo.dispose();
      spineGeo.dispose();
      pageMat.dispose();
      coverMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <Box
      ref={mountRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        '& canvas': {
          width: '100% !important',
          height: '100% !important',
          display: 'block',
          outline: 'none',
        },
      }}
    />
  );
};

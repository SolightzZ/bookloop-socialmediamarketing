import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// Lightweight three.js-only replacements for drei's Float — keeps
// @react-three/drei (~40KB gzip) out of the discovery chunk.
import { Float } from './threeFx';
import { BookDiscoverySceneProps } from './bookDiscovery.types';

// =============================================================================
// SILENCE THREE.Clock DEPRECATION WARNING (Emitted internally by @react-three/fiber v9)
// =============================================================================
if (typeof window !== 'undefined') {
   const originalWarn = console.warn;
   console.warn = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('Clock: This module has been deprecated')) {
         return;
      }
      originalWarn.apply(console, args);
   };
}

// =============================================================================
// GLOBAL PERFORMANCE TEXTURE CACHE & SINGLETON PROCEDURAL TEXTURES
// =============================================================================
const textureCache = new Map<string, THREE.Texture>();

let cachedMysteryCoverTex: THREE.CanvasTexture | null = null;
let cachedPageEdgesTex: THREE.CanvasTexture | null = null;
let cachedSummoningRingTex: THREE.CanvasTexture | null = null;
let cachedShockwaveTex: THREE.CanvasTexture | null = null;
let cachedBeamTex: THREE.CanvasTexture | null = null;
let cachedGachaCardTextures: THREE.CanvasTexture[] | null = null;
let cachedShadowTex: THREE.CanvasTexture | null = null;

// =============================================================================
// PROCEDURAL TEXTURE GENERATORS (Cached & High-DPI Optimized)
// =============================================================================

const logoImgUrl = `${import.meta.env.BASE_URL}images/logo.webp`;
let preloadedLogoImg: HTMLImageElement | null = null;
if (typeof window !== 'undefined') {
   preloadedLogoImg = new Image();
   preloadedLogoImg.crossOrigin = 'anonymous';
   preloadedLogoImg.src = logoImgUrl;
}

function getOrCreateMysteryCoverTexture(): THREE.CanvasTexture {
   if (cachedMysteryCoverTex) return cachedMysteryCoverTex;

   const canvas = document.createElement('canvas');
   canvas.width = 512;
   canvas.height = 720;
   const ctx = canvas.getContext('2d');

   const renderMedallionAndLogo = (img?: HTMLImageElement | null) => {
      if (!ctx) return;
      // Center circular seal medallion base
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(266, 310, 88, 0, Math.PI * 2);
      ctx.fill();

      if (img && img.complete && img.naturalWidth > 0) {
         ctx.beginPath();
         ctx.arc(266, 310, 84, 0, Math.PI * 2);
         ctx.clip();

         // Properly scaled and centered BookLoop logo
         const logoSize = 144;
         ctx.drawImage(img, 266 - logoSize / 2, 310 - logoSize / 2, logoSize, logoSize);
      }
      ctx.restore();

      // Medallion inner blue border
      ctx.strokeStyle = '#1677E8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(266, 310, 88, 0, Math.PI * 2);
      ctx.stroke();

      // Medallion outer gold ring
      ctx.strokeStyle = '#FCD34D';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(266, 310, 96, 0, Math.PI * 2);
      ctx.stroke();
   };

   if (ctx) {
      // Rich BookLoop Blue gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 512, 720);
      bgGradient.addColorStop(0, '#1E88E5');
      bgGradient.addColorStop(0.5, '#1677E8');
      bgGradient.addColorStop(1, '#0D47A1');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 512, 720);

      // Spine binding strip shadow
      const spineGrad = ctx.createLinearGradient(0, 0, 48, 0);
      spineGrad.addColorStop(0, 'rgba(10, 25, 47, 0.45)');
      spineGrad.addColorStop(0.7, 'rgba(10, 25, 47, 0.15)');
      spineGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spineGrad;
      ctx.fillRect(0, 0, 48, 720);

      // Outer gold foil double frame
      ctx.strokeStyle = '#FEEBC8';
      ctx.lineWidth = 4;
      ctx.strokeRect(58, 40, 406, 640);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(68, 50, 386, 620);

      // Corner filigree accents
      const corners = [
         [68, 50],
         [454, 50],
         [68, 670],
         [454, 670],
      ];
      ctx.fillStyle = '#FEEBC8';
      corners.forEach(([x, y]) => {
         ctx.beginPath();
         ctx.arc(x, y, 6, 0, Math.PI * 2);
         ctx.fill();
      });

      // Render medallion with BookLoop logo
      renderMedallionAndLogo(preloadedLogoImg);

      // Brand Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 24px "Segoe UI", sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillText('BOOKLOOP', 266, 470);

      ctx.fillStyle = '#BFDBFE';
      ctx.font = '600 16px "Segoe UI", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('GACHA CURATION', 266, 506);

      ctx.fillStyle = 'rgba(254, 235, 200, 0.8)';
      ctx.font = '500 13px sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('LIMITED EDITION ARCHIVE', 266, 536);
   }

   const texture = new THREE.CanvasTexture(canvas);
   texture.colorSpace = THREE.SRGBColorSpace;
   texture.minFilter = THREE.LinearFilter;
   texture.generateMipmaps = false;
   cachedMysteryCoverTex = texture;

   // If the logo wasn't fully loaded at first draw, update texture once it finishes loading
   if (preloadedLogoImg && (!preloadedLogoImg.complete || preloadedLogoImg.naturalWidth === 0)) {
      preloadedLogoImg.onload = () => {
         if (ctx) {
            renderMedallionAndLogo(preloadedLogoImg);
            texture.needsUpdate = true;
         }
      };
   }

   return texture;
}

function getOrCreatePageEdgesTexture(): THREE.CanvasTexture {
   if (cachedPageEdgesTex) return cachedPageEdgesTex;

   const canvas = document.createElement('canvas');
   canvas.width = 128;
   canvas.height = 128;
   const ctx = canvas.getContext('2d');

   if (ctx) {
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, 128, 128);

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      for (let y = 3; y < 128; y += 4) {
         ctx.beginPath();
         ctx.moveTo(0, y);
         ctx.lineTo(128, y);
         ctx.stroke();
      }
   }

   const texture = new THREE.CanvasTexture(canvas);
   texture.colorSpace = THREE.SRGBColorSpace;
   texture.wrapS = THREE.RepeatWrapping;
   texture.wrapT = THREE.RepeatWrapping;
   texture.repeat.set(1, 4);
   texture.minFilter = THREE.LinearFilter;
   texture.generateMipmaps = false;
   cachedPageEdgesTex = texture;
   return texture;
}

function getOrCreateSummoningRingTexture(): THREE.CanvasTexture {
   if (cachedSummoningRingTex) return cachedSummoningRingTex;

   const canvas = document.createElement('canvas');
   canvas.width = 384;
   canvas.height = 384;
   const ctx = canvas.getContext('2d');

   if (ctx) {
      ctx.clearRect(0, 0, 384, 384);

      const cx = 192;
      const cy = 192;

      // Outer glowing rings
      ctx.strokeStyle = 'rgba(22, 119, 232, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 175, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 163, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(252, 211, 77, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 135, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(22, 119, 232, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 105, 0, Math.PI * 2);
      ctx.stroke();

      // 24 Radial tick marks
      for (let i = 0; i < 24; i++) {
         const angle = (i / 24) * Math.PI * 2;
         const r1 = i % 2 === 0 ? 163 : 168;
         const r2 = 175;
         ctx.beginPath();
         ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
         ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
         ctx.strokeStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(252, 211, 77, 0.65)';
         ctx.lineWidth = i % 2 === 0 ? 2.5 : 1.5;
         ctx.stroke();
      }

      // 8 Celestial Stars / Diamond Runes
      for (let i = 0; i < 8; i++) {
         const angle = (i / 8) * Math.PI * 2;
         const rx = cx + Math.cos(angle) * 148;
         const ry = cy + Math.sin(angle) * 148;
         ctx.fillStyle = 'rgba(252, 211, 77, 0.8)';
         ctx.beginPath();
         ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
         ctx.fill();
      }
   }

   const texture = new THREE.CanvasTexture(canvas);
   texture.colorSpace = THREE.SRGBColorSpace;
   texture.minFilter = THREE.LinearFilter;
   texture.generateMipmaps = false;
   cachedSummoningRingTex = texture;
   return texture;
}

function getOrCreateShockwaveTexture(): THREE.CanvasTexture {
   if (cachedShockwaveTex) return cachedShockwaveTex;

   const canvas = document.createElement('canvas');
   canvas.width = 192;
   canvas.height = 192;
   const ctx = canvas.getContext('2d');

   if (ctx) {
      const cx = 96;
      const cy = 96;
      const grad = ctx.createRadialGradient(cx, cy, 65, cx, cy, 94);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.65, 'rgba(252, 211, 77, 0.85)');
      grad.addColorStop(0.85, 'rgba(56, 189, 248, 0.95)');
      grad.addColorStop(1, 'rgba(22, 119, 232, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 94, 0, Math.PI * 2);
      ctx.fill();
   }

   const texture = new THREE.CanvasTexture(canvas);
   texture.colorSpace = THREE.SRGBColorSpace;
   texture.minFilter = THREE.LinearFilter;
   texture.generateMipmaps = false;
   cachedShockwaveTex = texture;
   return texture;
}

function getOrCreateBeamTexture(): THREE.CanvasTexture {
   if (cachedBeamTex) return cachedBeamTex;

   const canvas = document.createElement('canvas');
   canvas.width = 64;
   canvas.height = 256;
   const ctx = canvas.getContext('2d');

   if (ctx) {
      const grad = ctx.createLinearGradient(0, 256, 0, 0);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
      grad.addColorStop(0.3, 'rgba(22, 119, 232, 0.35)');
      grad.addColorStop(0.8, 'rgba(252, 211, 77, 0.15)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 256);
   }

   const texture = new THREE.CanvasTexture(canvas);
   texture.colorSpace = THREE.SRGBColorSpace;
   texture.minFilter = THREE.LinearFilter;
   texture.generateMipmaps = false;
   cachedBeamTex = texture;
   return texture;
}

function createGachaCardTexture(bgGradStart: string, bgGradEnd: string, label: string): THREE.CanvasTexture {
   const canvas = document.createElement('canvas');
   canvas.width = 140;
   canvas.height = 195;
   const ctx = canvas.getContext('2d');

   if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 140, 195);
      grad.addColorStop(0, bgGradStart);
      grad.addColorStop(1, bgGradEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 140, 195);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, 14, 195);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(20, 14, 106, 167);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(24, 18, 98, 159);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 14px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '1.8px';
      ctx.fillText(label, 73, 102);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '700 9px sans-serif';
      ctx.letterSpacing = '1.2px';
      ctx.fillText('BOOKLOOP', 73, 118);
   }

   const texture = new THREE.CanvasTexture(canvas);
   texture.colorSpace = THREE.SRGBColorSpace;
   texture.minFilter = THREE.LinearFilter;
   texture.generateMipmaps = false;
   return texture;
}

function getOrCreateGachaCardTextures(): THREE.CanvasTexture[] {
   if (cachedGachaCardTextures) return cachedGachaCardTextures;

   const cardPalette = [
      ['#1677E8', '#0D47A1', 'LUCKY'],
      ['#10B981', '#047857', 'STORY'],
      ['#F59E0B', '#B45309', 'RARE'],
      ['#8B5CF6', '#6D28D9', 'CLASSIC'],
      ['#EC4899', '#BE185D', 'GEM'],
      ['#06B6D4', '#0E7490', 'TREND'],
      ['#3B82F6', '#1D4ED8', 'BEST'],
      ['#14B8A6', '#0F766E', 'WISH'],
   ];

   cachedGachaCardTextures = cardPalette.map(([c1, c2, label]) => createGachaCardTexture(c1, c2, label));
   return cachedGachaCardTextures;
}

function getOrCreateRadialShadowTexture(): THREE.CanvasTexture {
   if (cachedShadowTex) return cachedShadowTex;

   const canvas = document.createElement('canvas');
   canvas.width = 128;
   canvas.height = 128;
   const ctx = canvas.getContext('2d');

   if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, 'rgba(15, 45, 74, 0.45)');
      grad.addColorStop(0.45, 'rgba(15, 45, 74, 0.16)');
      grad.addColorStop(1, 'rgba(15, 45, 74, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 60, 0, Math.PI * 2);
      ctx.fill();
   }

   const texture = new THREE.CanvasTexture(canvas);
   texture.minFilter = THREE.LinearFilter;
   texture.generateMipmaps = false;
   cachedShadowTex = texture;
   return texture;
}

// =============================================================================
// 3D BOOK WITH HINGED COVER & TURNING PAGES (R3F Component)
// =============================================================================

interface BookMeshProps {
   state: string;
   mysteryCoverTex: THREE.Texture;
   pageEdgesTex: THREE.Texture;
   winnerCoverTex: THREE.Texture | null;
   pointerRef: React.MutableRefObject<{ currentX: number; currentY: number }>;
   isReducedMotion?: boolean;
}

const BookMesh: React.FC<BookMeshProps> = React.memo(({ state, mysteryCoverTex, pageEdgesTex, winnerCoverTex, pointerRef, isReducedMotion = false }) => {
   const bookGroupRef = useRef<THREE.Group>(null);
   const frontCoverPivotRef = useRef<THREE.Group>(null);
   const frontCoverMatRef = useRef<THREE.MeshStandardMaterial>(null);
   const ribbonRef = useRef<THREE.Mesh>(null);
   const page1Ref = useRef<THREE.Group>(null);
   const page2Ref = useRef<THREE.Group>(null);
   const page3Ref = useRef<THREE.Group>(null);

   const rotSpeedRef = useRef(0);
   const currentRotYRef = useRef(0);
   const targetRotYRef = useRef(0);
   const prevStateRef = useRef(state);

   const bWidth = 1.48;
   const bHeight = 2.08;
   const bThickness = 0.24;

   useEffect(() => {
      if (prevStateRef.current !== 'revealing' && state === 'revealing') {
         const cur = currentRotYRef.current;
         // Seamlessly target the next forward-facing revolution without snapping backwards
         targetRotYRef.current = Math.ceil((cur - 0.15) / (Math.PI * 2)) * (Math.PI * 2) + 0.15;
      }
      prevStateRef.current = state;
   }, [state]);

   useFrame((stateContext, delta) => {
      const time = stateContext.clock.getElapsedTime();
      const book = bookGroupRef.current;
      const coverPivot = frontCoverPivotRef.current;
      const frontMat = frontCoverMatRef.current;
      const ribbon = ribbonRef.current;
      const pointer = pointerRef.current;

      if (!book || !coverPivot) return;

      // Flutter ribbon gently
      if (ribbon) {
         ribbon.rotation.z = Math.sin(time * 2.5) * 0.1;
      }

      // Accessible Reduced Motion Path
      if (isReducedMotion) {
         if (state === 'revealing' || state === 'result') {
            if (winnerCoverTex && frontMat && frontMat.map !== winnerCoverTex) {
               frontMat.map = winnerCoverTex;
               frontMat.needsUpdate = true;
            }
            book.position.y = THREE.MathUtils.damp(book.position.y, 0.08, 5, delta);
            book.position.z = THREE.MathUtils.damp(book.position.z, 0.45, 5, delta);
            book.rotation.y = THREE.MathUtils.damp(book.rotation.y, 0.12, 5, delta);
            coverPivot.rotation.y = THREE.MathUtils.damp(coverPivot.rotation.y, 0, 5, delta);
         } else {
            if (frontMat && frontMat.map !== mysteryCoverTex) {
               frontMat.map = mysteryCoverTex;
               frontMat.needsUpdate = true;
            }
            book.position.y = Math.sin(time * 1.2) * 0.03;
            book.position.z = THREE.MathUtils.damp(book.position.z, 0, 5, delta);
            book.rotation.y = THREE.MathUtils.damp(book.rotation.y, 0, 5, delta);
            coverPivot.rotation.y = THREE.MathUtils.damp(coverPivot.rotation.y, 0, 5, delta);
         }
         if (page1Ref.current) page1Ref.current.visible = false;
         if (page2Ref.current) page2Ref.current.visible = false;
         if (page3Ref.current) page3Ref.current.visible = false;
         return;
      }

      // Full Expressive Motion Path
      if (state === 'idle') {
         rotSpeedRef.current = 0;
         targetRotYRef.current = pointer.currentX * 0.32 + Math.sin(time * 1.2) * 0.04;
         currentRotYRef.current = THREE.MathUtils.damp(currentRotYRef.current, targetRotYRef.current, 6, delta);

         book.position.set(0, Math.sin(time * 1.8) * 0.06, 0);
         book.rotation.x = THREE.MathUtils.damp(book.rotation.x, pointer.currentY * 0.18, 6, delta);
         book.rotation.y = currentRotYRef.current;
         book.rotation.z = Math.sin(time * 1.5) * 0.02;

         coverPivot.rotation.y = THREE.MathUtils.damp(coverPivot.rotation.y, 0, 8, delta);

         if (frontMat && frontMat.map !== mysteryCoverTex) {
            frontMat.map = mysteryCoverTex;
            frontMat.needsUpdate = true;
         }

         if (page1Ref.current) page1Ref.current.visible = false;
         if (page2Ref.current) page2Ref.current.visible = false;
         if (page3Ref.current) page3Ref.current.visible = false;
      } else if (state === 'starting') {
         rotSpeedRef.current = THREE.MathUtils.damp(rotSpeedRef.current, 4.8, 3.5, delta);
         currentRotYRef.current += rotSpeedRef.current * delta;

         book.position.y = THREE.MathUtils.damp(book.position.y, 0.38, 4, delta);
         book.position.z = THREE.MathUtils.damp(book.position.z, -0.15, 4, delta);
         book.rotation.x = THREE.MathUtils.damp(book.rotation.x, -0.12, 4, delta);
         book.rotation.y = currentRotYRef.current;
         book.rotation.z = THREE.MathUtils.damp(book.rotation.z, 0, 4, delta);

         if (frontMat && frontMat.map !== mysteryCoverTex) {
            frontMat.map = mysteryCoverTex;
            frontMat.needsUpdate = true;
         }

         coverPivot.rotation.y = THREE.MathUtils.damp(coverPivot.rotation.y, -0.32, 6, delta);

         if (page1Ref.current) {
            page1Ref.current.visible = true;
            page1Ref.current.rotation.y = -0.2 + Math.sin(time * 18) * 0.1;
         }
         if (page2Ref.current) {
            page2Ref.current.visible = true;
            page2Ref.current.rotation.y = -0.35 + Math.sin(time * 16) * 0.1;
         }
         if (page3Ref.current) {
            page3Ref.current.visible = true;
            page3Ref.current.rotation.y = -0.5 + Math.sin(time * 14) * 0.1;
         }
      } else if (state === 'shuffling') {
         rotSpeedRef.current = THREE.MathUtils.damp(rotSpeedRef.current, 7.2, 4, delta);
         currentRotYRef.current += rotSpeedRef.current * delta;

         book.position.y = 0.32 + Math.sin(time * 16) * 0.08;
         book.position.z = THREE.MathUtils.damp(book.position.z, -0.2, 4, delta);
         book.rotation.x = THREE.MathUtils.damp(book.rotation.x, -0.08, 4, delta);
         book.rotation.y = currentRotYRef.current;

         coverPivot.rotation.y = -0.75 + Math.sin(time * 14) * 0.12;

         if (page1Ref.current) {
            page1Ref.current.visible = true;
            page1Ref.current.rotation.y = -0.35 + Math.sin(time * 26) * 0.22;
         }
         if (page2Ref.current) {
            page2Ref.current.visible = true;
            page2Ref.current.rotation.y = -0.55 + Math.sin(time * 24) * 0.18;
         }
         if (page3Ref.current) {
            page3Ref.current.visible = true;
            page3Ref.current.rotation.y = -0.72 + Math.sin(time * 22) * 0.16;
         }
      } else if (state === 'slowing') {
         // Natural exponential deceleration curve
         rotSpeedRef.current = THREE.MathUtils.damp(rotSpeedRef.current, 1.2, 2.8, delta);
         currentRotYRef.current += rotSpeedRef.current * delta;

         book.position.y = THREE.MathUtils.damp(book.position.y, 0.16, 4, delta);
         book.position.z = THREE.MathUtils.damp(book.position.z, 0, 4, delta);
         book.rotation.x = THREE.MathUtils.damp(book.rotation.x, -0.04, 4, delta);
         book.rotation.y = currentRotYRef.current;

         coverPivot.rotation.y = THREE.MathUtils.damp(coverPivot.rotation.y, -0.35, 5, delta);

         if (page1Ref.current) page1Ref.current.rotation.y = THREE.MathUtils.damp(page1Ref.current.rotation.y, -0.2, 5, delta);
         if (page2Ref.current) page2Ref.current.rotation.y = THREE.MathUtils.damp(page2Ref.current.rotation.y, -0.3, 5, delta);
         if (page3Ref.current) page3Ref.current.rotation.y = THREE.MathUtils.damp(page3Ref.current.rotation.y, -0.38, 5, delta);
      } else if (state === 'revealing') {
         if (winnerCoverTex && frontMat && frontMat.map !== winnerCoverTex) {
            frontMat.map = winnerCoverTex;
            frontMat.needsUpdate = true;
         }

         // Smooth glide into the target reveal orientation (zero backward unwind)
         currentRotYRef.current = THREE.MathUtils.damp(currentRotYRef.current, targetRotYRef.current, 7.5, delta);
         book.rotation.y = currentRotYRef.current;
         book.rotation.x = THREE.MathUtils.damp(book.rotation.x, 0, 8, delta);
         book.rotation.z = Math.sin(time * 3.5) * 0.015;

         // Confident forward step toward camera
         book.position.y = THREE.MathUtils.damp(book.position.y, 0.16, 7, delta);
         book.position.z = THREE.MathUtils.damp(book.position.z, 0.78, 7.5, delta);

         coverPivot.rotation.y = THREE.MathUtils.damp(coverPivot.rotation.y, -0.4, 7, delta);

         if (page1Ref.current) {
            page1Ref.current.visible = true;
            page1Ref.current.rotation.y = THREE.MathUtils.damp(page1Ref.current.rotation.y, -0.28, 7, delta);
         }
         if (page2Ref.current) {
            page2Ref.current.visible = true;
            page2Ref.current.rotation.y = THREE.MathUtils.damp(page2Ref.current.rotation.y, -0.2, 7, delta);
         }
      } else if (state === 'result') {
         if (winnerCoverTex && frontMat && frontMat.map !== winnerCoverTex) {
            frontMat.map = winnerCoverTex;
            frontMat.needsUpdate = true;
         }

         const inspectTargetY = targetRotYRef.current + pointer.currentX * 0.24;
         currentRotYRef.current = THREE.MathUtils.damp(currentRotYRef.current, inspectTargetY, 6, delta);

         book.position.y = THREE.MathUtils.damp(book.position.y, Math.sin(time * 1.8) * 0.04, 5, delta);
         book.position.z = THREE.MathUtils.damp(book.position.z, 0.32, 5, delta);
         book.rotation.x = THREE.MathUtils.damp(book.rotation.x, pointer.currentY * 0.16, 6, delta);
         book.rotation.y = currentRotYRef.current;
         book.rotation.z = THREE.MathUtils.damp(book.rotation.z, 0, 6, delta);

         coverPivot.rotation.y = THREE.MathUtils.damp(coverPivot.rotation.y, 0, 6, delta);

         if (page1Ref.current) page1Ref.current.visible = false;
         if (page2Ref.current) page2Ref.current.visible = false;
         if (page3Ref.current) page3Ref.current.visible = false;
      }
   });

   return (
      <group ref={bookGroupRef}>
         {/* Pages Block Core */}
         <mesh position={[bWidth * 0.02, 0, 0]}>
            <boxGeometry args={[bWidth * 0.93, bHeight * 0.96, bThickness * 0.86]} />
            <meshStandardMaterial map={pageEdgesTex} roughness={0.75} color="#fffdf7" />
         </mesh>

         {/* Back Cover */}
         <mesh position={[0, 0, -bThickness / 2 - 0.005]}>
            <planeGeometry args={[bWidth, bHeight]} />
            <meshStandardMaterial color="#0f2d4a" roughness={0.55} metalness={0.05} side={THREE.DoubleSide} />
         </mesh>

         {/* Rounded Spine */}
         <mesh position={[-bWidth / 2, 0, 0]}>
            <cylinderGeometry args={[bThickness / 2, bThickness / 2, bHeight, 16, 1, false, Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#0f2d4a" roughness={0.45} />
         </mesh>

         {/* Hinged Front Cover (Pivot at spine) */}
         <group ref={frontCoverPivotRef} position={[-bWidth / 2, 0, bThickness / 2 + 0.005]}>
            <mesh position={[bWidth / 2, 0, 0]}>
               <planeGeometry args={[bWidth, bHeight]} />
               <meshStandardMaterial ref={frontCoverMatRef} map={mysteryCoverTex} roughness={0.35} metalness={0.08} />
            </mesh>
            <mesh position={[bWidth / 2, 0, -0.002]}>
               <planeGeometry args={[bWidth, bHeight]} />
               <meshStandardMaterial color="#fffdf7" roughness={0.7} side={THREE.BackSide} />
            </mesh>
         </group>

         {/* 3 Turning Pages */}
         <group ref={page1Ref} position={[-bWidth / 2 + 0.04, 0, bThickness / 2 - 0.02]} visible={false}>
            <mesh position={[bWidth * 0.46, 0, 0]}>
               <planeGeometry args={[bWidth * 0.92, bHeight * 0.94]} />
               <meshStandardMaterial color="#fffef9" roughness={0.8} side={THREE.DoubleSide} />
            </mesh>
         </group>

         <group ref={page2Ref} position={[-bWidth / 2 + 0.04, 0, bThickness / 2 - 0.05]} visible={false}>
            <mesh position={[bWidth * 0.46, 0, 0]}>
               <planeGeometry args={[bWidth * 0.92, bHeight * 0.94]} />
               <meshStandardMaterial color="#fffef9" roughness={0.8} side={THREE.DoubleSide} />
            </mesh>
         </group>

         <group ref={page3Ref} position={[-bWidth / 2 + 0.04, 0, bThickness / 2 - 0.08]} visible={false}>
            <mesh position={[bWidth * 0.46, 0, 0]}>
               <planeGeometry args={[bWidth * 0.92, bHeight * 0.94]} />
               <meshStandardMaterial color="#fffef9" roughness={0.8} side={THREE.DoubleSide} />
            </mesh>
         </group>

         {/* Bookmark Ribbon */}
         <mesh ref={ribbonRef} position={[0.18, -bHeight / 2 - 0.28, 0.02]}>
            <planeGeometry args={[0.16, 0.75]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.35} side={THREE.DoubleSide} />
         </mesh>
      </group>
   );
});

// =============================================================================
// 8 ORBITING 3D GACHA TAROT CARDS (Shared Geometry Memory Optimization)
// =============================================================================

interface GachaCardsVortexProps {
   state: string;
   isReducedMotion?: boolean;
}

const GachaCardsVortex: React.FC<GachaCardsVortexProps> = React.memo(({ state, isReducedMotion = false }) => {
   const cardGroupRef = useRef<THREE.Group>(null);
   const cardAngleRef = useRef(0);

   // 1 shared geometry across all 8 cards
   const cardGeometry = useMemo(() => new THREE.PlaneGeometry(0.68, 0.95), []);

   useEffect(() => {
      return () => {
         cardGeometry.dispose();
      };
   }, [cardGeometry]);

   const cardTextures = useMemo(() => getOrCreateGachaCardTextures(), []);

   useFrame((stateContext, delta) => {
      const group = cardGroupRef.current;
      if (!group) return;

      if (isReducedMotion) {
         group.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.opacity = 0;
         });
         return;
      }

      const time = stateContext.clock.getElapsedTime();

      if (state === 'shuffling') {
         cardAngleRef.current += delta * 5.4;
         const radius = 2.1;

         group.children.forEach((child, idx) => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            const isHelix2 = idx % 2 === 1;
            const offsetAngle = (idx / 8) * Math.PI * 2;
            const angle = cardAngleRef.current + offsetAngle;
            const cx = Math.cos(angle) * radius;
            const cy = (isHelix2 ? 0.38 : -0.38) * Math.sin(angle * 1.4) + Math.sin(time * 5 + idx) * 0.15;
            const cz = Math.sin(angle) * 1.4;

            mesh.position.set(cx, cy, cz);
            mesh.rotation.y = -angle + Math.PI / 2;
            mesh.rotation.z = Math.sin(angle) * 0.25;
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.92, 0.15);
         });
      } else if (state === 'slowing') {
         group.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mesh.position.lerp(new THREE.Vector3(0, 0.1, 0), 0.12);
            mat.opacity = THREE.MathUtils.damp(mat.opacity, 0, 5, delta);
         });
      } else {
         group.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.opacity = 0;
         });
      }
   });

   return (
      <group ref={cardGroupRef}>
         {cardTextures.map((tex, idx) => (
            <mesh key={idx} geometry={cardGeometry}>
               <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.45} transparent opacity={0} />
            </mesh>
         ))}
      </group>
   );
});

// =============================================================================
// CELEBRATORY 3D CONFETTI BURST (Shared Geometry Memory Optimization)
// =============================================================================

interface ConfettiBurstProps {
   state: string;
   isReducedMotion?: boolean;
}

const ConfettiBurst: React.FC<ConfettiBurstProps> = React.memo(({ state, isReducedMotion = false }) => {
   const groupRef = useRef<THREE.Group>(null);
   const prevSceneStateRef = useRef(state);

   // 1 shared geometry across all 64 confetti particles
   const confettiGeometry = useMemo(() => new THREE.PlaneGeometry(0.13, 0.17), []);

   useEffect(() => {
      return () => {
         confettiGeometry.dispose();
      };
   }, [confettiGeometry]);

   const confettiData = useMemo(() => {
      const colors = ['#1677E8', '#38BDF8', '#10B981', '#F59E0B', '#FCD34D', '#EC4899', '#FFFFFF'];
      return Array.from({ length: 64 }, (_, i) => ({
         color: colors[i % colors.length],
         vx: 0,
         vy: 0,
         vz: 0,
         rotX: (Math.random() - 0.5) * 15,
         rotY: (Math.random() - 0.5) * 18,
         rotZ: (Math.random() - 0.5) * 14,
         life: 0,
         active: false,
      }));
   }, []);

   const triggerBurst = () => {
      const group = groupRef.current;
      if (!group) return;

      confettiData.forEach((p, idx) => {
         p.active = true;
         p.life = isReducedMotion ? 0.6 : 1.0;
         const angle = Math.random() * Math.PI * 2;
         const elevation = Math.PI * 0.15 + Math.random() * Math.PI * 0.5;
         const speed = isReducedMotion ? 0.6 + Math.random() * 0.8 : 2.4 + Math.random() * 4.2;

         p.vx = Math.cos(angle) * Math.cos(elevation) * speed;
         p.vy = isReducedMotion ? Math.sin(elevation) * speed * 0.6 : Math.sin(elevation) * speed * 1.25;
         p.vz = Math.sin(angle) * Math.cos(elevation) * speed;

         const child = group.children[idx] as THREE.Mesh;
         if (child) {
            child.position.set(0, 0.2, 0.4);
            const mat = child.material as THREE.MeshBasicMaterial;
            mat.opacity = isReducedMotion ? 0.4 : 1;
         }
      });
   };

   useEffect(() => {
      if (prevSceneStateRef.current !== 'revealing' && state === 'revealing') {
         triggerBurst();
      }
      prevSceneStateRef.current = state;
   }, [state]);

   useFrame((_, delta) => {
      const group = groupRef.current;
      if (!group) return;

      confettiData.forEach((p, idx) => {
         if (!p.active) return;

         p.vy -= 9.8 * delta * (isReducedMotion ? 0.4 : 0.85);
         p.vx *= 0.985;
         p.vz *= 0.985;
         p.life -= delta * (isReducedMotion ? 0.9 : 0.55);

         const child = group.children[idx] as THREE.Mesh;
         if (child) {
            child.position.x += p.vx * delta;
            child.position.y += p.vy * delta;
            child.position.z += p.vz * delta;

            child.rotation.x += p.rotX * delta;
            child.rotation.y += p.rotY * delta;
            child.rotation.z += p.rotZ * delta;

            const mat = child.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.max(0, p.life);

            if (p.life <= 0) {
               p.active = false;
            }
         }
      });
   });

   return (
      <group ref={groupRef}>
         {confettiData.map((p, idx) => (
            <mesh key={idx} geometry={confettiGeometry}>
               <meshBasicMaterial color={p.color} side={THREE.DoubleSide} transparent opacity={0} />
            </mesh>
         ))}
      </group>
   );
});

// =============================================================================
// CELESTIAL FLOOR SUMMONING RING
// =============================================================================

interface SummoningSealProps {
   state: string;
   isReducedMotion?: boolean;
}

const SummoningSeal: React.FC<SummoningSealProps> = React.memo(({ state, isReducedMotion = false }) => {
   const ringMeshRef = useRef<THREE.Mesh>(null);
   const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);

   const ringTex = useMemo(() => getOrCreateSummoningRingTexture(), []);

   useFrame((_, delta) => {
      const mesh = ringMeshRef.current;
      const mat = ringMatRef.current;
      if (!mesh || !mat) return;

      if (isReducedMotion) {
         mesh.rotation.z += delta * 0.05;
         mat.opacity = THREE.MathUtils.lerp(mat.opacity, state === 'idle' ? 0.25 : 0.45, 0.08);
         return;
      }

      if (state === 'shuffling') {
         mesh.rotation.z += delta * 4.2;
         mat.opacity = THREE.MathUtils.damp(mat.opacity, 0.95, 6, delta);
      } else if (state === 'starting') {
         mesh.rotation.z += delta * 2.2;
         mat.opacity = THREE.MathUtils.damp(mat.opacity, 0.7, 5, delta);
      } else if (state === 'slowing') {
         mesh.rotation.z += delta * 1.0;
         mat.opacity = THREE.MathUtils.damp(mat.opacity, 0.45, 4, delta);
      } else {
         mesh.rotation.z += delta * 0.45;
         mat.opacity = THREE.MathUtils.damp(mat.opacity, 0.28, 4, delta);
      }
   });

   return (
      <mesh ref={ringMeshRef} position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
         <planeGeometry args={[4.2, 4.2]} />
         <meshBasicMaterial ref={ringMatRef} map={ringTex} transparent opacity={0.3} depthWrite={false} />
      </mesh>
   );
});

// =============================================================================
// EXPANDING SHOCKWAVE ENERGY RINGS (Shared Geometry Optimization)
// =============================================================================

interface ShockwaveRingsProps {
   state: string;
   isReducedMotion?: boolean;
}

const ShockwaveRings: React.FC<ShockwaveRingsProps> = React.memo(({ state, isReducedMotion = false }) => {
   const ring1Ref = useRef<THREE.Mesh>(null);
   const ring2Ref = useRef<THREE.Mesh>(null);
   const animProgressRef = useRef(0);
   const isPlayingRef = useRef(false);
   const prevSceneRef = useRef(state);

   const shockGeometry = useMemo(() => new THREE.PlaneGeometry(1.5, 1.5), []);
   const shockTex = useMemo(() => getOrCreateShockwaveTexture(), []);

   useEffect(() => {
      return () => {
         shockGeometry.dispose();
      };
   }, [shockGeometry]);

   useEffect(() => {
      if (prevSceneRef.current !== 'revealing' && state === 'revealing') {
         animProgressRef.current = 0;
         isPlayingRef.current = true;
      }
      prevSceneRef.current = state;
   }, [state]);

   useFrame((_, delta) => {
      if (!isPlayingRef.current) return;

      animProgressRef.current += delta * 1.5;
      const p1 = Math.min(1, animProgressRef.current);
      const p2 = Math.min(1, Math.max(0, animProgressRef.current - 0.2));

      // Cubic-bezier ease-out curve (1 - (1-p)^3) for natural physical deceleration
      const ease1 = 1 - Math.pow(1 - p1, 3);
      const ease2 = 1 - Math.pow(1 - p2, 3);

      const maxScale1 = isReducedMotion ? 2.5 : 5.2;
      const maxScale2 = isReducedMotion ? 2.0 : 4.4;

      if (ring1Ref.current) {
         const s1 = 0.5 + ease1 * maxScale1;
         ring1Ref.current.scale.set(s1, s1, 1);
         const mat = ring1Ref.current.material as THREE.MeshBasicMaterial;
         mat.opacity = Math.max(0, (1 - p1) * (isReducedMotion ? 0.4 : 0.95));
      }

      if (ring2Ref.current) {
         const s2 = 0.4 + ease2 * maxScale2;
         ring2Ref.current.scale.set(s2, s2, 1);
         const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
         mat.opacity = Math.max(0, (1 - p2) * (isReducedMotion ? 0.35 : 0.85));
      }

      if (animProgressRef.current >= 1.4) {
         isPlayingRef.current = false;
      }
   });

   return (
      <group position={[0, -1.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
         <mesh ref={ring1Ref} geometry={shockGeometry}>
            <meshBasicMaterial map={shockTex} transparent opacity={0} depthWrite={false} />
         </mesh>
         <mesh ref={ring2Ref} geometry={shockGeometry}>
            <meshBasicMaterial map={shockTex} transparent opacity={0} depthWrite={false} />
         </mesh>
      </group>
   );
});

// =============================================================================
// VERTICAL LIGHT BEAMS (Shared Geometry Optimization)
// =============================================================================

interface LightPillarsProps {
   state: string;
   isReducedMotion?: boolean;
}

const LightPillars: React.FC<LightPillarsProps> = React.memo(({ state, isReducedMotion = false }) => {
   const groupRef = useRef<THREE.Group>(null);
   const beamTex = useMemo(() => getOrCreateBeamTexture(), []);
   const pillarGeometry = useMemo(() => new THREE.PlaneGeometry(0.35, 3.2), []);

   useEffect(() => {
      return () => {
         pillarGeometry.dispose();
      };
   }, [pillarGeometry]);

   const pillarOffsets = useMemo(() => {
      return Array.from({ length: 6 }, (_, i) => {
         const angle = (i / 6) * Math.PI * 2;
         return {
            x: Math.cos(angle) * 1.9,
            z: Math.sin(angle) * 1.9,
            phase: i * 1.1,
         };
      });
   }, []);

   useFrame((stateCtx, delta) => {
      const group = groupRef.current;
      if (!group) return;

      const time = stateCtx.clock.getElapsedTime();
      const rotSpeed = isReducedMotion ? 0.08 : state === 'shuffling' ? 1.8 : 0.4;
      group.rotation.y += delta * rotSpeed;

      const isSummoning = state === 'starting' || state === 'shuffling';
      const targetOpacity = isReducedMotion ? (isSummoning ? 0.35 : 0.05) : isSummoning ? 0.75 : 0.08;

      group.children.forEach((child, i) => {
         const mesh = child as THREE.Mesh;
         const mat = mesh.material as THREE.MeshBasicMaterial;
         const flicker = isReducedMotion ? 0 : Math.sin(time * 6 + pillarOffsets[i].phase) * 0.15;
         mat.opacity = THREE.MathUtils.lerp(mat.opacity, Math.max(0, targetOpacity + flicker), 0.1);
      });
   });

   return (
      <group ref={groupRef} position={[0, -1.35, 0]}>
         {pillarOffsets.map((p, i) => (
            <mesh key={i} position={[p.x, 1.5, p.z]} geometry={pillarGeometry}>
               <meshBasicMaterial map={beamTex} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
         ))}
      </group>
   );
});

// =============================================================================
// DYNAMIC CINEMATIC LIGHTING
// =============================================================================

interface DynamicLightingProps {
   state: string;
}

const DynamicLighting: React.FC<DynamicLightingProps> = React.memo(({ state }) => {
   const flashLightRef = useRef<THREE.PointLight>(null);

   useFrame((_, delta) => {
      const light = flashLightRef.current;
      if (!light) return;

      if (state === 'revealing') {
         light.intensity = THREE.MathUtils.lerp(light.intensity, 3.8, 0.25);
         light.color.set('#F59E0B');
      } else if (state === 'shuffling') {
         light.intensity = THREE.MathUtils.lerp(light.intensity, 2.4, 0.15);
         light.color.set('#0284C7');
      } else if (state === 'starting') {
         light.intensity = THREE.MathUtils.lerp(light.intensity, 1.6, 0.1);
         light.color.set('#0EA5E9');
      } else {
         light.intensity = THREE.MathUtils.lerp(light.intensity, 0.8, 0.08);
         light.color.set('#38BDF8');
      }
   });

   return (
      <>
         <ambientLight intensity={1.4} />
         <directionalLight position={[4, 6, 4]} intensity={2.0} color="#FFFFFF" />
         <directionalLight position={[-4, 2, 3]} intensity={1.1} color="#E0F2FE" />
         <pointLight ref={flashLightRef} position={[0, 0.8, 1.8]} intensity={0.8} color="#38BDF8" distance={9} />
      </>
   );
});

// =============================================================================
// RESPONSIVE CAMERA RIG (Dynamic FOV & Distance for Mobile/Tablet/Desktop)
// =============================================================================

const CameraRig: React.FC = () => {
   const { camera, size } = useThree();

   useEffect(() => {
      const aspect = size.width / size.height;
      if (aspect < 1.0) {
         camera.position.set(0, 0.2, 6.8 + (1.0 - aspect) * 2.2);
      } else if (aspect < 1.35) {
         camera.position.set(0, 0.2, 6.4);
      } else {
         camera.position.set(0, 0.2, 5.8);
      }
      camera.updateProjectionMatrix();
   }, [camera, size]);

   return null;
};

// =============================================================================
// MAIN BookGachaScene EXPORT (High-Performance R3F Component)
// =============================================================================

export const BookGachaScene: React.FC<BookDiscoverySceneProps> = ({ state, selectedBook, currentCyclingBook, candidateBooks, isReducedMotion, onSceneClick, onPointerEnter, onPointerLeave }) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const rectRef = useRef<DOMRect | null>(null);
   const pointerRef = useRef({ currentX: 0, currentY: 0 });
   const [winnerCoverTex, setWinnerCoverTex] = useState<THREE.Texture | null>(null);
   const [isVisible, setIsVisible] = useState(true);

   // Auto-pause WebGL when off-screen to save 100% GPU/CPU & battery
   useEffect(() => {
      const el = containerRef.current;
      if (!el || typeof IntersectionObserver === 'undefined') return;

      const observer = new IntersectionObserver(
         ([entry]) => {
            setIsVisible(entry.isIntersecting);
         },
         { threshold: 0.05, rootMargin: '120px' },
      );
      observer.observe(el);
      return () => observer.disconnect();
   }, []);

   const mysteryCoverTex = useMemo(() => getOrCreateMysteryCoverTexture(), []);
   const pageEdgesTex = useMemo(() => getOrCreatePageEdgesTexture(), []);
   const floorShadowTex = useMemo(() => getOrCreateRadialShadowTexture(), []);

   // Texture loader with memory cache to avoid repeated image decoding & downloads
   const currentCoverUrl = currentCyclingBook?.cover || selectedBook?.cover;

   useEffect(() => {
      if (!currentCoverUrl) return;

      if (textureCache.has(currentCoverUrl)) {
         setWinnerCoverTex(textureCache.get(currentCoverUrl)!);
         return;
      }

      const loader = new THREE.TextureLoader();
      loader.load(currentCoverUrl, (tex) => {
         tex.colorSpace = THREE.SRGBColorSpace;
         tex.minFilter = THREE.LinearFilter;
         tex.generateMipmaps = false;
         textureCache.set(currentCoverUrl, tex);
         setWinnerCoverTex(tex);
      });
   }, [currentCoverUrl]);

   // Pointer move handlers mutate pointerRef directly with cached rect (0 forced reflow, 0 React re-renders)
   const handlePointerEnter = () => {
      if (containerRef.current) {
         rectRef.current = containerRef.current.getBoundingClientRect();
      }
      onPointerEnter?.();
   };

   const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!rectRef.current && containerRef.current) {
         rectRef.current = containerRef.current.getBoundingClientRect();
      }
      const rect = rectRef.current;
      if (!rect || rect.width === 0 || rect.height === 0) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      pointerRef.current.currentX = ((clientX - rect.left) / rect.width - 0.5) * 2;
      pointerRef.current.currentY = ((clientY - rect.top) / rect.height - 0.5) * 2;
   };

   const handlePointerLeave = () => {
      rectRef.current = null;
      pointerRef.current.currentX = 0;
      pointerRef.current.currentY = 0;
      onPointerLeave?.();
   };

   return (
      <div
         ref={containerRef}
         role="button"
         tabIndex={0}
         aria-label="คลิกเพื่อสุ่มหนังสือแบบ 3D Gacha Animation ด้วย React Three Fiber"
         onClick={onSceneClick}
         onMouseEnter={handlePointerEnter}
         onMouseLeave={handlePointerLeave}
         onMouseMove={handlePointerMove}
         onTouchStart={handlePointerMove}
         onTouchMove={handlePointerMove}
         onTouchEnd={handlePointerLeave}
         onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
               e.preventDefault();
               onSceneClick?.();
            }
         }}
         className="relative w-full max-w-[620px] h-[300px] sm:h-[350px] md:h-[390px] mx-auto flex items-center justify-center cursor-pointer select-none outline-none bg-transparent">
         <Canvas
            frameloop={isVisible || state !== 'idle' ? 'always' : 'never'}
            camera={{ position: [0, 0.2, 5.8], fov: 40 }}
            gl={{
               antialias: true,
               alpha: true,
               powerPreference: 'default',
               stencil: false,
               depth: true,
               precision: 'mediump',
            }}
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}>
            <CameraRig />

            {/* Dynamic Lighting */}
            <DynamicLighting state={state} />

            {/* High-Performance Ambient Floor Shadow (0 FBO overhead) */}
            <mesh position={[0, -1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
               <planeGeometry args={[3.8, 3.8]} />
               <meshBasicMaterial map={floorShadowTex} transparent opacity={0.7} depthWrite={false} />
            </mesh>

            {/* Celestial Summoning Ring Decal on Floor */}
            <SummoningSeal state={state} isReducedMotion={isReducedMotion} />

            {/* Expanding Shockwave Energy Rings on Winner Reveal */}
            <ShockwaveRings state={state} isReducedMotion={isReducedMotion} />

            {/* Vertical Summoning Light Pillars */}
            <LightPillars state={state} isReducedMotion={isReducedMotion} />

            {/* Orbiting 3D Gacha Cards in Double-Helix */}
            <GachaCardsVortex state={state} isReducedMotion={isReducedMotion} />

            {/* 3D Celebratory Confetti Burst */}
            <ConfettiBurst state={state} isReducedMotion={isReducedMotion} />

            {/* Main 3D Book with Float Physics & Parallax */}
            <Float
               speed={state === 'idle' && !isReducedMotion ? 2 : 0}
               rotationIntensity={state === 'idle' && !isReducedMotion ? 0.3 : 0}
               floatIntensity={state === 'idle' && !isReducedMotion ? 0.5 : 0}>
               <BookMesh state={state} mysteryCoverTex={mysteryCoverTex} pageEdgesTex={pageEdgesTex} winnerCoverTex={winnerCoverTex} pointerRef={pointerRef} isReducedMotion={isReducedMotion} />
            </Float>
         </Canvas>
      </div>
   );
};

import React, { type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

/**
 * threeFx — minimal three.js-only replacements for the drei helpers used by
 * BookGachaScene (`Float`), so the discovery chunk no longer pulls
 * @react-three/drei (~155KB raw / ~40KB gzip) along with three.
 *
 * Visual contract matches the props BookGachaScene actually uses:
 * - Float: speed, rotationIntensity, floatIntensity, children
 */

// ---------------------------------------------------------------------------
// Float — gentle bob + slow rotation (drei-like defaults)
// ---------------------------------------------------------------------------

const FLOAT_CACHE = new WeakMap<Group, { baseY: number; baseRotX: number; baseRotY: number; baseRotZ: number }>();

export function Float({ speed = 1, rotationIntensity = 1, floatIntensity = 1, children }: { speed?: number; rotationIntensity?: number; floatIntensity?: number; children: ReactNode }) {
   const ref = React.useRef<Group>(null);

   useFrame(({ clock }) => {
      const group = ref.current;
      if (!group || (rotationIntensity === 0 && floatIntensity === 0)) return;

      let base = FLOAT_CACHE.get(group);
      if (!base) {
         base = {
            baseY: group.position.y,
            baseRotX: group.rotation.x,
            baseRotY: group.rotation.y,
            baseRotZ: group.rotation.z,
         };
         FLOAT_CACHE.set(group, base);
      }

      const t = clock.elapsedTime * speed;

      if (floatIntensity > 0) {
         group.position.y = base.baseY + Math.sin(t * 1.4) * 0.15 * floatIntensity;
      }
      if (rotationIntensity > 0) {
         group.rotation.x = base.baseRotX + Math.sin(t * 0.7) * 0.06 * rotationIntensity;
         group.rotation.y = base.baseRotY + Math.cos(t * 0.55) * 0.08 * rotationIntensity;
      }
   });

   return <group ref={ref}>{children}</group>;
}

// ---------------------------------------------------------------------------
// (Sparkles removed — unused; BookDiscoveryResult uses the lucide icon instead)
// ---------------------------------------------------------------------------

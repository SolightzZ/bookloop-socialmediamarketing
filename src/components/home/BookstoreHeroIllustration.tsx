import React from 'react';
import { HeroIllustration } from './HeroIllustration';

/**
 * BookstoreHeroIllustration adapter forwarding to the new Cute 2D HeroIllustration.
 * Retains backward compatibility for any existing imports across the application.
 */
export const BookstoreHeroIllustration: React.FC = () => {
  return <HeroIllustration />;
};

export { HeroIllustration };

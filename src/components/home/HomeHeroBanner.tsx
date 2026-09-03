import React from 'react';
import { Hero, HeroProps } from './Hero';

export type HomeHeroBannerProps = HeroProps;

/**
 * HomeHeroBanner component.
 * Wrapper and backward-compatible alias for the modular Hero component.
 */
export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = (props) => {
  return <Hero {...props} />;
};

export default HomeHeroBanner;

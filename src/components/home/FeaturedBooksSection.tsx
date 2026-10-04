import React from 'react';
import {
  BookRecommendationSection,
  BookRecommendationSectionProps,
} from './BookRecommendationSection';

export {
  BookRecommendationSection,
  BookCarousel,
  CarouselTrack,
  BookCard,
  PreviousButton,
  NextButton,
  CarouselIndicators,
} from './BookRecommendationSection';

/**
 * FeaturedBooksSection — Alias and re-export for BookRecommendationSection
 * Keeps backward compatibility with existing imports.
 */
export const FeaturedBooksSection: React.FC<BookRecommendationSectionProps> = (
  props
) => {
  return <BookRecommendationSection {...props} />;
};

export default FeaturedBooksSection;

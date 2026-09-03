import React from 'react';
import { SearchBar } from '../common/SearchBar';

export interface HeroSearchProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

/**
 * HeroSearch component.
 * Standardizes landing page search through the unified SearchBar component (variant="hero").
 */
export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}) => {
  return (
    <SearchBar
      variant="hero"
      value={searchQuery}
      onChange={onSearchQueryChange}
      onSubmit={onSearchSubmit}
      placeholder="ค้นหาชื่อหนังสือ, ผู้เขียน, หรือ ISBN..."
    />
  );
};


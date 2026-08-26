import React from 'react';
import { Box, Chip } from '@mui/material';

interface BookActiveFiltersProps {
  query: string;
  category: string;
  condition: string;
  maxPriceParam: string | null;
  onlyFavorites: boolean;
  onClearQuery: () => void;
  onClearCategory: () => void;
  onClearCondition: () => void;
  onClearPrice: () => void;
  onClearFavorite: () => void;
}

export const BookActiveFilters: React.FC<BookActiveFiltersProps> = ({
  query,
  category,
  condition,
  maxPriceParam,
  onlyFavorites,
  onClearQuery,
  onClearCategory,
  onClearCondition,
  onClearPrice,
  onClearFavorite,
}) => {
  const hasActiveFilters = query || category || condition || maxPriceParam || onlyFavorites;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
      {query && (
        <Chip
          label={`ค้นหา: "${query}"`}
          size="small"
          onDelete={onClearQuery}
        />
      )}
      {category && (
        <Chip
          label={`หมวด: ${category}`}
          size="small"
          color="primary"
          onDelete={onClearCategory}
        />
      )}
      {condition && (
        <Chip
          label={`สภาพ: ${condition}`}
          size="small"
          color="secondary"
          onDelete={onClearCondition}
        />
      )}
      {maxPriceParam && (
        <Chip
          label={`ราคาไม่เกิน ฿${maxPriceParam}`}
          size="small"
          onDelete={onClearPrice}
        />
      )}
      {onlyFavorites && (
        <Chip
          label="เฉพาะรายการโปรด ❤️"
          size="small"
          color="error"
          onDelete={onClearFavorite}
        />
      )}
    </Box>
  );
};

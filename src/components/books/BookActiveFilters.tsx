import React from 'react';
import { Box, Chip } from '@mui/material';
import {
  SearchRounded,
  AutoStoriesRounded,
  VerifiedRounded,
  MonetizationOnOutlined,
  FavoriteRounded,
} from '@mui/icons-material';

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
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2.5 }}>
      {query && (
        <Chip
          icon={<SearchRounded sx={{ fontSize: 16 }} />}
          label={`ค้นหา: "${query}"`}
          size="small"
          onDelete={onClearQuery}
          sx={{
            bgcolor: '#F1F5F9',
            fontWeight: 700,
            fontSize: '0.78rem',
            border: '1px solid #CBD5E1',
          }}
        />
      )}
      {category && (
        <Chip
          icon={<AutoStoriesRounded sx={{ fontSize: 16 }} />}
          label={`หมวด: ${category}`}
          size="small"
          color="primary"
          onDelete={onClearCategory}
          sx={{ fontWeight: 700, fontSize: '0.78rem' }}
        />
      )}
      {condition && (
        <Chip
          icon={<VerifiedRounded sx={{ fontSize: 16 }} />}
          label={`สภาพ: ${condition}`}
          size="small"
          color="secondary"
          onDelete={onClearCondition}
          sx={{ fontWeight: 700, fontSize: '0.78rem' }}
        />
      )}
      {maxPriceParam && (
        <Chip
          icon={<MonetizationOnOutlined sx={{ fontSize: 16 }} />}
          label={`ราคาไม่เกิน ฿${Number(maxPriceParam).toLocaleString()}`}
          size="small"
          onDelete={onClearPrice}
          sx={{
            bgcolor: '#F0FDF4',
            color: '#15803D',
            borderColor: '#DCFCE7',
            fontWeight: 700,
            fontSize: '0.78rem',
          }}
        />
      )}
      {onlyFavorites && (
        <Chip
          icon={<FavoriteRounded sx={{ fontSize: 16, color: '#E11D48 !important' }} />}
          label="เฉพาะรายการโปรด"
          size="small"
          color="error"
          variant="outlined"
          onDelete={onClearFavorite}
          sx={{ fontWeight: 700, fontSize: '0.78rem', bgcolor: '#FFF1F2' }}
        />
      )}
    </Box>
  );
};

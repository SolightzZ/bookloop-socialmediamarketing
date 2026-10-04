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

const conditionMap: Record<string, string> = {
  'Excellent': 'เหมือนใหม่',
  'Very Good': 'สภาพดี',
  'Good': 'พอใช้',
  'Acceptable': 'มีตำหนิ',
};

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
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.8, mb: 2 }}>
      {query && (
        <Chip
          label={`ค้นหา: "${query}"`}
          size="small"
          onDelete={onClearQuery}
          sx={{
            bgcolor: '#F1F5F9',
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.75rem',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
          }}
        />
      )}
      {category && (
        <Chip
          label={`หมวด: ${category}`}
          size="small"
          onDelete={onClearCategory}
          sx={{
            bgcolor: '#EAF4FF',
            color: '#1976D2',
            fontWeight: 600,
            fontSize: '0.75rem',
            border: '1px solid #BFDBFE',
            borderRadius: '6px',
          }}
        />
      )}
      {condition && (
        <Chip
          label={`สภาพ: ${conditionMap[condition] || condition}`}
          size="small"
          onDelete={onClearCondition}
          sx={{
            bgcolor: '#EAF4FF',
            color: '#1976D2',
            fontWeight: 600,
            fontSize: '0.75rem',
            border: '1px solid #BFDBFE',
            borderRadius: '6px',
          }}
        />
      )}
      {maxPriceParam && (
        <Chip
          label={`ราคา ≤ ฿${Number(maxPriceParam).toLocaleString()}`}
          size="small"
          onDelete={onClearPrice}
          sx={{
            bgcolor: '#F0FDF4',
            color: '#15803D',
            border: '1px solid #DCFCE7',
            fontWeight: 600,
            fontSize: '0.75rem',
            borderRadius: '6px',
          }}
        />
      )}
      {onlyFavorites && (
        <Chip
          label="รายการโปรด"
          size="small"
          onDelete={onClearFavorite}
          sx={{
            bgcolor: '#FFF1F2',
            color: '#E11D48',
            border: '1px solid #FECDD3',
            fontWeight: 600,
            fontSize: '0.75rem',
            borderRadius: '6px',
          }}
        />
      )}
    </Box>
  );
};

import { Box, Chip } from '@mui/material';
import { memo } from 'react';

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
   Excellent: 'เหมือนใหม่',
   'Very Good': 'สภาพดี',
   Good: 'พอใช้',
   Acceptable: 'มีตำหนิ',
};

export const BookActiveFilters = memo<BookActiveFiltersProps>(function BookActiveFilters({
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
}) {
   const hasActiveFilters = query || category || condition || maxPriceParam || onlyFavorites;

   if (!hasActiveFilters) {
      return null;
   }

   const chipBaseSx = {
      fontWeight: 600,
      fontSize: '0.75rem',
      borderRadius: '6px',
      height: 28,
      transition: 'all 0.15s ease',
      '&:focus-visible': {
         outline: '2px solid #1976D2',
         outlineOffset: '2px',
      },
      '& .MuiChip-deleteIcon': {
         fontSize: 16,
         transition: 'opacity 0.15s ease, transform 0.15s ease, color 0.15s ease',
         '&:hover': {
            transform: 'scale(1.15)',
         },
      },
   };

   return (
      <Box
         component="section"
         aria-label="ตัวกรองที่เลือกไว้"
         sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 0.8,
            mb: 2,
         }}>
         {query && (
            <Chip
               label={`ค้นหา: "${query}"`}
               size="small"
               onDelete={onClearQuery}
               aria-label={`ลบตัวกรองการค้นหา ${query}`}
               sx={{
                  ...chipBaseSx,
                  bgcolor: '#F1F5F9',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  '& .MuiChip-deleteIcon': {
                     ...chipBaseSx['& .MuiChip-deleteIcon'],
                     color: '#64748B',
                     '&:hover': { color: '#0F2F52', transform: 'scale(1.15)' },
                  },
               }}
            />
         )}
         {category && (
            <Chip
               label={`หมวด: ${category}`}
               size="small"
               onDelete={onClearCategory}
               aria-label={`ลบตัวกรองหมวดหมู่ ${category}`}
               sx={{
                  ...chipBaseSx,
                  bgcolor: '#EAF4FF',
                  color: '#1976D2',
                  border: '1px solid #BFDBFE',
                  '& .MuiChip-deleteIcon': {
                     ...chipBaseSx['& .MuiChip-deleteIcon'],
                     color: '#3B82F6',
                     '&:hover': { color: '#1565C0', transform: 'scale(1.15)' },
                  },
               }}
            />
         )}
         {condition && (
            <Chip
               label={`สภาพ: ${conditionMap[condition] || condition}`}
               size="small"
               onDelete={onClearCondition}
               aria-label={`ลบตัวกรองสภาพ ${conditionMap[condition] || condition}`}
               sx={{
                  ...chipBaseSx,
                  bgcolor: '#EAF4FF',
                  color: '#1976D2',
                  border: '1px solid #BFDBFE',
                  '& .MuiChip-deleteIcon': {
                     ...chipBaseSx['& .MuiChip-deleteIcon'],
                     color: '#3B82F6',
                     '&:hover': { color: '#1565C0', transform: 'scale(1.15)' },
                  },
               }}
            />
         )}
         {maxPriceParam && (
            <Chip
               label={`ราคา ≤ ฿${Number(maxPriceParam).toLocaleString()}`}
               size="small"
               onDelete={onClearPrice}
               aria-label={`ลบตัวกรองราคา ${maxPriceParam} บาท`}
               sx={{
                  ...chipBaseSx,
                  fontVariantNumeric: 'tabular-nums',
                  bgcolor: '#F0FDF4',
                  color: '#15803D',
                  border: '1px solid #DCFCE7',
                  '& .MuiChip-deleteIcon': {
                     ...chipBaseSx['& .MuiChip-deleteIcon'],
                     color: '#22C55E',
                     '&:hover': { color: '#166534', transform: 'scale(1.15)' },
                  },
               }}
            />
         )}
         {onlyFavorites && (
            <Chip
               label="รายการโปรด"
               size="small"
               onDelete={onClearFavorite}
               aria-label="ลบตัวกรองรายการโปรด"
               sx={{
                  ...chipBaseSx,
                  bgcolor: '#FFF1F2',
                  color: '#E11D48',
                  border: '1px solid #FECDD3',
                  '& .MuiChip-deleteIcon': {
                     ...chipBaseSx['& .MuiChip-deleteIcon'],
                     color: '#F43F5E',
                     '&:hover': { color: '#BE123C', transform: 'scale(1.15)' },
                  },
               }}
            />
         )}
      </Box>
   );
});

BookActiveFilters.displayName = 'BookActiveFilters';

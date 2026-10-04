import React from 'react';
import {
  Box,
  Typography,
  Button,
  Slider,
} from '@mui/material';
import { RotateCcw } from 'lucide-react';

export const categories = [
  'ทั้งหมด',
  'นิยาย',
  'พัฒนาตนเอง',
  'ธุรกิจ',
  'ความรู้',
  'การ์ตูน',
  'เด็ก',
  'การศึกษา',
  'หนังสือสะสม',
];

export const conditionList = [
  { value: 'ทั้งหมด', label: 'ทั้งหมด' },
  { value: 'Excellent', label: 'เหมือนใหม่' },
  { value: 'Very Good', label: 'สภาพดี' },
  { value: 'Good', label: 'พอใช้' },
  { value: 'Acceptable', label: 'มีตำหนิ' },
];

export const conditions = ['ทั้งหมด', 'Excellent', 'Very Good', 'Good', 'Acceptable'];

interface BookFilterSidebarProps {
  category: string;
  condition: string;
  priceRange: number;
  onlyFavorites: boolean;
  activeFiltersCount: number;
  onCategoryChange: (cat: string) => void;
  onConditionChange: (cond: string) => void;
  onPriceChange: (val: number) => void;
  onPriceChangeCommitted: (event: any, val: number | number[]) => void;
  onClearAll: () => void;
  onClearFavorite: () => void;
}

export const BookFilterSidebar: React.FC<BookFilterSidebarProps> = ({
  category,
  condition,
  priceRange,
  onlyFavorites,
  activeFiltersCount,
  onCategoryChange,
  onConditionChange,
  onPriceChange,
  onPriceChangeCommitted,
  onClearAll,
  onClearFavorite,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header: ตัวกรอง & ล้างตัวกรอง */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 1.5,
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: '#0F2F52',
            fontSize: '0.95rem',
          }}
        >
          ตัวกรอง
        </Typography>

        {activeFiltersCount > 0 && (
          <Button
            size="small"
            onClick={onClearAll}
            startIcon={<RotateCcw size={13} />}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              color: '#1976D2',
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                bgcolor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            ล้างตัวกรอง
          </Button>
        )}
      </Box>

      {/* Favorite filter notice if active */}
      {onlyFavorites && (
        <Box
          sx={{
            mb: 2,
            p: 1.2,
            bgcolor: '#FFF1F2',
            border: '1px solid #FFE4E6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ color: '#BE123C', fontSize: '0.78rem', fontWeight: 600 }}>
            รายการโปรด
          </Typography>
          <Button
            size="small"
            onClick={onClearFavorite}
            sx={{
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'none',
              color: '#1976D2',
              p: 0,
              minWidth: 'auto',
            }}
          >
            แสดงทั้งหมด
          </Button>
        </Box>
      )}

      {/* SECTION 1: หมวดหมู่ */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 700,
            color: '#0F2F52',
            fontSize: '0.825rem',
            mb: 1,
            letterSpacing: '0.01em',
          }}
        >
          หมวดหมู่
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.35 }}>
          {categories.map((cat) => {
            const isSelected = (!category && cat === 'ทั้งหมด') || category === cat;

            return (
              <Box
                key={cat}
                role="button"
                tabIndex={0}
                onClick={() => onCategoryChange(cat)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onCategoryChange(cat);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1,
                  py: 0.65,
                  borderRadius: '6px',
                  bgcolor: isSelected ? '#F0F7FF' : 'transparent',
                  color: isSelected ? '#1976D2' : '#475569',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'all 0.12s ease',
                  '&:hover': {
                    bgcolor: isSelected ? '#F0F7FF' : '#F8FAFD',
                    color: isSelected ? '#1976D2' : '#0F2F52',
                  },
                }}
              >
                {/* Radio Dot */}
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: isSelected ? '4px solid #1976D2' : '1.5px solid #CBD5E1',
                    bgcolor: '#FFFFFF',
                    flexShrink: 0,
                  }}
                />
                <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
                  {cat}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* SECTION 2: สภาพหนังสือ */}
      <Box sx={{ mb: 2.5, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 700,
            color: '#0F2F52',
            fontSize: '0.825rem',
            mb: 1,
            letterSpacing: '0.01em',
          }}
        >
          สภาพหนังสือ
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.35 }}>
          {conditionList.map((cond) => {
            const isSelected = (!condition && cond.value === 'ทั้งหมด') || condition === cond.value;

            return (
              <Box
                key={cond.value}
                role="button"
                tabIndex={0}
                onClick={() => onConditionChange(cond.value)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onConditionChange(cond.value);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1,
                  py: 0.65,
                  borderRadius: '6px',
                  bgcolor: isSelected ? '#F0F7FF' : 'transparent',
                  color: isSelected ? '#1976D2' : '#475569',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'all 0.12s ease',
                  '&:hover': {
                    bgcolor: isSelected ? '#F0F7FF' : '#F8FAFD',
                    color: isSelected ? '#1976D2' : '#0F2F52',
                  },
                }}
              >
                {/* Radio Dot */}
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: isSelected ? '4px solid #1976D2' : '1.5px solid #CBD5E1',
                    bgcolor: '#FFFFFF',
                    flexShrink: 0,
                  }}
                />
                <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
                  {cond.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* SECTION 3: ราคา */}
      <Box sx={{ mb: 2.5, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: '#0F2F52',
              fontSize: '0.825rem',
            }}
          >
            ราคา
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: '#1976D2',
              fontSize: '0.78rem',
            }}
          >
            {priceRange >= 2000 ? 'ทุกราคา' : `≤ ฿${priceRange.toLocaleString()}`}
          </Typography>
        </Box>

        <Box sx={{ px: 0.5 }}>
          <Slider
            value={priceRange}
            min={50}
            max={2000}
            step={50}
            onChange={(_, val) => onPriceChange(val as number)}
            onChangeCommitted={onPriceChangeCommitted}
            size="small"
            sx={{
              color: '#1976D2',
              '& .MuiSlider-thumb': {
                width: 14,
                height: 14,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.16)',
                },
              },
            }}
          />
        </Box>

        {/* Quick Range Buttons */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.75, mt: 1 }}>
          {[
            { label: '฿0–150', max: 150 },
            { label: '฿150–300', max: 300 },
            { label: '฿300+', max: 2000 },
          ].map((range) => {
            const isCurrent = priceRange === range.max;
            return (
              <Button
                key={range.label}
                variant="outlined"
                size="small"
                onClick={() => {
                  onPriceChange(range.max);
                  onPriceChangeCommitted(null, range.max);
                }}
                sx={{
                  p: '3px 6px',
                  minWidth: 0,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  textTransform: 'none',
                  borderColor: isCurrent ? '#1976D2' : '#E2E8F0',
                  color: isCurrent ? '#1976D2' : '#475569',
                  bgcolor: isCurrent ? '#F0F7FF' : '#FFFFFF',
                  '&:hover': {
                    borderColor: '#1976D2',
                    bgcolor: isCurrent ? '#F0F7FF' : '#F8FAFD',
                  },
                }}
              >
                {range.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Clear All Button at bottom if filters are active */}
      {activeFiltersCount > 0 && (
        <Box sx={{ pt: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={onClearAll}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              color: '#64748B',
              borderColor: '#E2E8F0',
              '&:hover': {
                borderColor: '#CBD5E1',
                bgcolor: '#F8FAFD',
                color: '#0F2F52',
              },
            }}
          >
            ล้างตัวกรองทั้งหมด ({activeFiltersCount})
          </Button>
        </Box>
      )}
    </Box>
  );
};

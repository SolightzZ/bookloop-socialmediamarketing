import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Slider,
} from '@mui/material';
import {
  RestartAlt as ResetIcon,
  AutoStories as NovelIcon,
  Palette as ComicIcon,
  Science as ScienceIcon,
  SelfImprovement as GrowthIcon,
  BusinessCenter as BusinessIcon,
  ChildCare as KidsIcon,
  School as EducationIcon,
  AutoAwesome as RareBookIcon,
  Apps as AllIcon,
  TuneRounded,
  CategoryRounded,
  VerifiedRounded,
  MonetizationOnOutlined,
  FavoriteRounded,
  StarRounded,
  CheckCircleRounded,
  ThumbUpRounded,
  ReportProblemOutlined,
} from '@mui/icons-material';

export const categories = ['ทั้งหมด', 'นิยาย', 'การ์ตูน', 'ความรู้', 'พัฒนาตนเอง', 'ธุรกิจ', 'เด็ก', 'การศึกษา', 'หนังสือสะสม'];
export const conditions = ['ทั้งหมด', 'Excellent', 'Very Good', 'Good', 'Acceptable'];

export const categoryIcons: Record<string, React.ReactElement> = {
  'ทั้งหมด': <AllIcon sx={{ fontSize: '1rem !important' }} />,
  'นิยาย': <NovelIcon sx={{ fontSize: '1rem !important' }} />,
  'การ์ตูน': <ComicIcon sx={{ fontSize: '1rem !important' }} />,
  'ความรู้': <ScienceIcon sx={{ fontSize: '1rem !important' }} />,
  'พัฒนาตนเอง': <GrowthIcon sx={{ fontSize: '1rem !important' }} />,
  'ธุรกิจ': <BusinessIcon sx={{ fontSize: '1rem !important' }} />,
  'เด็ก': <KidsIcon sx={{ fontSize: '1rem !important' }} />,
  'การศึกษา': <EducationIcon sx={{ fontSize: '1rem !important' }} />,
  'หนังสือสะสม': <RareBookIcon sx={{ fontSize: '1rem !important' }} />,
};

const conditionMeta: Record<string, { label: string; icon: React.ReactElement; color: string; bg: string }> = {
  'ทั้งหมด': { label: 'ทุกสภาพ', icon: <AllIcon sx={{ fontSize: '1rem !important' }} />, color: '#0F2D4A', bg: '#F1F5F9' },
  'Excellent': { label: 'ดีเยี่ยม (95%+)', icon: <StarRounded sx={{ fontSize: '1rem !important', color: '#16A34A' }} />, color: '#15803D', bg: '#DCFCE7' },
  'Very Good': { label: 'ดีมาก (85-94%)', icon: <CheckCircleRounded sx={{ fontSize: '1rem !important', color: '#1D4ED8' }} />, color: '#1D4ED8', bg: '#DBEAFE' },
  'Good': { label: 'ปานกลาง (70-84%)', icon: <ThumbUpRounded sx={{ fontSize: '1rem !important', color: '#D97706' }} />, color: '#B45309', bg: '#FEF3C7' },
  'Acceptable': { label: 'พอใช้ (50-69%)', icon: <ReportProblemOutlined sx={{ fontSize: '1rem !important', color: '#EA580C' }} />, color: '#C2410C', bg: '#FFEDD5' },
};

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
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      {/* Sidebar Title & Reset */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.5,
              bgcolor: '#EAF4FF',
              color: '#1976D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TuneRounded sx={{ fontSize: 18 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '0.95rem' }}>
            ตัวกรองค้นหา
          </Typography>
        </Box>

        {activeFiltersCount > 0 && (
          <Button
            size="small"
            startIcon={<ResetIcon sx={{ fontSize: 16 }} />}
            onClick={onClearAll}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'none',
              color: '#E11D48',
              p: 0.5,
            }}
          >
            ล้างทั้งหมด ({activeFiltersCount})
          </Button>
        )}
      </Box>

      {/* Only Favorites Banner */}
      {onlyFavorites && (
        <Box
          sx={{
            mb: 2.5,
            p: 1.5,
            bgcolor: '#FFF1F2',
            border: '1px solid #FFE4E6',
            borderRadius: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
            <FavoriteRounded sx={{ fontSize: 16, color: '#E11D48' }} />
            <Typography variant="subtitle2" sx={{ color: '#BE123C', fontWeight: 800, fontSize: '0.8rem' }}>
              กำลังแสดง: รายการโปรดของคุณ
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={onClearFavorite}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'none',
              color: '#1976D2',
              p: 0,
            }}
          >
            ← ดูหนังสือทั้งหมด
          </Button>
        </Box>
      )}

      {/* 1. Categories */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
          <CategoryRounded sx={{ fontSize: 16, color: '#1976D2' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '0.85rem' }}>
            หมวดหมู่หนังสือ
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {categories.map((cat) => {
            const isSelected = (!category && cat === 'ทั้งหมด') || category === cat;
            return (
              <Chip
                key={cat}
                icon={categoryIcons[cat]}
                label={cat}
                onClick={() => onCategoryChange(cat)}
                size="small"
                clickable
                sx={{
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.78rem',
                  py: 0.2,
                  px: 0.4,
                  borderRadius: 2,
                  bgcolor: isSelected ? '#1976D2' : '#F8FAFC',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  border: isSelected ? '1px solid #1976D2' : '1px solid #E2E8F0',
                  '& .MuiChip-icon': {
                    color: isSelected ? '#FFFFFF !important' : '#64748B !important',
                  },
                  '&:hover': {
                    bgcolor: isSelected ? '#1565C0' : '#EDF2F7',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

      {/* 2. Condition */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
          <VerifiedRounded sx={{ fontSize: 16, color: '#1976D2' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '0.85rem' }}>
            สภาพหนังสือ
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {conditions.map((cond) => {
            const isSelected = (!condition && cond === 'ทั้งหมด') || condition === cond;
            const meta = conditionMeta[cond];

            return (
              <Chip
                key={cond}
                icon={meta?.icon}
                label={meta?.label || cond}
                onClick={() => onConditionChange(cond)}
                size="small"
                clickable
                sx={{
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.75rem',
                  py: 0.2,
                  px: 0.4,
                  borderRadius: 2,
                  bgcolor: isSelected ? '#0F2D4A' : '#F8FAFC',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  border: isSelected ? '1px solid #0F2D4A' : '1px solid #E2E8F0',
                  '& .MuiChip-icon': {
                    color: isSelected ? '#FFFFFF !important' : undefined,
                  },
                  '&:hover': {
                    bgcolor: isSelected ? '#1A365D' : '#EDF2F7',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

      {/* 3. Price Range */}
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <MonetizationOnOutlined sx={{ fontSize: 16, color: '#1976D2' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '0.85rem' }}>
              ราคาสูงสุด
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#1976D2', fontSize: '0.82rem' }}>
            {priceRange >= 2000 ? 'ทุกราคา' : `ไม่เกิน ฿${priceRange.toLocaleString()}`}
          </Typography>
        </Box>

        <Slider
          value={priceRange}
          min={50}
          max={2000}
          step={50}
          onChange={(_, val) => onPriceChange(val as number)}
          onChangeCommitted={onPriceChangeCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={(x) => `฿${x}`}
          sx={{
            color: '#1976D2',
            '& .MuiSlider-thumb': {
              width: 18,
              height: 18,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.16)',
              },
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
            ฿50
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
            ฿2,000+
          </Typography>
        </Box>

        {/* Quick Price Filter Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 1.5 }}>
          {[150, 300, 500].map((p) => (
            <Chip
              key={p}
              label={`≤ ฿${p}`}
              size="small"
              onClick={() => {
                onPriceChange(p);
                onPriceChangeCommitted(null, p);
              }}
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                height: 22,
                cursor: 'pointer',
                bgcolor: priceRange === p ? '#EAF4FF' : '#F1F5F9',
                color: priceRange === p ? '#1976D2' : '#475569',
                border: priceRange === p ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

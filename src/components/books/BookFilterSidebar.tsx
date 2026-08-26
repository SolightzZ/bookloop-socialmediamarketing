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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ตัวกรองค้นหา
        </Typography>
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            startIcon={<ResetIcon />}
            onClick={onClearAll}
            color="secondary"
          >
            ล้างทั้งหมด
          </Button>
        )}
      </Box>

      {/* Only Favorites toggle if active */}
      {onlyFavorites && (
        <Box sx={{ mb: 3, p: 1.5, bgcolor: 'rgba(23, 105, 170, 0.08)', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
            ❤️ กำลังแสดง: รายการโปรดของคุณ
          </Typography>
          <Button
            size="small"
            onClick={onClearFavorite}
            sx={{ mt: 0.5 }}
          >
            แสดงหนังสือทั้งหมด
          </Button>
        </Box>
      )}

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          หมวดหมู่
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {categories.map((cat) => {
            const isSelected = (!category && cat === 'ทั้งหมด') || category === cat;
            return (
              <Chip
                key={cat}
                icon={categoryIcons[cat]}
                label={cat}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                onClick={() => onCategoryChange(cat)}
                size="small"
                clickable
                sx={{ fontWeight: isSelected ? 700 : 500 }}
              />
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Condition */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          สภาพหนังสือ
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {conditions.map((cond) => {
            const isSelected = (!condition && cond === 'ทั้งหมด') || condition === cond;
            return (
              <Chip
                key={cond}
                label={cond === 'ทั้งหมด' ? 'ทุกสภาพ' : cond}
                color={isSelected ? 'secondary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                onClick={() => onConditionChange(cond)}
                size="small"
                clickable
                sx={{ fontWeight: isSelected ? 700 : 500 }}
              />
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Price Slider */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            ราคาสูงสุด
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {priceRange >= 2000 ? 'ทุกช่วงราคา' : `ไม่เกิน ฿${priceRange}`}
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
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ฿50
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ฿2,000+
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

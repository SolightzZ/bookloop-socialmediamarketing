import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import {
  MenuBookRounded,
  TitleRounded,
  PersonOutlineRounded,
  QrCodeScannerRounded,
  AutoStories as NovelIcon,
  Palette as ComicIcon,
  Science as ScienceIcon,
  SelfImprovement as GrowthIcon,
  BusinessCenter as BusinessIcon,
  ChildCare as KidsIcon,
  School as EducationIcon,
  AutoAwesome as RareBookIcon,
} from '@mui/icons-material';

export const CATEGORIES = [
  'นิยาย',
  'การ์ตูน',
  'ความรู้',
  'พัฒนาตนเอง',
  'ธุรกิจ',
  'เด็ก',
  'การศึกษา',
  'หนังสือสะสม',
];

const categoryIconMap: Record<string, React.ReactElement> = {
  'นิยาย': <NovelIcon sx={{ fontSize: 18, color: '#1565C0' }} />,
  'การ์ตูน': <ComicIcon sx={{ fontSize: 18, color: '#E11D48' }} />,
  'ความรู้': <ScienceIcon sx={{ fontSize: 18, color: '#0284C7' }} />,
  'พัฒนาตนเอง': <GrowthIcon sx={{ fontSize: 18, color: '#059669' }} />,
  'ธุรกิจ': <BusinessIcon sx={{ fontSize: 18, color: '#D97706' }} />,
  'เด็ก': <KidsIcon sx={{ fontSize: 18, color: '#9333EA' }} />,
  'การศึกษา': <EducationIcon sx={{ fontSize: 18, color: '#2563EB' }} />,
  'หนังสือสะสม': <RareBookIcon sx={{ fontSize: 18, color: '#EA580C' }} />,
};

interface BasicInfoSectionProps {
  title: string;
  author: string;
  category: string;
  isbn: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
  onBlur: (field: string) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  author,
  category,
  isbn,
  onChange,
  onBlur,
  errors,
  touched,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            bgcolor: '#EAF4FF',
            color: '#1976D2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MenuBookRounded sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '1.05rem', lineHeight: 1.2 }}
          >
            ข้อมูลพื้นฐานของหนังสือ
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.78rem' }}>
            ระบุชื่อเรื่อง ผู้เขียน และหมวดหมู่เพื่อให้นักอ่านค้นหาหนังสือของคุณได้ง่ายขึ้น
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Title */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            required
            label="ชื่อหนังสือ"
            name="title"
            value={title}
            onChange={onChange}
            onBlur={() => onBlur('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title ? errors.title : 'ระบุชื่อเรื่องหนังสือฉบับเต็ม'}
            placeholder="เช่น Atomic Habits เพราะชีวิตดีได้กว่าที่เป็น"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleRounded sx={{ fontSize: 18, color: '#94A3B8' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {/* Author */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            label="ผู้เขียน / ผู้แปล"
            name="author"
            value={author}
            onChange={onChange}
            onBlur={() => onBlur('author')}
            error={Boolean(touched.author && errors.author)}
            helperText={touched.author && errors.author ? errors.author : 'ชื่อผู้แต่งหรือผู้แปล'}
            placeholder="เช่น James Clear"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRounded sx={{ fontSize: 18, color: '#94A3B8' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {/* Category */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl
            fullWidth
            size="small"
            required
            error={Boolean(touched.category && errors.category)}
          >
            <InputLabel id="category-select-label">หมวดหมู่หนังสือ</InputLabel>
            <Select
              labelId="category-select-label"
              name="category"
              value={category}
              label="หมวดหมู่หนังสือ"
              onBlur={() => onBlur('category')}
              onChange={(e) => onChange({ target: { name: 'category', value: e.target.value } })}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    {categoryIconMap[cat]}
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {cat}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {touched.category && errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* ISBN */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="รหัส ISBN (ระบุหรือไม่ก็ได้)"
            name="isbn"
            value={isbn}
            onChange={onChange}
            onBlur={() => onBlur('isbn')}
            error={Boolean(touched.isbn && errors.isbn)}
            helperText={touched.isbn && errors.isbn ? errors.isbn : 'รหัสบาร์โค้ด 10 หรือ 13 หลัก หลังปกหนังสือ'}
            placeholder="978-616-04-1234-5"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeScannerRounded sx={{ fontSize: 18, color: '#94A3B8' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

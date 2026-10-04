import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

export const CATEGORIES = [
  'นิยาย',
  'พัฒนาตนเอง',
  'ธุรกิจ',
  'ความรู้',
  'การ์ตูน',
  'การศึกษา',
  'เด็ก',
  'หนังสือสะสม',
];

export interface BookInfoFormProps {
  title: string;
  author: string;
  isbn: string;
  category: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
  onBlur: (field: string) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export const BookInfoForm: React.FC<BookInfoFormProps> = ({
  title,
  author,
  isbn,
  category,
  onChange,
  onBlur,
  errors,
  touched,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Section Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            fontWeight: 700,
            color: '#0F2F52',
            fontSize: '1.05rem',
            lineHeight: 1.3,
          }}
        >
          ข้อมูลหนังสือ
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#64748B',
            fontSize: '0.825rem',
            display: 'block',
            mt: 0.25,
          }}
        >
          กรอกข้อมูลหนังสือ
        </Typography>
      </Box>

      {/* 2-Column Grid on Desktop, 1-Column on Mobile */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2.5, sm: 2.5 },
        }}
      >
        {/* ชื่อหนังสือ * */}
        <Box>
          <Typography
            component="label"
            htmlFor="sell-field-title"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0F2F52',
              mb: 0.75,
            }}
          >
            ชื่อหนังสือ <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
          </Typography>
          <TextField
            id="sell-field-title"
            name="title"
            fullWidth
            size="small"
            value={title}
            placeholder="Atomic Habits"
            onChange={onChange}
            onBlur={() => onBlur('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title ? errors.title : ''}
            slotProps={{
              input: {
                sx: {
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  fontSize: '0.9375rem',
                  '& fieldset': {
                    borderColor: '#E2EAF2',
                  },
                  '&:hover fieldset': {
                    borderColor: '#94A3B8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976D2',
                  },
                },
              },
            }}
          />
        </Box>

        {/* ผู้เขียน * */}
        <Box>
          <Typography
            component="label"
            htmlFor="sell-field-author"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0F2F52',
              mb: 0.75,
            }}
          >
            ผู้เขียน <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
          </Typography>
          <TextField
            id="sell-field-author"
            name="author"
            fullWidth
            size="small"
            value={author}
            placeholder="James Clear"
            onChange={onChange}
            onBlur={() => onBlur('author')}
            error={Boolean(touched.author && errors.author)}
            helperText={touched.author && errors.author ? errors.author : ''}
            slotProps={{
              input: {
                sx: {
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  fontSize: '0.9375rem',
                  '& fieldset': {
                    borderColor: '#E2EAF2',
                  },
                  '&:hover fieldset': {
                    borderColor: '#94A3B8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976D2',
                  },
                },
              },
            }}
          />
        </Box>

        {/* หมวดหมู่ * */}
        <Box>
          <Typography
            component="label"
            id="category-label"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0F2F52',
              mb: 0.75,
            }}
          >
            หมวดหมู่ <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
          </Typography>
          <FormControl
            fullWidth
            size="small"
            error={Boolean(touched.category && errors.category)}
          >
            <Select
              labelId="category-label"
              id="sell-field-category"
              name="category"
              value={category}
              displayEmpty
              onChange={(e) => onChange({ target: { name: 'category', value: e.target.value } })}
              onBlur={() => onBlur('category')}
              sx={{
                borderRadius: '10px',
                bgcolor: '#FFFFFF',
                fontSize: '0.9375rem',
                '& fieldset': {
                  borderColor: '#E2EAF2',
                },
                '&:hover fieldset': {
                  borderColor: '#94A3B8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976D2',
                },
              }}
            >
              <MenuItem value="" disabled sx={{ color: '#94A3B8' }}>
                <em>เลือกหมวดหมู่</em>
              </MenuItem>
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
            {touched.category && errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* ISBN */}
        <Box>
          <Typography
            component="label"
            htmlFor="sell-field-isbn"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0F2F52',
              mb: 0.75,
            }}
          >
            ISBN
          </Typography>
          <TextField
            id="sell-field-isbn"
            name="isbn"
            fullWidth
            size="small"
            value={isbn}
            placeholder="9786161834629"
            onChange={onChange}
            onBlur={() => onBlur('isbn')}
            error={Boolean(touched.isbn && errors.isbn)}
            helperText={touched.isbn && errors.isbn ? errors.isbn : ''}
            slotProps={{
              input: {
                sx: {
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  fontSize: '0.9375rem',
                  '& fieldset': {
                    borderColor: '#E2EAF2',
                  },
                  '&:hover fieldset': {
                    borderColor: '#94A3B8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976D2',
                  },
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

// Also export alias for backward compatibility if needed
export { BookInfoForm as BasicInfoSection };

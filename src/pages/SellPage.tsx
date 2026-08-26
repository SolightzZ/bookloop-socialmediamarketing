import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  AutoStories as NovelIcon,
  Palette as ComicIcon,
  Science as ScienceIcon,
  SelfImprovement as GrowthIcon,
  BusinessCenter as BusinessIcon,
  ChildCare as KidsIcon,
  School as EducationIcon,
  AutoAwesome as RareBookIcon,
} from '@mui/icons-material';
import { showSuccess, showError } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { SellGuideSidebar, SELL_CONDITIONS } from '../components/sell/SellGuideSidebar';
import { BookImageUploadZone } from '../components/sell/BookImageUploadZone';
import { BookStoryInput } from '../components/sell/BookStoryInput';

const categories = ['นิยาย', 'การ์ตูน', 'ความรู้', 'พัฒนาตนเอง', 'ธุรกิจ', 'เด็ก', 'การศึกษา', 'หนังสือสะสม'];

const categoryIconMap: Record<string, React.ReactElement> = {
  'นิยาย': <NovelIcon sx={{ fontSize: 20, color: '#1565C0' }} />,
  'การ์ตูน': <ComicIcon sx={{ fontSize: 20, color: '#E11D48' }} />,
  'ความรู้': <ScienceIcon sx={{ fontSize: 20, color: '#0284C7' }} />,
  'พัฒนาตนเอง': <GrowthIcon sx={{ fontSize: 20, color: '#059669' }} />,
  'ธุรกิจ': <BusinessIcon sx={{ fontSize: 20, color: '#D97706' }} />,
  'เด็ก': <KidsIcon sx={{ fontSize: 20, color: '#9333EA' }} />,
  'การศึกษา': <EducationIcon sx={{ fontSize: 20, color: '#2563EB' }} />,
  'หนังสือสะสม': <RareBookIcon sx={{ fontSize: 20, color: '#EA580C' }} />,
};

export default function SellPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    condition: '',
    price: '',
    originalPrice: '',
    defects: '',
    story: '',
    sellerNote: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('sell_book_click', { page: 'sell' });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImagePreview(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.condition || !formData.price || !formData.author) {
      showError('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดตรวจสอบข้อมูลที่มีเครื่องหมาย * อีกครั้ง');
      return;
    }

    trackEvent('sell_book_submit_demo', {
      title: formData.title,
      category: formData.category,
      condition: formData.condition,
      price: Number(formData.price),
    });

    showSuccess(
      'ลงขายหนังสือแบบ Demo สำเร็จ!',
      `หนังสือ "${formData.title}" ได้รับการจำลองขึ้นระบบเรียบร้อย ขอบคุณที่ร่วมส่งต่อเรื่องราวในชุมชน BookLoop`
    ).then(() => {
      navigate('/books');
    });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Banner */}
      <Box sx={{ bgcolor: '#0F2942', color: '#FFFFFF', py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Chip
            label="SELL & SHARE"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontWeight: 800,
              letterSpacing: '1px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              mb: 2.5,
              px: 0.5,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#FFFFFF',
              mb: 1.5,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              lineHeight: 1.25,
            }}
          >
            มีหนังสือที่อ่านจบแล้ว? ส่งต่อได้ที่นี่
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#FFFFFF',
              opacity: 0.95,
              maxWidth: 640,
              mx: 'auto',
              fontWeight: 400,
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              lineHeight: 1.6,
            }}
          >
            เปลี่ยนหนังสือที่ไม่ได้อ่านบนชั้น ให้กลายเป็นคุณค่าและรายได้คืนกลับมา
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Left: Step Guide & Condition Guide */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SellGuideSidebar />
          </Grid>

          {/* Right: Sell Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                border: '1px solid #D9E2EC',
                bgcolor: '#FFFFFF',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ข้อมูลหนังสือที่ต้องการส่งต่อ
                </Typography>
                <Chip label="Demo Form" size="small" variant="outlined" />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                กรุณากรอกข้อมูลหนังสือตามความเป็นจริง เพื่อความโปร่งใสและสร้างความมั่นใจให้ผู้ซื้อ
              </Typography>

              <Grid container spacing={3}>
                {/* Image Upload Zone */}
                <Grid size={12}>
                  <BookImageUploadZone
                    imagePreview={imagePreview}
                    onImageChange={handleSimulatedUpload}
                  />
                </Grid>

                {/* Title */}
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    required
                    label="ชื่อหนังสือ"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="เช่น Atomic Habits เพราะชีวิตดีได้กว่าที่เป็น"
                    size="small"
                  />
                </Grid>

                {/* Author */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    required
                    label="ผู้เขียน / ผู้แปล"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="เช่น James Clear"
                    size="small"
                  />
                </Grid>

                {/* ISBN */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="ISBN (ถ้ามี)"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    placeholder="เช่น 978-616-123-456-7"
                    size="small"
                  />
                </Grid>

                {/* Category */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>หมวดหมู่</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      label="หมวดหมู่"
                      onChange={(e) =>
                        handleChange({ target: { name: 'category', value: e.target.value } })
                      }
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                          {categoryIconMap[cat]}
                          <Typography variant="body2">{cat}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Condition */}
                <Grid size={12}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>สภาพหนังสือ</InputLabel>
                    <Select
                      name="condition"
                      value={formData.condition}
                      label="สภาพหนังสือ"
                      onChange={(e) =>
                        handleChange({ target: { name: 'condition', value: e.target.value } })
                      }
                    >
                      {SELL_CONDITIONS.map((c) => (
                        <MenuItem key={c.value} value={c.value}>
                          {c.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Price */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="ราคาที่คุณต้องการขาย (บาท)"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                      },
                    }}
                    size="small"
                  />
                </Grid>

                {/* Original Price */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="ราคาปกเดิมโดยประมาณ (บาท)"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                      },
                    }}
                    size="small"
                    helperText="ช่วยให้ผู้ซื้อเห็นส่วนลดที่ประหยัดได้"
                  />
                </Grid>

                {/* Defects */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="ตำหนิที่ควรแจ้ง (ถ้ามี)"
                    name="defects"
                    value={formData.defects}
                    onChange={handleChange}
                    placeholder="เช่น มุมปกล่างมีรอยยับเล็กน้อย, มีไฮไลต์หน้า 20-25"
                    size="small"
                  />
                </Grid>

                {/* Book Story */}
                <Grid size={12}>
                  <BookStoryInput
                    value={formData.story}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Submit button */}
                <Grid size={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.6,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      mt: 2,
                    }}
                  >
                    ส่งต่อหนังสือเล่มนี้ (Demo Submit)
                  </Button>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', mt: 1.5 }}>
                    การส่งฟอร์มนี้เป็นการจำลอง ไม่มีผลผูกพันทางธุรกรรมจริง
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

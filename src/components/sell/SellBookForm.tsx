import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { CameraAltRounded } from '@mui/icons-material';
import { BookImageUpload } from './BookImageUpload';
import { BasicInfoSection } from './BasicInfoSection';
import { ConditionSection } from './ConditionSection';
import { PricingSection } from './PricingSection';
import { BookStorySection } from './BookStorySection';
import { SubmitSection } from './SubmitSection';

export interface SellFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  condition: string;
  price: string;
  originalPrice: string;
  defects: string;
  story: string;
}

interface SellBookFormProps {
  onSubmit: (data: SellFormData, image: string) => Promise<void>;
  onStepProgressChange?: (currentStep: number, completedSteps: number[]) => void;
}

export const SellBookForm: React.FC<SellBookFormProps> = ({
  onSubmit,
  onStepProgressChange,
}) => {
  const [formData, setFormData] = useState<SellFormData>({
    title: '',
    author: '',
    isbn: '',
    category: '',
    condition: '',
    price: '',
    originalPrice: '',
    defects: '',
    story: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation Logic
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // 1. Title (Required)
    const title = formData.title.trim();
    if (!title) {
      errs.title = 'กรุณากรอกชื่อหนังสือ';
    } else if (title.length < 2) {
      errs.title = 'ชื่อหนังสือต้องมีอย่างน้อย 2 ตัวอักษร';
    } else if (title.length > 150) {
      errs.title = 'ชื่อหนังสือต้องไม่เกิน 150 ตัวอักษร';
    }

    // 2. Author (Required)
    const author = formData.author.trim();
    if (!author) {
      errs.author = 'กรุณากรอกชื่อผู้เขียนหรือผู้แปล';
    } else if (author.length < 2) {
      errs.author = 'ชื่อผู้เขียนต้องมีอย่างน้อย 2 ตัวอักษร';
    } else if (author.length > 100) {
      errs.author = 'ชื่อผู้เขียนต้องไม่เกิน 100 ตัวอักษร';
    }

    // 3. Category (Required)
    if (!formData.category) {
      errs.category = 'กรุณาเลือกหมวดหมู่หนังสือ';
    }

    // 4. Condition (Required)
    if (!formData.condition) {
      errs.condition = 'กรุณาระบุสภาพหนังสือ';
    }

    // 5. Price (Required & Numeric validation)
    if (!formData.price) {
      errs.price = 'กรุณากรอกราคาขาย';
    } else {
      const numPrice = Number(formData.price);
      if (isNaN(numPrice) || numPrice <= 0) {
        errs.price = 'ราคาขายต้องมากกว่า 0 บาท';
      } else if (numPrice > 50000) {
        errs.price = 'ราคาขายต้องไม่เกิน 50,000 บาท';
      }
    }

    // 6. Original Price (Optional, but if filled must be logical)
    if (formData.originalPrice) {
      const numOrig = Number(formData.originalPrice);
      const numPrice = Number(formData.price);
      if (isNaN(numOrig) || numOrig <= 0) {
        errs.originalPrice = 'ราคาปกเดิมต้องมากกว่า 0 บาท';
      } else if (numPrice > 0 && numOrig < numPrice) {
        errs.originalPrice = 'ราคาปกเดิมควรมากกว่าหรือเท่ากับราคาขาย';
      }
    }

    // 7. ISBN (Optional: only validates pattern if user entered something)
    if (formData.isbn.trim()) {
      const cleanIsbn = formData.isbn.replace(/[-\s]/g, '');
      if (!/^(97[89])?[0-9]{9}[0-9X]$/i.test(cleanIsbn)) {
        errs.isbn = 'รูปแบบ ISBN ไม่ถูกต้อง (เช่น 978-616-123-456-7)';
      }
    }

    // 8. Image (Required)
    if (!imagePreview) {
      errs.image = 'กรุณาอัปโหลดรูปถ่ายหนังสือ';
    }

    return errs;
  }, [formData, imagePreview]);

  const isFormValid = Object.keys(errors).length === 0;

  // Compute live step progress
  React.useEffect(() => {
    const completed: number[] = [];
    if (imagePreview) completed.push(0);
    if (formData.title.trim().length >= 2 && formData.author.trim().length >= 2 && formData.category) {
      completed.push(1);
    }
    if (formData.condition) completed.push(2);
    if (Number(formData.price) > 0) completed.push(3);
    if (isFormValid) completed.push(4);

    let current = 0;
    if (completed.includes(0)) current = 1;
    if (completed.includes(0) && completed.includes(1)) current = 2;
    if (completed.includes(0) && completed.includes(1) && completed.includes(2)) current = 3;
    if (completed.includes(0) && completed.includes(1) && completed.includes(2) && completed.includes(3)) current = 4;

    onStepProgressChange?.(current, completed);
  }, [imagePreview, formData, isFormValid, onStepProgressChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate clicks
    if (isSubmitting || submitStatus === 'loading') return;

    if (!isFormValid || !imagePreview) {
      // Mark all fields touched to reveal errors
      setTouched({
        title: true,
        author: true,
        category: true,
        condition: true,
        price: true,
        originalPrice: true,
        isbn: true,
        image: true,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('loading');
    setSubmitErrorMessage(null);

    try {
      await onSubmit(formData, imagePreview);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
      setSubmitErrorMessage('ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        p: { xs: 3, sm: 4, md: 5 },
        borderRadius: 3,
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
        boxShadow: '0 2px 12px rgba(15, 45, 74, 0.04)',
      }}
    >
      {/* Form Surface Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: { xs: '1.35rem', md: '1.6rem' }, mb: 0.5 }}
        >
          ข้อมูลหนังสือที่ต้องการส่งต่อ
        </Typography>
        <Typography variant="body2" sx={{ color: '#627D98', fontSize: '0.875rem' }}>
          กรุณากรอกข้อมูลหนังสือตามความเป็นจริง เพื่อความโปร่งใสและสร้างความมั่นใจให้ผู้ซื้อ
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
        {/* Section 1: Book Image Upload */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
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
              <CameraAltRounded sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '1.05rem', lineHeight: 1.2 }}
              >
                รูปถ่ายหนังสือจริง <Box component="span" sx={{ color: '#E11D48' }}>*</Box>
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.78rem' }}>
                อัปโหลดรูปถ่ายจริงเพื่อให้นักอ่านเห็นสภาพหนังสือได้ชัดเจน
              </Typography>
            </Box>
          </Box>
          <BookImageUpload
            imagePreview={imagePreview}
            onImageSelected={(url) => {
              setImagePreview(url);
              markTouched('image');
            }}
            onImageRemoved={() => {
              setImagePreview(null);
              markTouched('image');
            }}
            error={errors.image}
            touched={touched.image}
          />
        </Box>

        <Divider sx={{ borderColor: '#F0F4F8' }} />

        {/* Section 2: Basic Information */}
        <BasicInfoSection
          title={formData.title}
          author={formData.author}
          category={formData.category}
          isbn={formData.isbn}
          onChange={handleChange}
          onBlur={markTouched}
          errors={errors}
          touched={touched}
        />

        <Divider sx={{ borderColor: '#F0F4F8' }} />

        {/* Section 3: Condition */}
        <ConditionSection
          condition={formData.condition}
          defects={formData.defects}
          onChange={handleChange}
          onBlur={markTouched}
          errors={errors}
          touched={touched}
        />

        <Divider sx={{ borderColor: '#F0F4F8' }} />

        {/* Section 4: Pricing */}
        <PricingSection
          price={formData.price}
          originalPrice={formData.originalPrice}
          onChange={handleChange}
          onBlur={markTouched}
          errors={errors}
          touched={touched}
        />

        <Divider sx={{ borderColor: '#F0F4F8' }} />

        {/* Section 5: Book Story */}
        <BookStorySection story={formData.story} onChange={handleChange} />

        <Divider sx={{ borderColor: '#F0F4F8' }} />

        {/* Section 6: Submit */}
        <SubmitSection
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
          errorMessage={submitErrorMessage}
        />
      </Box>
    </Paper>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SellStepIndicator, SELL_STEPS } from './SellStepIndicator';
import { BookImageUpload } from './BookImageUpload';
import { BookInfoForm } from './BookInfoForm';
import { ConditionSelector } from './ConditionSelector';
import { PricingSection } from './PricingSection';
import { DeliverySelector, DeliveryMethod } from './DeliverySelector';
import { logError } from '../../utils/logger';

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
  deliveryMethod?: DeliveryMethod;
}

export interface SellBookFormProps {
  onSubmit: (data: SellFormData, image: string) => Promise<void>;
  onStepProgressChange?: (currentStep: number, completedSteps: number[]) => void;
}

export const SellBookForm: React.FC<SellBookFormProps> = ({
  onSubmit,
  onStepProgressChange,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Current active step (0: ข้อมูลหนังสือ, 1: สภาพหนังสือ, 2: การส่งต่อ)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [maxStepReached, setMaxStepReached] = useState<number>(0);

  // Form Data State
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
    deliveryMethod: 'shipping',
  });

  // Images state (up to 5 images)
  const [images, setImages] = useState<string[]>([]);
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

  const handleDeliveryChange = (method: DeliveryMethod) => {
    setFormData((prev) => ({ ...prev, deliveryMethod: method }));
  };

  // Comprehensive Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Step 0 validation: Images
    if (images.length === 0) {
      errs.image = 'กรุณาอัปโหลดรูปหนังสืออย่างน้อย 1 รูป';
    }

    // Step 0 validation: Title
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      errs.title = 'กรุณากรอกชื่อหนังสือ';
    } else if (trimmedTitle.length < 2) {
      errs.title = 'ชื่อหนังสือต้องมีอย่างน้อย 2 ตัวอักษร';
    } else if (trimmedTitle.length > 150) {
      errs.title = 'ชื่อหนังสือต้องไม่เกิน 150 ตัวอักษร';
    }

    // Step 0 validation: Author
    const trimmedAuthor = formData.author.trim();
    if (!trimmedAuthor) {
      errs.author = 'กรุณากรอกชื่อผู้เขียน';
    } else if (trimmedAuthor.length < 2) {
      errs.author = 'ชื่อผู้เขียนต้องมีอย่างน้อย 2 ตัวอักษร';
    } else if (trimmedAuthor.length > 100) {
      errs.author = 'ชื่อผู้เขียนต้องไม่เกิน 100 ตัวอักษร';
    }

    // Step 0 validation: Category
    if (!formData.category) {
      errs.category = 'กรุณาเลือกหมวดหมู่หนังสือ';
    }

    // Step 0 validation: ISBN (optional)
    if (formData.isbn.trim()) {
      const cleanIsbn = formData.isbn.replace(/[-\s]/g, '');
      if (!/^(97[89])?[0-9]{9}[0-9X]$/i.test(cleanIsbn)) {
        errs.isbn = 'รูปแบบ ISBN ไม่ถูกต้อง (เช่น 978-616-123-456-7)';
      }
    }

    // Step 1 validation: Condition
    if (!formData.condition) {
      errs.condition = 'กรุณาเลือกสภาพหนังสือ';
    }

    // Step 2 validation: Price
    if (!formData.price) {
      errs.price = 'กรุณากรอกราคาที่ต้องการ';
    } else {
      const numPrice = Number(formData.price);
      if (isNaN(numPrice) || numPrice <= 0) {
        errs.price = 'ราคาต้องมากกว่า 0 บาท';
      } else if (numPrice > 50000) {
        errs.price = 'ราคาต้องไม่เกิน 50,000 บาท';
      }
    }

    // Step 2 validation: Original Price (optional)
    if (formData.originalPrice) {
      const numOrig = Number(formData.originalPrice);
      if (isNaN(numOrig) || numOrig <= 0) {
        errs.originalPrice = 'ราคาปกเดิมต้องมากกว่า 0 บาท';
      }
    }

    return errs;
  }, [formData, images]);

  // Step-specific validity checks
  const isStep0Valid = Boolean(
    images.length > 0 &&
    formData.title.trim().length >= 2 &&
    formData.author.trim().length >= 2 &&
    formData.category &&
    !errors.isbn
  );

  const isStep1Valid = Boolean(formData.condition);

  const isStep2Valid = Boolean(
    formData.price &&
    Number(formData.price) > 0 &&
    Number(formData.price) <= 50000 &&
    !errors.originalPrice
  );

  const isFormValid = isStep0Valid && isStep1Valid && isStep2Valid;

  // Track progress externally
  React.useEffect(() => {
    const completed: number[] = [];
    if (isStep0Valid) completed.push(0);
    if (isStep1Valid) completed.push(1);
    if (isStep2Valid) completed.push(2);

    onStepProgressChange?.(currentStep, completed);
  }, [currentStep, isStep0Valid, isStep1Valid, isStep2Valid, onStepProgressChange]);

  // Step navigation helpers
  const goToNextStep = () => {
    if (currentStep === 0) {
      if (!isStep0Valid) {
        setTouched((prev) => ({
          ...prev,
          image: true,
          title: true,
          author: true,
          category: true,
          isbn: true,
        }));
        return;
      }
      const next = 1;
      setCurrentStep(next);
      setMaxStepReached((prev) => Math.max(prev, next));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (currentStep === 1) {
      if (!isStep1Valid) {
        setTouched((prev) => ({ ...prev, condition: true }));
        return;
      }
      const next = 2;
      setCurrentStep(next);
      setMaxStepReached((prev) => Math.max(prev, next));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleStepJump = (stepIndex: number) => {
    if (stepIndex <= maxStepReached) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || submitStatus === 'loading') return;

    if (!isFormValid || images.length === 0) {
      setTouched({
        image: true,
        title: true,
        author: true,
        category: true,
        condition: true,
        price: true,
        originalPrice: true,
        isbn: true,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('loading');
    setSubmitErrorMessage(null);

    try {
      const primaryCover = images[0];
      await onSubmit(formData, primaryCover);
      setSubmitStatus('success');
    } catch (err: any) {
      logError('SellBookForm: submit failed', err);
      setSubmitStatus('error');
      setSubmitErrorMessage(err?.message || 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        width: '100%',
      }}
    >
      {/* 3-Step Progress Indicator */}
      <SellStepIndicator
        activeStep={currentStep}
        maxStepReached={maxStepReached}
        onStepClick={handleStepJump}
      />

      {/* Main Step Content Container */}
      <Box sx={{ mb: 4 }}>
        {/* STEP 0: ข้อมูลหนังสือ (รูปภาพ + ข้อมูลพื้นฐาน) */}
        {currentStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <BookImageUpload
              images={images}
              onImagesChange={(newImages) => {
                setImages(newImages);
                markTouched('image');
              }}
              error={errors.image}
              touched={touched.image}
            />

            <Divider sx={{ borderColor: '#E2EAF2' }} />

            <BookInfoForm
              title={formData.title}
              author={formData.author}
              category={formData.category}
              isbn={formData.isbn}
              onChange={handleChange}
              onBlur={markTouched}
              errors={errors}
              touched={touched}
            />
          </Box>
        )}

        {/* STEP 1: สภาพหนังสือ (เกณฑ์ 4 การ์ด + รายละเอียดเพิ่มเติม) */}
        {currentStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <ConditionSelector
              condition={formData.condition}
              defects={formData.defects}
              onChange={handleChange}
              onBlur={markTouched}
              errors={errors}
              touched={touched}
            />
          </Box>
        )}

        {/* STEP 2: การส่งต่อ (ราคาหนังสือ + รูปแบบการส่งมอบ) */}
        {currentStep === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <PricingSection
              price={formData.price}
              originalPrice={formData.originalPrice}
              onChange={handleChange}
              onBlur={markTouched}
              errors={errors}
              touched={touched}
            />

            <Divider sx={{ borderColor: '#E2EAF2' }} />

            <DeliverySelector
              value={formData.deliveryMethod || 'shipping'}
              onChange={handleDeliveryChange}
            />
          </Box>
        )}
      </Box>

      {/* Error message if submission failed */}
      {submitStatus === 'error' && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: '10px',
            bgcolor: '#FEF2F2',
            color: '#B91C1C',
            border: '1px solid #FECACA',
          }}
        >
          {submitErrorMessage || 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง'}
        </Alert>
      )}

      {/* Primary / Secondary CTA Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          alignItems: 'center',
          justifyContent: currentStep > 0 ? 'space-between' : 'flex-end',
          gap: 1.5,
          pt: 1,
        }}
      >
        {/* Back Button for Steps 1 and 2 */}
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outlined"
            onClick={goToPrevStep}
            disabled={isSubmitting}
            startIcon={<ArrowLeft size={18} />}
            sx={{
              height: 50,
              px: 3,
              borderRadius: '10px',
              borderColor: '#E2EAF2',
              color: '#0F2F52',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                borderColor: '#CBD5E1',
                bgcolor: '#F8FAFD',
              },
            }}
          >
            ย้อนกลับ
          </Button>
        )}

        {/* Next / Submit Button */}
        {currentStep < SELL_STEPS.length - 1 ? (
          <Button
            type="button"
            variant="contained"
            onClick={goToNextStep}
            endIcon={<ArrowRight size={18} />}
            sx={{
              height: 50,
              px: 4,
              borderRadius: '10px',
              bgcolor: '#1976D2',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              boxShadow: 'none',
              width: { xs: '100%', sm: currentStep === 0 ? '100%' : 'auto' },
              '&:hover': {
                bgcolor: '#1259A8',
                boxShadow: 'none',
              },
            }}
          >
            ถัดไป
          </Button>
        ) : isAuthenticated ? (
          <Button
            id="submit-sell-book-btn"
            type="submit"
            variant="contained"
            disabled={isSubmitting || submitStatus === 'loading'}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <CheckCircle2 size={18} />
              )
            }
            sx={{
              height: 50,
              px: 4,
              borderRadius: '10px',
              bgcolor: '#1976D2',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              boxShadow: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                bgcolor: '#1259A8',
                boxShadow: 'none',
              },
            }}
          >
            {isSubmitting ? 'กำลังส่งต่อ...' : 'ส่งต่อหนังสือ'}
          </Button>
        ) : (
          <Button
            id="login-to-sell-btn"
            type="button"
            variant="contained"
            onClick={() => navigate('/login', { state: { from: { pathname: '/sell' } } })}
            startIcon={<Lock size={18} />}
            sx={{
              height: 50,
              px: 4,
              borderRadius: '10px',
              bgcolor: '#1976D2',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              boxShadow: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                bgcolor: '#1259A8',
                boxShadow: 'none',
              },
            }}
          >
            เข้าสู่ระบบเพื่อส่งต่อหนังสือ
          </Button>
        )}
      </Box>
    </Box>
  );
};

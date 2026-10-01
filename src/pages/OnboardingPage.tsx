import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import {
  onboardingCategories,
  getCategoryThaiName,
  MIN_ONBOARDING_CATEGORIES,
  MAX_ONBOARDING_CATEGORIES,
} from '../data/onboarding';
import {
  getRecommendedBooks,
  getSiteBaseUrl,
  toBookPayload,
  saveOnboardingPreferences,
} from '../services/onboardingService';
import { trackEvent } from '../utils/analytics';
import { logError } from '../utils/logger';
import { formatCurrency } from '../utils/formatCurrency';

type Step = 'welcome' | 'interests' | 'books' | 'preview';

const STEP_LABEL: Record<Step, string> = {
  welcome: 'ขั้นตอน 1 / 4 — ต้อนรับ',
  interests: 'ขั้นตอน 2 / 4 — ความสนใจ',
  books: 'ขั้นตอน 3 / 4 — หนังสือที่ชอบ',
  preview: 'ขั้นตอน 4 / 4 — หนังสือสำหรับคุณ',
};

export default function OnboardingPage() {
  const { user, isLoading, isAuthenticated, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get('edit') === '1';

  const completed = user?.preferences?.onboardingCompleted === true;
  const [step, setStep] = useState<Step>(editMode ? 'interests' : 'welcome');
  const [selected, setSelected] = useState<string[]>(() => user?.preferences?.categories ?? []);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(() => user?.preferences?.favoriteBooks ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ตัวเลือกหนังสือจากหมวดที่เลือก (เล่มเด่นของหมวดก่อน แล้วเติมยอดนิยม)
  const candidateBooks = useMemo(() => getRecommendedBooks(selected, 12), [selected]);
  // Preview: ใช้เล่มที่กดชอบก่อน (ตามลำดับที่เลือก) ถ้าไม่มีค่อยใช้ตามหมวด
  const previewBooks = useMemo(() => {
    if (selectedBookIds.length > 0) {
      const picked = selectedBookIds
        .map((id) => candidateBooks.find((b) => b.id === id))
        .filter((b): b is NonNullable<typeof b> => Boolean(b));
      if (picked.length > 0) return [...picked, ...getRecommendedBooks(selected, 6).filter((b) => !picked.some((p) => p.id === b.id))].slice(0, 6);
    }
    return getRecommendedBooks(selected, 6);
  }, [selectedBookIds, candidateBooks, selected]);
  const selectedNames = useMemo(() => selected.map(getCategoryThaiName), [selected]);

  // โหมดแก้ไข: ถ้า user โหลดมาทีหลัง ให้เติมค่าที่เคยเลือกไว้
  const savedCategoriesKey = (user?.preferences?.categories ?? []).join(',');
  const savedBooksKey = (user?.preferences?.favoriteBooks ?? []).join(',');
  React.useEffect(() => {
    if (editMode && savedCategoriesKey) setSelected(savedCategoriesKey.split(','));
  }, [editMode, savedCategoriesKey]);
  React.useEffect(() => {
    if (editMode && savedBooksKey) setSelectedBookIds(savedBooksKey.split(','));
  }, [editMode, savedBooksKey]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }} role="status" aria-label="กำลังโหลด">
        <CircularProgress />
      </Box>
    );
  }
  if (!isAuthenticated || !user) return <Navigate to="/login?redirect=/onboarding" replace />;
  // ทำเสร็จแล้วไม่เด้งซ้ำ (ยกเว้นโหมดแก้ไขจากโปรไฟล์)
  if (completed && !editMode) return <Navigate to="/" replace />;

  const toggleCategory = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_ONBOARDING_CATEGORIES) return prev;
      return [...prev, id];
    });
  };

  const persist = async (categories: string[], bookIds: string[], skipped: boolean) => {
    setIsSaving(true);
    setError(null);
    try {
      const baseUrl = getSiteBaseUrl();
      const books = skipped ? [] : previewBooks.map((b) => toBookPayload(b, baseUrl));
      await saveOnboardingPreferences({ categories, favoriteBooks: bookIds, recommendedBooks: books, skipped });
      await refreshSession();
      trackEvent(skipped ? 'onboarding_skip' : 'onboarding_complete', {
        categories: categories.length,
        favoriteBooks: bookIds.length,
        editMode,
      });
      navigate(editMode ? '/account/profile' : '/', { replace: true });
    } catch (err: any) {
      logError('OnboardingPage: persist failed', err);
      setError(err?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      await persist([], [], true);
    } catch (e) {
      // ข้ามต้องสำเร็จเสมอ — ถ้าบันทึกไม่ได้ก็พาไปหน้าแรกเลย (จะไม่เด้ง onboarding ซ้ำเพราะแสดงเฉพาะหลังสมัคร)
      // แต่ต้องเห็นใน console ว่า persist ล้ม
      logError('OnboardingPage: skip-persist failed, navigating home anyway', e);
      navigate('/', { replace: true });
    }
  };

  const toggleBook = (id: string) => {
    setSelectedBookIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  // ต่อไปขั้นหนังสือ: ตัดเล่มที่ไม่อยู่ในหมวดใหม่ออก
  const goToBooksStep = () => {
    const validIds = new Set(candidateBooks.map((b) => b.id));
    setSelectedBookIds((prev) => prev.filter((id) => validIds.has(id)));
    setStep('books');
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 } }}>
      {/* Swiss top rule */}
      <Box sx={{ height: 6, bgcolor: '#0F6CF0', borderRadius: 1, mb: 5 }} aria-hidden="true" />

      <Typography
        variant="overline"
        component="p"
        sx={{ color: '#0F6CF0', fontWeight: 800, letterSpacing: '0.14em', mb: 2 }}
      >
        {editMode ? 'ปรับความสนใจของคุณ' : STEP_LABEL[step]}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} role="alert">
          {error}
        </Alert>
      )}

      {/* STEP 1 — Welcome */}
      {step === 'welcome' && (
        <Box component="section" aria-labelledby="onboarding-welcome-heading">
          <Typography
            id="onboarding-welcome-heading"
            variant="h1"
            sx={{
              fontWeight: 800,
              color: '#0B2A5B',
              fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              mb: 2.5,
            }}
          >
            ยินดีต้อนรับ
            <br />
            สู่ BookLoop<span style={{ color: '#0F6CF0' }}>.</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#54749E', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: 520, mb: 5 }}>
            ช่วยเรารู้จักคุณอีกนิด เพื่อแนะนำหนังสือที่ตรงกับความสนใจของคุณ — ใช้เวลาไม่ถึงหนึ่งนาที
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setStep('interests')}
              sx={{ bgcolor: '#0F6CF0', borderRadius: 2, px: 4, py: 1.5, fontWeight: 700 }}
            >
              เริ่มเลือกหนังสือที่ชอบ
            </Button>
            <Button variant="text" size="large" onClick={handleSkip} disabled={isSaving} sx={{ color: '#54749E' }}>
              ข้ามไปก่อน
            </Button>
          </Box>
        </Box>
      )}

      {/* STEP 2 — Interests */}
      {step === 'interests' && (
        <Box component="section" aria-labelledby="onboarding-interests-heading">
          <Typography
            id="onboarding-interests-heading"
            variant="h1"
            sx={{
              fontWeight: 800,
              color: '#0B2A5B',
              fontSize: { xs: '1.875rem', sm: '2.5rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            คุณชอบอ่านอะไรบ้าง?
          </Typography>
          <Typography variant="body1" sx={{ color: '#54749E', lineHeight: 1.7, mb: 1 }}>
            เลือกได้หลายหมวด เราจะนำไปใช้แนะนำหนังสือให้คุณ
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              size="small"
              variant="text"
              onClick={() => setSelected(onboardingCategories.slice(0, MAX_ONBOARDING_CATEGORIES).map((c) => c.id))}
              sx={{ color: '#0F6CF0', fontWeight: 700 }}
            >
              เลือกทั้งหมด
            </Button>
            <Button size="small" variant="text" onClick={() => setSelected([])} sx={{ color: '#54749E' }}>
              ล้างทั้งหมด
            </Button>
            <Typography variant="caption" sx={{ color: '#54749E', alignSelf: 'center', ml: 'auto' }} aria-live="polite">
              เลือกแล้ว {selected.length}/{MAX_ONBOARDING_CATEGORIES}
            </Typography>
          </Box>

          <Box role="group" aria-label="หมวดหนังสือที่สนใจ" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            {onboardingCategories.map(({ id, name, Icon }) => {
              const isSelected = selected.includes(id);
              const isDisabled = !isSelected && selected.length >= MAX_ONBOARDING_CATEGORIES;
              return (
                <Button
                  key={id}
                  variant={isSelected ? 'contained' : 'outlined'}
                  startIcon={<Icon />}
                  endIcon={isSelected ? <CheckIcon /> : undefined}
                  aria-pressed={isSelected}
                  aria-label={`${name}${isSelected ? ' (เลือกแล้ว)' : ''}`}
                  disabled={isDisabled}
                  onClick={() => toggleCategory(id)}
                  sx={{
                    borderRadius: 2,
                    px: 2.25,
                    py: 1.25,
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    textTransform: 'none',
                    ...(isSelected
                      ? { bgcolor: '#0F6CF0', color: '#fff', '&:hover': { bgcolor: '#0A4FC0' } }
                      : {
                          bgcolor: '#fff',
                          color: '#0B2A5B',
                          borderColor: '#C9DDF7',
                          '&:hover': { borderColor: '#0F6CF0', bgcolor: '#EAF2FE' },
                        }),
                  }}
                >
                  {name}
                </Button>
              );
            })}
          </Box>

          <Box aria-live="polite" sx={{ minHeight: 28, mb: 2 }}>
            {selected.length === 0 && !editMode && (
              <Typography variant="body2" sx={{ color: '#54749E' }}>
                เลือกอย่างน้อย 1 หมวดเพื่อดูหนังสือตัวอย่าง — หรือกด “ข้ามไปก่อน” ได้เลย
              </Typography>
            )}
            {selected.length > 0 && selected.length < MIN_ONBOARDING_CATEGORIES && (
              <Typography variant="body2" sx={{ color: '#0F6CF0', fontWeight: 600 }}>
                เลือกเพิ่มอีกนิด เพื่อให้เราแนะนำหนังสือได้แม่นยำขึ้น
              </Typography>
            )}
            {selected.length >= MAX_ONBOARDING_CATEGORIES && (
              <Typography variant="body2" sx={{ color: '#54749E' }}>
                เลือกได้สูงสุด {MAX_ONBOARDING_CATEGORIES} หมวด
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            {!editMode && (
              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => setStep('welcome')}
                sx={{ color: '#54749E' }}
              >
                ย้อนกลับ
              </Button>
            )}
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              disabled={selected.length === 0 || isSaving}
              onClick={goToBooksStep}
              sx={{ bgcolor: '#0F6CF0', borderRadius: 2, px: 4, py: 1.5, fontWeight: 700 }}
            >
              เลือกหนังสือที่ชอบ
            </Button>
            {!editMode && (
              <Button variant="text" onClick={handleSkip} disabled={isSaving} sx={{ color: '#54749E' }}>
                ข้ามไปก่อน
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* STEP 3 — Favorite books (multi-select) */}
      {step === 'books' && (
        <Box component="section" aria-labelledby="onboarding-books-heading">
          <Typography
            id="onboarding-books-heading"
            variant="h1"
            sx={{
              fontWeight: 800,
              color: '#0B2A5B',
              fontSize: { xs: '1.875rem', sm: '2.5rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            เล่มไหนโดนใจคุณ?
          </Typography>
          <Typography variant="body1" sx={{ color: '#54749E', lineHeight: 1.7, mb: 1 }}>
            แตะเลือกหนังสือที่ชอบได้หลายเล่ม เราจะใช้ปรับคำแนะนำให้ตรงใจยิ่งขึ้น
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center' }}>
            <Button size="small" variant="text" onClick={() => setSelectedBookIds([])} sx={{ color: '#54749E' }}>
              ล้างทั้งหมด
            </Button>
            <Typography variant="caption" sx={{ color: '#54749E', ml: 'auto' }} aria-live="polite">
              เลือกแล้ว {selectedBookIds.length} เล่ม
            </Typography>
          </Box>

          <Box role="group" aria-label="หนังสือที่ชอบ" sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {candidateBooks.map((book) => {
                const isPicked = selectedBookIds.includes(book.id);
                return (
                  <Grid size={{ xs: 6, sm: 4 }} key={book.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        height: '100%',
                        boxShadow: 'none',
                        border: isPicked ? '2px solid #0F6CF0' : '1px solid #C9DDF7',
                        bgcolor: isPicked ? '#EAF2FE' : '#fff',
                      }}
                    >
                      <CardActionArea
                        onClick={() => toggleBook(book.id)}
                        aria-pressed={isPicked}
                        aria-label={`${book.title}${isPicked ? ' (เลือกแล้ว)' : ''}`}
                        sx={{ height: '100%', alignItems: 'stretch' }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={book.cover}
                            alt={`ปกหนังสือ ${book.title}`}
                            loading="lazy"
                            sx={{ aspectRatio: '3/4', objectFit: 'cover', bgcolor: '#EAF2FE' }}
                          />
                          {isPicked && (
                            <CheckIcon
                              aria-hidden="true"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                fontSize: 28,
                                color: '#0F6CF0',
                                bgcolor: '#fff',
                                borderRadius: '50%',
                              }}
                            />
                          )}
                        </Box>
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: '#0B2A5B',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: '2.6em',
                              lineHeight: 1.3,
                              mb: 0.5,
                            }}
                          >
                            {book.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Chip label={book.category} size="small" sx={{ bgcolor: isPicked ? '#fff' : '#EAF2FE', color: '#0B2A5B', fontWeight: 700 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }} aria-label={`คะแนน ${book.rating} จาก 5`}>
                              <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                              <Typography variant="caption" sx={{ color: '#54749E', fontWeight: 700 }}>
                                {book.rating.toFixed(1)}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#0B2A5B' }}>
                            {formatCurrency(book.price)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Box aria-live="polite" sx={{ minHeight: 28, mb: 2 }}>
            {selectedBookIds.length === 0 && (
              <Typography variant="body2" sx={{ color: '#54749E' }}>
                แตะเลือกหนังสือที่ชอบอย่างน้อย 1 เล่มเพื่อไปต่อ
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep('interests')}
              sx={{ color: '#54749E' }}
            >
              เปลี่ยนหมวด
            </Button>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              disabled={selectedBookIds.length === 0 || isSaving}
              onClick={() => setStep('preview')}
              sx={{ bgcolor: '#0F6CF0', borderRadius: 2, px: 4, py: 1.5, fontWeight: 700 }}
            >
              ดูหนังสือสำหรับคุณ
            </Button>
            {!editMode && (
              <Button variant="text" onClick={handleSkip} disabled={isSaving} sx={{ color: '#54749E' }}>
                ข้ามไปก่อน
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* STEP 4 — Preview */}
      {step === 'preview' && (
        <Box component="section" aria-labelledby="onboarding-preview-heading">
          <Typography
            id="onboarding-preview-heading"
            variant="h1"
            sx={{
              fontWeight: 800,
              color: '#0B2A5B',
              fontSize: { xs: '1.875rem', sm: '2.5rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            นี่คือหนังสือที่เราคิดว่าคุณอาจชอบ
          </Typography>
          <Typography variant="body1" sx={{ color: '#54749E', lineHeight: 1.7, mb: 3 }}>
            {selectedBookIds.length > 0
              ? `จากหนังสือ ${selectedBookIds.length} เล่มที่คุณเลือก — ตัวเลือกของคุณกำลังปรับประสบการณ์ BookLoop แล้ว`
              : `จาก ${selectedNames.join(' · ')} — ตัวเลือกของคุณกำลังปรับประสบการณ์ BookLoop แล้ว`}
          </Typography>

          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {previewBooks.map((book) => (
              <Grid size={{ xs: 6, sm: 4 }} key={book.id}>
                <Card
                  component="article"
                  aria-label={book.title}
                  sx={{ borderRadius: 2, border: '1px solid #C9DDF7', boxShadow: 'none', height: '100%' }}
                >
                  <CardMedia
                    component="img"
                    image={book.cover}
                    alt={`ปกหนังสือ ${book.title}`}
                    loading="lazy"
                    sx={{ aspectRatio: '3/4', objectFit: 'cover', bgcolor: '#EAF2FE' }}
                  />
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: '#0B2A5B',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6em',
                        lineHeight: 1.3,
                        mb: 0.5,
                      }}
                    >
                      {book.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip label={book.category} size="small" sx={{ bgcolor: '#EAF2FE', color: '#0B2A5B', fontWeight: 700 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }} aria-label={`คะแนน ${book.rating} จาก 5`}>
                        <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                        <Typography variant="caption" sx={{ color: '#54749E', fontWeight: 700 }}>
                          {book.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0B2A5B' }}>
                      {formatCurrency(book.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep('books')}
              disabled={isSaving}
              sx={{ color: '#54749E' }}
            >
              เปลี่ยนหนังสือ
            </Button>
            <Button
              variant="contained"
              size="large"
              endIcon={isSaving ? undefined : <ArrowForwardIcon />}
              startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : undefined}
              disabled={isSaving}
              onClick={() => persist(selected, selectedBookIds, false)}
              sx={{ bgcolor: '#0F6CF0', borderRadius: 2, px: 4, py: 1.5, fontWeight: 700 }}
            >
              {isSaving ? 'กำลังบันทึก...' : editMode ? 'บันทึกความสนใจ' : 'เสร็จสิ้น ไปหน้าแรก'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

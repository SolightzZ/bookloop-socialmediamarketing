import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  Box,
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
  IconButton,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import {
  onboardingCategories,
  MAX_ONBOARDING_CATEGORIES,
  MIN_ONBOARDING_CATEGORIES,
} from '../../data/onboarding';
import {
  getRecommendedBooks,
  getSiteBaseUrl,
  toBookPayload,
  saveOnboardingPreferences,
} from '../../services/onboardingService';
import { trackEvent } from '../../utils/analytics';
import { formatCurrency } from '../../utils/formatCurrency';

type ModalStep = 'interests' | 'books' | 'preview';

const PROMPTED_KEY = 'bookloop_onboarding_prompted';

/**
 * Onboarding แบบ popup ซ้อนบนหน้าแรก — เด้งอัตโนมัติเฉพาะ user ที่ยังไม่เคยทำ
 * (ครั้งเดียวต่อ session, มีปุ่มภายหลัง/ข้าม — ข้ามแล้วบันทึก skipped จึงไม่เด้งซ้ำ)
 * เลือกเสร็จ → backend บันทึก + ส่ง personalized welcome email แบบ non-blocking
 */
export const OnboardingModal: React.FC = () => {
  const { user, isLoading, isAuthenticated, refreshSession } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>('interests');
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsOnboarding =
    isAuthenticated && !!user && user.preferences?.onboardingCompleted !== true;

  useEffect(() => {
    if (isLoading) return;
    if (needsOnboarding && !sessionStorage.getItem(PROMPTED_KEY)) {
      setOpen(true);
    } else if (!needsOnboarding) {
      setOpen(false);
    }
  }, [isLoading, needsOnboarding]);

  const candidateBooks = useMemo(() => getRecommendedBooks(selected, 12), [selected]);
  const pickedBooks = useMemo(
    () =>
      selectedBookIds
        .map((id) => candidateBooks.find((b) => b.id === id))
        .filter((b): b is NonNullable<typeof b> => Boolean(b)),
    [selectedBookIds, candidateBooks],
  );
  const previewBooks = useMemo(() => {
    if (pickedBooks.length > 0) {
      const pickedIds = new Set(pickedBooks.map((b) => b.id));
      return [...pickedBooks, ...getRecommendedBooks(selected, 6).filter((b) => !pickedIds.has(b.id))].slice(0, 6);
    }
    return getRecommendedBooks(selected, 6);
  }, [pickedBooks, selected]);

  const toggleCategory = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_ONBOARDING_CATEGORIES) return prev;
      return [...prev, id];
    });
  };

  const toggleBook = (id: string) => {
    setSelectedBookIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  const persist = async (categories: string[], bookIds: string[], skipped: boolean) => {
    setIsSaving(true);
    setError(null);
    try {
      const baseUrl = getSiteBaseUrl();
      const books = skipped ? [] : previewBooks.map((b) => toBookPayload(b, baseUrl));
      await saveOnboardingPreferences({ categories, favoriteBooks: bookIds, recommendedBooks: books, skipped });
      sessionStorage.setItem(PROMPTED_KEY, '1');
      await refreshSession();
      trackEvent(skipped ? 'onboarding_skip' : 'onboarding_complete', {
        categories: categories.length,
        favoriteBooks: bookIds.length,
        via: 'modal',
      });
      setOpen(false);
    } catch (err: any) {
      setError(err?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLater = () => {
    sessionStorage.setItem(PROMPTED_KEY, '1');
    setOpen(false);
  };

  const goToBooksStep = () => {
    const validIds = new Set(candidateBooks.map((b) => b.id));
    setSelectedBookIds((prev) => prev.filter((id) => validIds.has(id)));
    setStep('books');
  };

  const stepNo = step === 'interests' ? '1 / 3' : step === 'books' ? '2 / 3' : '3 / 3';

  return (
    <Dialog
      open={open}
      onClose={handleLater}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="onboarding-modal-heading"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: { xs: 0, sm: 3 },
          m: { xs: 0, sm: 3 },
          maxHeight: { xs: '100%', sm: 'calc(100% - 64px)' },
        },
      }}
    >
      <Box sx={{ height: 6, bgcolor: '#0F6CF0' }} aria-hidden="true" />
      <Box sx={{ p: { xs: 3, sm: 4 }, position: 'relative' }}>
        <IconButton
          onClick={handleLater}
          aria-label="ปิดไว้ก่อน"
          sx={{ position: 'absolute', top: 12, right: 12, color: '#54749E' }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="overline" component="p" sx={{ color: '#0F6CF0', fontWeight: 800, letterSpacing: '0.14em', mb: 1 }}>
          ปรับแต่ง BookLoop ของคุณ — {stepNo}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} role="alert">
            {error}
          </Alert>
        )}

        {/* ขั้น 1 — หมวด (เลือกหลายหมวดได้) */}
        {step === 'interests' && (
          <Box component="section" aria-labelledby="onboarding-modal-heading">
            <Typography id="onboarding-modal-heading" variant="h2" component="h2" sx={{ fontWeight: 800, color: '#0B2A5B', fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em', mb: 1 }}>
              คุณชอบอ่านอะไรบ้าง?
            </Typography>
            <Typography variant="body2" sx={{ color: '#54749E', lineHeight: 1.7, mb: 2 }}>
              เลือกได้หลายหมวด เราจะนำไปใช้แนะนำหนังสือให้คุณ
            </Typography>
            <Box role="group" aria-label="หมวดหนังสือที่สนใจ" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5, maxHeight: 300, overflowY: 'auto' }}>
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
                    size="small"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: 'none',
                      ...(isSelected
                        ? { bgcolor: '#0F6CF0', color: '#fff', '&:hover': { bgcolor: '#0A4FC0' } }
                        : { bgcolor: '#fff', color: '#0B2A5B', borderColor: '#C9DDF7', '&:hover': { borderColor: '#0F6CF0', bgcolor: '#EAF2FE' } }),
                    }}
                  >
                    {name}
                  </Button>
                );
              })}
            </Box>
            <Box aria-live="polite" sx={{ minHeight: 24, mb: 1.5 }}>
              <Typography variant="caption" sx={{ color: selected.length > 0 && selected.length < MIN_ONBOARDING_CATEGORIES ? '#0F6CF0' : '#54749E', fontWeight: selected.length > 0 && selected.length < MIN_ONBOARDING_CATEGORIES ? 700 : 400 }}>
                เลือกแล้ว {selected.length}/{MAX_ONBOARDING_CATEGORIES}
                {selected.length > 0 && selected.length < MIN_ONBOARDING_CATEGORIES && ' — เลือกเพิ่มอีกนิดจะแนะนำได้แม่นขึ้น'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <Button variant="contained" endIcon={<ArrowForwardIcon />} disabled={selected.length === 0 || isSaving} onClick={goToBooksStep} sx={{ bgcolor: '#0F6CF0', borderRadius: 2, fontWeight: 700 }}>
                เลือกหนังสือที่ชอบ
              </Button>
              <Button variant="text" onClick={() => persist([], [], true)} disabled={isSaving} sx={{ color: '#54749E' }}>
                ข้าม
              </Button>
              <Button variant="text" onClick={handleLater} sx={{ color: '#54749E' }}>
                ไว้ภายหลัง
              </Button>
            </Box>
          </Box>
        )}

        {/* ขั้น 2 — หนังสือที่ชอบ */}
        {step === 'books' && (
          <Box component="section" aria-label="เลือกหนังสือที่ชอบ">
            <Typography variant="h2" component="h2" sx={{ fontWeight: 800, color: '#0B2A5B', fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em', mb: 1 }}>
              เล่มไหนโดนใจคุณ?
            </Typography>
            <Typography variant="body2" sx={{ color: '#54749E', mb: 2 }} aria-live="polite">
              แตะเลือกได้หลายเล่ม — เลือกแล้ว {selectedBookIds.length} เล่ม
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: 2, maxHeight: 380, overflowY: 'auto' }}>
              {candidateBooks.map((book) => {
                const isPicked = selectedBookIds.includes(book.id);
                return (
                  <Grid size={{ xs: 6, sm: 4 }} key={book.id}>
                    <Card sx={{ borderRadius: 2, height: '100%', boxShadow: 'none', border: isPicked ? '2px solid #0F6CF0' : '1px solid #C9DDF7', bgcolor: isPicked ? '#EAF2FE' : '#fff' }}>
                      <CardActionArea onClick={() => toggleBook(book.id)} aria-pressed={isPicked} aria-label={`${book.title}${isPicked ? ' (เลือกแล้ว)' : ''}`} sx={{ height: '100%' }}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia component="img" image={book.cover} alt={`ปกหนังสือ ${book.title}`} loading="lazy" sx={{ aspectRatio: '3/4', objectFit: 'cover', bgcolor: '#EAF2FE' }} />
                          {isPicked && (
                            <CheckIcon aria-hidden="true" sx={{ position: 'absolute', top: 6, right: 6, fontSize: 26, color: '#0F6CF0', bgcolor: '#fff', borderRadius: '50%' }} />
                          )}
                        </Box>
                        <CardContent sx={{ p: 1.25 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0B2A5B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5em', lineHeight: 1.3, fontSize: '0.8rem' }}>
                            {book.title}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#0B2A5B', fontSize: '0.85rem' }}>
                            {formatCurrency(book.price)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => setStep('interests')} sx={{ color: '#54749E' }}>
                เปลี่ยนหมวด
              </Button>
              <Button variant="contained" endIcon={<ArrowForwardIcon />} disabled={selectedBookIds.length === 0 || isSaving} onClick={() => setStep('preview')} sx={{ bgcolor: '#0F6CF0', borderRadius: 2, fontWeight: 700 }}>
                ดูสรุป
              </Button>
            </Box>
          </Box>
        )}

        {/* ขั้น 3 — สรุป + เสร็จ (ส่งอีเมล) */}
        {step === 'preview' && (
          <Box component="section" aria-label="สรุปความสนใจ">
            <Typography variant="h2" component="h2" sx={{ fontWeight: 800, color: '#0B2A5B', fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em', mb: 1 }}>
              พร้อมปรับ BookLoop ให้เป็นของคุณ
            </Typography>
            <Typography variant="body2" sx={{ color: '#54749E', mb: 2 }}>
              กดเสร็จสิ้น ระบบจะบันทึกความสนใจและส่งอีเมลหนังสือแนะนำไปที่กล่องจดหมายของคุณ
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }} aria-label="หมวดที่เลือก">
              {selected.map((id) => (
                <Chip key={id} label={onboardingCategories.find((c) => c.id === id)?.name ?? id} size="small" sx={{ bgcolor: '#EAF2FE', color: '#0B2A5B', fontWeight: 700 }} />
              ))}
            </Box>
            <Box sx={{ mb: 2, maxHeight: 260, overflowY: 'auto' }}>
              {previewBooks.map((book) => (
                <Box key={book.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: '1px solid #C9DDF7' }}>
                  <Box component="img" src={book.cover} alt="" loading="lazy" sx={{ width: 36, height: 48, objectFit: 'cover', borderRadius: 1, border: '1px solid #C9DDF7', bgcolor: '#EAF2FE' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0B2A5B', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {book.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                    <Typography variant="caption" sx={{ color: '#54749E', fontWeight: 700 }}>{book.rating.toFixed(1)}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0B2A5B' }}>{formatCurrency(book.price)}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => setStep('books')} disabled={isSaving} sx={{ color: '#54749E' }}>
                เปลี่ยนหนังสือ
              </Button>
              <Button
                variant="contained"
                endIcon={isSaving ? undefined : <ArrowForwardIcon />}
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : undefined}
                disabled={isSaving}
                onClick={() => persist(selected, selectedBookIds, false)}
                sx={{ bgcolor: '#0F6CF0', borderRadius: 2, fontWeight: 700 }}
              >
                {isSaving ? 'กำลังบันทึก...' : 'เสร็จสิ้น'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

import React, { useMemo } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import {
  AutoAwesomeRounded,
  MenuBookRounded,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BookDiscoveryProps } from './bookDiscovery.types';
import { useBookDiscovery } from './useBookDiscovery';
import { BookDiscoveryScene } from './BookDiscoveryScene';
import { BookDiscoveryButton } from './BookDiscoveryButton';
import { BookDiscoveryResult } from './BookDiscoveryResult';
import { BookMoodSelector } from './BookMoodSelector';
import { DiscoveryEffects } from './DiscoveryEffects';
import { BookOrbit } from './BookOrbit';
import { trackEvent } from '../../utils/analytics';
import { books as defaultBooks } from '../../data/books';

export const BookDiscovery: React.FC<BookDiscoveryProps> = ({
  books,
  onSelectBook,
  className = '',
  testMode = false,
}) => {
  const navigate = useNavigate();

  const {
    state,
    selectedBook,
    currentCyclingBook,
    candidateBooks,
    selectedMood,
    setSelectedMood,
    startDiscovery,
    isRunning,
    isReducedMotion,
    error,
    setHoverState,
  } = useBookDiscovery({
    books,
    onSelect: onSelectBook,
    testMode,
  });

  const availableBooks = books || defaultBooks;
  const defaultBook = useMemo(() => {
    if (!availableBooks || availableBooks.length === 0) return defaultBooks[0];
    const featuredBook = availableBooks.find((b) => b.featured && (b.stock ?? 1) > 0);
    return featuredBook || availableBooks[0];
  }, [availableBooks]);

  const activeDisplayBook = selectedBook || (isRunning ? currentCyclingBook : null) || defaultBook;
  const isInitialRecommendation = !selectedBook && state === 'idle';

  const handleStart = () => {
    trackEvent('random_book_click', {
      previousState: state,
      mood: selectedMood,
    });
    startDiscovery();
  };

  return (
    <section
      aria-labelledby="book-discovery-heading"
      className={`relative w-full py-7 sm:py-9 md:py-10 bg-[#F8FAFC] border-y border-slate-200/80 overflow-hidden ${className}`}
    >
      {/* Clean subtle dot pattern */}
      <DiscoveryEffects isReducedMotion={isReducedMotion} />

      {/* Screen reader live announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isRunning && 'กำลังสุ่มและลุ้นหนังสือที่ใช่ในวงโคจร กรุณารอสักครู่...'}
        {state === 'result' && selectedBook && `พบหนังสือที่เลือกให้คุณ: ${selectedBook.title} โดย ${selectedBook.author} ราคา ${selectedBook.price} บาท`}
        {error && error}
      </div>

      <Container maxWidth="lg" sx={{ maxWidth: '1120px !important' }} className="relative z-10 px-4 sm:px-6">
        {/* 1. Header (Compact, Professional) */}
        <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              bgcolor: '#FFFFFF',
              border: '1px solid #BFDBFE',
              borderRadius: 9999,
              py: 0.35,
              px: 1.5,
              mb: 0.8,
            }}
          >
            <AutoAwesomeRounded sx={{ fontSize: 13, color: '#1976D2' }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#1976D2',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.7rem',
              }}
            >
              DISCOVER WITH BOOKLOOP
            </Typography>
          </Box>

          <Typography
            id="book-discovery-heading"
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.85rem' },
              color: '#0F2D4A',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            วันนี้ไม่รู้จะอ่านอะไร? <Box component="span" sx={{ color: '#1976D2' }}>ให้ BookLoop เลือกให้คุณ</Box>
          </Typography>
        </Box>

        {/* 2. Compact Mood Selector */}
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <BookMoodSelector
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
            disabled={isRunning}
          />
        </Box>

        {/* 3. Empty State / Error Handler */}
        {error && state === 'error' && (
          <Box
            sx={{
              maxWidth: 480,
              mx: 'auto',
              textAlign: 'center',
              bgcolor: '#FFFFFF',
              p: 3,
              borderRadius: 4,
              border: '1px solid #E2E8F0',
            }}
          >
            <MenuBookRounded sx={{ fontSize: 40, color: '#94A3B8', mb: 1.5 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F2D4A', mb: 0.5 }}>
              {error}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2, fontSize: '0.85rem' }}>
              ลองเปิดดูรายการหนังสือทั้งหมดในคลัง หรือกลับมาสุ่มใหม่อีกครั้ง
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/books')}
              endIcon={<ArrowForwardRounded sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: '#1976D2',
                borderRadius: 9999,
                py: 1,
                px: 3,
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'none',
              }}
            >
              ดูหนังสือทั้งหมด
            </Button>
          </Box>
        )}

        {/* 4. Professional Two-Column Layout: Left = Randomizer, Right = Selected Book */}
        {(!error || state !== 'error') && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1.15fr', lg: '4.8fr 7.2fr' },
              gap: { xs: 2, sm: 2.5, md: 3 },
              alignItems: 'stretch',
            }}
          >
            {/* LEFT COLUMN: Randomizer Scene & Controls (สุ่มวางไว้ที่ทางซ้าย) */}
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3.5,
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 10px rgba(15, 45, 74, 0.04)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Stage Top Bar */}
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: isRunning ? '#F59E0B' : state === 'result' ? '#10B981' : '#1976D2',
                      animation: isRunning ? 'pulse 1s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.4, transform: 'scale(1.3)' },
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem' }}>
                    {isRunning
                      ? 'กำลังค้นหาในวงโคจร...'
                      : state === 'result'
                      ? 'สุ่มหนังสือสำเร็จ'
                      : 'วงโคจรสุ่มหนังสือ'}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: '#F1F5F9',
                    color: '#64748B',
                    px: 1,
                    py: 0.2,
                    borderRadius: 9999,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                  }}
                >
                  Interactive 3D
                </Typography>
              </Box>

              {/* 3D Orbit Stage */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 190, sm: 210, md: 225 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  my: 'auto',
                  cursor: isRunning ? 'default' : 'pointer',
                }}
                onClick={!isRunning ? handleStart : undefined}
                role="button"
                tabIndex={0}
                aria-label="คลิกเพื่อสุ่มหนังสือในวงโคจร"
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isRunning) {
                    e.preventDefault();
                    handleStart();
                  }
                }}
              >
                <BookDiscoveryScene
                  state={state}
                  selectedBook={selectedBook}
                  currentCyclingBook={currentCyclingBook}
                  candidateBooks={candidateBooks}
                  isReducedMotion={isReducedMotion}
                  onSceneClick={handleStart}
                  onPointerEnter={() => setHoverState(true)}
                  onPointerLeave={() => setHoverState(false)}
                />
                <BookOrbit state={state} isReducedMotion={isReducedMotion} />
              </Box>

              {/* Action Button & Hint */}
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 1.5 }}>
                <BookDiscoveryButton
                  state={state}
                  onClick={handleStart}
                  onMouseEnter={() => setHoverState(true)}
                  onMouseLeave={() => setHoverState(false)}
                  className="w-full sm:w-auto"
                />
                <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem', textAlign: 'center' }}>
                  {state === 'result'
                    ? '💡 หากยังไม่โดนใจ กดสุ่มอีกครั้งเพื่อค้นพบเล่มใหม่'
                    : '💡 คลิกที่วงโคจรหรือกดปุ่มเพื่อเริ่มค้นพบหนังสือ'}
                </Typography>
              </Box>
            </Paper>

            {/* RIGHT COLUMN: Book Selected by BookLoop (หนังสือที่ได้ BookLoop เลือกให้คุณ อยู่ทางด้านขวา) */}
            <Box sx={{ height: '100%' }}>
              <BookDiscoveryResult
                book={activeDisplayBook}
                onRollAgain={handleStart}
                isReducedMotion={isReducedMotion}
                mood={selectedMood}
                state={state}
                isInitial={isInitialRecommendation}
                isRunning={isRunning}
              />
            </Box>
          </Box>
        )}
      </Container>
    </section>
  );
};

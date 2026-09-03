import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
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
      className={`relative w-full py-12 md:py-16 bg-[#F8FAFC] border-y border-slate-200/80 overflow-hidden ${className}`}
    >
      {/* Clean subtle dot pattern (Zero glow, zero blur) */}
      <DiscoveryEffects isReducedMotion={isReducedMotion} />

      {/* Screen reader live announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isRunning && 'กำลังสุ่มและลุ้นหนังสือที่ใช่ในวงโคจร กรุณารอสักครู่...'}
        {state === 'result' && selectedBook && `พบหนังสือที่เลือกให้คุณ: ${selectedBook.title} โดย ${selectedBook.author} ราคา ${selectedBook.price} บาท`}
        {error && error}
      </div>

      <Container maxWidth="lg" sx={{ maxWidth: '1080px !important' }} className="relative z-10 px-4 sm:px-6">
        {/* 1. Header (Compact 32–38px Heading) */}
        <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 3 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              bgcolor: '#FFFFFF',
              border: '1px solid #BFDBFE',
              borderRadius: 9999,
              py: 0.4,
              px: 1.6,
              mb: 1,
            }}
          >
            <AutoAwesomeRounded sx={{ fontSize: 14, color: '#1976D2' }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#1976D2',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.72rem',
              }}
            >
              DISCOVER SOMETHING NEW
            </Typography>
          </Box>

          <Typography
            id="book-discovery-heading"
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.65rem', sm: '2rem', md: '2.25rem' },
              color: '#0F2D4A',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              mb: 0.8,
            }}
          >
            วันนี้ไม่รู้จะอ่านอะไร? <span className="text-[#1976D2]">ให้ BookLoop เลือกให้คุณ</span>
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#64748B',
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
              maxWidth: 540,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            ค้นพบหนังสือเล่มถัดไปในวงโคจรการอ่าน พร้อมส่งต่อความรู้สึกดีๆ
          </Typography>
        </Box>

        {/* 2. Compact Mood Selector */}
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
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

        {/* 4. Compact Interactive Scene & Button */}
        {(!error || state !== 'error') && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '840px',
              mx: 'auto',
            }}
          >
            {/* Compact Three.js Scene: 480–560px × 260–320px */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                height: { xs: 260, sm: 290, md: 310 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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

              {/* Orbit Overlay */}
              <BookOrbit state={state} isReducedMotion={isReducedMotion} />
            </Box>

            {/* Primary Action Button (180–220px width) */}
            <Box sx={{ mt: 1.5, zIndex: 10 }}>
              <BookDiscoveryButton
                state={state}
                onClick={handleStart}
                onMouseEnter={() => setHoverState(true)}
                onMouseLeave={() => setHoverState(false)}
              />
            </Box>

            {/* Compact Result Card (520–640px) */}
            {selectedBook && state === 'result' && (
              <Box
                sx={{
                  width: '100%',
                  mt: 3,
                  zIndex: 20,
                }}
              >
                <BookDiscoveryResult
                  book={selectedBook}
                  onRollAgain={handleStart}
                  isReducedMotion={isReducedMotion}
                  mood={selectedMood}
                />
              </Box>
            )}
          </Box>
        )}
      </Container>
    </section>
  );
};

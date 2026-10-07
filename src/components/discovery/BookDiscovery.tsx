import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { ArrowForwardRounded, RefreshRounded, AutoAwesomeRounded, MenuBookRounded } from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BookDiscoveryProps } from './bookDiscovery.types';
import { useBookDiscovery } from './useBookDiscovery';
import { BookDiscoveryButton } from './BookDiscoveryButton';
import { BookMoodSelector } from './BookMoodSelector';
import { BookDiscoveryResult } from './BookDiscoveryResult';
import { DiscoveryEffects } from './DiscoveryEffects';
import { trackEvent } from '../../utils/analytics';
import { books as defaultBooks } from '../../data/books';

const BookGachaScene = React.lazy(() => import('./BookGachaScene').then((m) => ({ default: m.BookGachaScene })));

/**
 * BookDiscovery — Soft Swiss Editorial Discovery with PopUp Details
 *
 * Implements:
 * - Soft Swiss Editorial aesthetic (BookLoop Blue #1677E8, Deep Navy #102F4F, Soft Blue #EAF4FF, Border #DCEEFF)
 * - Zero glowing/flashy neon effects
 * - All book information (Archive, Condition, Title, Author, Price, Story) is shown inside the PopUp Modal
 * - 100% emoji-free with clean SVG icons
 */
export const BookDiscovery: React.FC<BookDiscoveryProps> = ({ books, onSelectBook, className = '', testMode = false }) => {
   const navigate = useNavigate();
   const [isPopUpOpen, setIsPopUpOpen] = useState(false);

   const { state, selectedBook, currentCyclingBook, candidateBooks, selectedMood, setSelectedMood, startDiscovery, isRunning, isReducedMotion, error, hasRandomizedOnce } = useBookDiscovery({
      books,
      onSelect: onSelectBook,
      testMode,
   });

   // Automatically pop up the book details when a randomized result is ready
   useEffect(() => {
      if (state === 'result') {
         setIsPopUpOpen(true);
      }
   }, [state]);

   const availableBooks = books || defaultBooks;
   const defaultBook = useMemo(() => {
      if (!availableBooks || availableBooks.length === 0) return defaultBooks[0];
      const featuredBook = availableBooks.find((b) => b.featured && (b.stock ?? 1) > 0);
      return featuredBook || availableBooks[0];
   }, [availableBooks]);

   const activeDisplayBook = selectedBook || (isRunning ? currentCyclingBook : null) || defaultBook;

   const handleStart = useCallback(() => {
      if (isRunning) return;
      setIsPopUpOpen(false);

      // Smoothly ensure the 3D gacha animation section is clearly visible
      const section = document.getElementById('book-discovery-section');
      if (section) {
         const rect = section.getBoundingClientRect();
         if (rect.top < -60 || rect.bottom > window.innerHeight + 100) {
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
      }

      trackEvent('random_book_click', {
         previousState: state,
         mood: selectedMood,
      });
      startDiscovery();
   }, [isRunning, selectedMood, startDiscovery, state]);

   return (
      <Box
         component="section"
         id="book-discovery-section"
         aria-labelledby="book-discovery-heading"
         sx={{
            py: { xs: 7, sm: 9, md: 11 },
            background: 'linear-gradient(180deg, #F0F7FF 0%, #E4F1FF 45%, #EDF6FF 80%, #F5FAFF 100%)',
            borderTop: '1px solid #DCEEFF',
            borderBottom: '1px solid #DCEEFF',
            position: 'relative',
            overflow: 'hidden',
         }}
         className={className}>
         {/* Soft Swiss Background (Clean editorial, zero glow) */}
         <DiscoveryEffects isReducedMotion={isReducedMotion} />

         {/* Screen reader live announcements (zero emojis) */}
         <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {isRunning && 'กำลังเลือกหนังสือให้คุณ กรุณารอสักครู่...'}
            {state === 'result' && activeDisplayBook && `พบหนังสือที่เลือกให้คุณ: ${activeDisplayBook.title} โดย ${activeDisplayBook.author} ราคา ${activeDisplayBook.price} บาท`}
            {error && error}
         </div>

         <Container maxWidth="lg" sx={{ maxWidth: '1080px !important', position: 'relative', zIndex: 1 }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3.5, sm: 4.5 } }}>
               <Typography
                  id="book-discovery-heading"
                  variant="h2"
                  component="h2"
                  sx={{
                     fontWeight: 800, 
                     fontSize: { xs: '1.55rem', sm: '2rem', md: '2.35rem' },
                     color: '#102F4F',
                     letterSpacing: '-0.02em',
                     lineHeight: 1.25,
                     mb: 3,
                  }}>
                  ให้ BookLoop เลือก
                  <Box component="span" sx={{ color: '#1677E8', ml: 0.75 }}>
                     หนังสือเล่มถัดไปให้คุณ
                  </Box>
               </Typography>

               {/* Mood Selector (Soft Pastel Pills) */}
               <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                  <BookMoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} disabled={isRunning} />
               </Box>

               {/* 3D Gacha Pull Animation Stage (Three.js Desktop, Tablet, Mobile) */}
               <Box
                  sx={{
                     position: 'relative',
                     maxWidth: { xs: '100%', sm: 580, md: 640 },
                     mx: 'auto',
                     mb: { xs: 2.5, sm: 3 },
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}>
                  <React.Suspense
                     fallback={
                        <Box
                           sx={{
                              width: '100%',
                              maxWidth: 620,
                              height: { xs: 300, sm: 350, md: 390 },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                           }}>
                           <Box
                              sx={{
                                 width: 140,
                                 height: 200,
                                 borderRadius: 3,
                                 border: '2px dashed #BAE6FD',
                                 bgcolor: 'rgba(240, 247, 255, 0.6)',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 gap: 1.5,
                              }}>
                              <MenuBookRounded sx={{ color: '#1677E8', fontSize: 32, opacity: 0.6 }} />
                              <Typography variant="caption" sx={{ color: '#102F4F', fontWeight: 600, fontSize: '0.75rem' }}>
                                 กำลังจัดเตรียมหนังสือ...
                              </Typography>
                           </Box>
                        </Box>
                     }>
                     <BookGachaScene
                        state={state}
                        selectedBook={selectedBook}
                        currentCyclingBook={currentCyclingBook}
                        candidateBooks={candidateBooks}
                        isReducedMotion={isReducedMotion}
                        onSceneClick={handleStart}
                     />
                  </React.Suspense>
               </Box>

               {/* Action Button */}
               <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <BookDiscoveryButton state={state} onClick={handleStart} hasRandomizedOnce={hasRandomizedOnce} />
               </Box>
            </Box>

            {/* Error State */}
            {error && state === 'error' && (
               <Box
                  sx={{
                     maxWidth: 480,
                     mx: 'auto',
                     textAlign: 'center',
                     bgcolor: '#FFFFFF',
                     p: { xs: 3, sm: 4 },
                     borderRadius: '20px',
                     border: '1px solid #DCEEFF',
                     boxShadow: '0 8px 30px rgba(16, 47, 79, 0.05)',
                     mt: 3,
                  }}>
                  <MenuBookRounded sx={{ fontSize: 44, color: '#1677E8', mb: 1.5 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#102F4F', mb: 0.5, fontSize: '1.05rem' }}>
                     {error}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 2.5, fontSize: '0.85rem' }}>
                     ระบบไม่สามารถเลือกหนังสือได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือเปิดดูรายการหนังสือทั้งหมดในคลัง
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                     <Button
                        variant="contained"
                        onClick={handleStart}
                        startIcon={<RefreshRounded sx={{ fontSize: 16 }} />}
                        sx={{
                           bgcolor: '#1677E8',
                           borderRadius: '12px',
                           py: 1,
                           px: 2.5,
                           fontWeight: 700,
                           fontSize: '0.85rem',
                           textTransform: 'none',
                           boxShadow: 'none',
                           '&:hover': { bgcolor: '#1264C4' },
                        }}>
                        ลองอีกครั้ง
                     </Button>
                     <Button
                        variant="outlined"
                        onClick={() => navigate('/books')}
                        endIcon={<ArrowForwardRounded sx={{ fontSize: 16 }} />}
                        sx={{
                           borderColor: '#DCEEFF',
                           color: '#1677E8',
                           borderRadius: '12px',
                           py: 1,
                           px: 2.5,
                           fontWeight: 700,
                           fontSize: '0.85rem',
                           textTransform: 'none',
                           '&:hover': { bgcolor: '#F8FBFF', borderColor: '#B9D9FF' },
                        }}>
                        ดูหนังสือทั้งหมด
                     </Button>
                  </Box>
               </Box>
            )}
         </Container>

         {/* Accessible PopUp Modal (Soft Swiss Editorial - Zero Glow, Soft Light Backdrop) */}
         <AnimatePresence>
            {isPopUpOpen && activeDisplayBook && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-[3px]"
                  onClick={() => !isRunning && setIsPopUpOpen(false)}>
                  <motion.div
                     initial={{ opacity: 0, scale: 0.94, y: 12 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.94, y: 12 }}
                     transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                     className="w-full max-w-[620px] relative max-h-[96%]"
                     onClick={(e) => e.stopPropagation()}>
                     <BookDiscoveryResult
                        book={activeDisplayBook}
                        onRollAgain={handleStart}
                        onClose={() => setIsPopUpOpen(false)}
                        isReducedMotion={isReducedMotion}
                        mood={selectedMood}
                        state={state}
                        isRunning={isRunning}
                     />
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </Box>
   );
};

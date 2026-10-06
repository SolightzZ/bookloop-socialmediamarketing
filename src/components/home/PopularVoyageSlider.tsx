import React, { useCallback, useRef, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../../data/books';
import { SafeImage } from '../common/SafeImage';
import { TiltCard } from '../common/TiltCard';
import { useWishlist } from '../../hooks/useWishlist';
import { trackEvent } from '../../utils/analytics';
import './PopularVoyageSlider.css';

export interface PopularVoyageSliderProps {
   books: Book[];
}

type SlideRole = 'previous' | 'current' | 'next';

/** Modular wrap so the slider works with any number of books (not just 3). */
const wrapIndex = (n: number, max: number): number => ((n % max) + max) % max;

const SWIPE_THRESHOLD_PX = 40;

/**
 * PopularVoyageSlider — 3D Showcase Carousel for popular books.
 * Features:
 * - 3D Perspective book covers with subtle tilt on hover
 * - Interactive pagination dots (จุดประบอกตำแหน่งสไลด์)
 * - Pure book cover presentation with touch swipe, keyboard navigation, and wishlist support
 */
export const PopularVoyageSlider: React.FC<PopularVoyageSliderProps> = ({ books }) => {
   const navigate = useNavigate();
   const { toggleWishlist, isInWishlist } = useWishlist();
   const [currentIndex, setCurrentIndex] = useState(0);
   const touchStartXRef = useRef<number | null>(null);

   const count = books.length;

   const goTo = useCallback(
      (index: number) => {
         if (count > 0) setCurrentIndex(wrapIndex(index, count));
      },
      [count],
   );
   const goNext = useCallback(() => {
      if (count > 0) setCurrentIndex((i) => wrapIndex(i + 1, count));
   }, [count]);
   const goPrevious = useCallback(() => {
      if (count > 0) setCurrentIndex((i) => wrapIndex(i - 1, count));
   }, [count]);

   const openBook = useCallback(
      (book: Book) => {
         trackEvent('view_product', { bookId: book.id, title: book.title, price: book.price });
         navigate(`/books/${book.id}`);
      },
      [navigate],
   );

   const handleTouchStart = useCallback((e: React.TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
   }, []);

   const handleTouchEnd = useCallback(
      (e: React.TouchEvent) => {
         if (touchStartXRef.current === null) return;
         const dx = e.changedTouches[0].clientX - touchStartXRef.current;
         touchStartXRef.current = null;
         if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
         if (dx < 0) goNext();
         else goPrevious();
      },
      [goNext, goPrevious],
   );

   if (count === 0) return null;

   const nextIndex = wrapIndex(currentIndex + 1, count);
   const prevIndex = wrapIndex(currentIndex - 1, count);

   const getRole = (i: number): SlideRole | undefined => {
      if (i === currentIndex) return 'current';
      if (count > 1 && i === nextIndex) return 'next';
      if (count > 2 && i === prevIndex) return 'previous';
      return undefined;
   };

   return (
      <Box
         className="pv-slider"
         role="region"
         aria-roledescription="carousel"
         aria-label="หนังสือยอดนิยม"
         tabIndex={0}
         onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
               e.preventDefault();
               goNext();
            } else if (e.key === 'ArrowLeft') {
               e.preventDefault();
               goPrevious();
            }
         }}
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}>
         <div className="pv-viewport">
            {/* 3D Book Covers */}
            <div className="pv-slides">
               {books.map((book, i) => {
                  const role = getRole(i);
                  const isCurrent = role === 'current';
                  const isFavorite = isInWishlist(book.id);
                  return (
                     <div
                        key={book.id}
                        className="pv-slide"
                        data-role={role}
                        aria-hidden={!isCurrent}
                        role={isCurrent ? 'button' : undefined}
                        tabIndex={isCurrent ? 0 : undefined}
                        aria-label={isCurrent ? `${book.title} โดย ${book.author} ราคา ${book.price} บาท` : undefined}
                        onClick={() => (isCurrent ? openBook(book) : goTo(i))}
                        onKeyDown={(e) => {
                           if (isCurrent && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault();
                              openBook(book);
                           }
                        }}>
                        <div className="pv-slide__inner">
                           <TiltCard className="pv-tilt group" scaleHover={1}>
                              <div className="pv-cover">
                                 <SafeImage src={book.cover} alt={isCurrent ? `ปกหนังสือ ${book.title}` : ''} fallbackTitle={book.title} objectFit="cover" loading="lazy" />
                                 <span className="pv-category">{book.category}</span>
                                 {isCurrent && (
                                    <Tooltip title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกในรายการโปรด'}>
                                       <IconButton
                                          size="small"
                                          aria-label={isFavorite ? `นำ ${book.title} ออกจากรายการโปรด` : `บันทึก ${book.title} ในรายการโปรด`}
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             toggleWishlist(book);
                                          }}
                                          sx={{
                                             position: 'absolute',
                                             top: 10,
                                             right: 10,
                                             bgcolor: '#FFFFFF',
                                             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                                             p: 0.75,
                                             transition: 'transform 150ms ease, background-color 150ms ease',
                                             '&:hover': {
                                                bgcolor: '#FFFFFF',
                                                transform: 'scale(1.08)',
                                             },
                                             '&:focus-visible': {
                                                outline: '2px solid #1976D2',
                                                outlineOffset: '2px',
                                             },
                                          }}>
                                          {isFavorite ? <FavoriteIcon color="error" sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18, color: '#627D98' }} />}
                                       </IconButton>
                                    </Tooltip>
                                 )}
                              </div>
                           </TiltCard>
                        </div>
                     </div>
                  );
               })}
            </div>

            {/* Pagination Dots (จุดประบอกสไลด์) */}
            {count > 1 && (
               <div className="pv-dots" role="tablist" aria-label="เลือกหนังสือแนะนำ">
                  {books.map((b, i) => (
                     <button
                        key={b.id}
                        type="button"
                        role="tab"
                        aria-selected={i === currentIndex}
                        aria-label={`ไปยังหนังสือเล่มที่ ${i + 1}: ${b.title}`}
                        className={`pv-dot ${i === currentIndex ? 'pv-dot--active' : ''}`}
                        onClick={() => goTo(i)}
                     />
                  ))}
               </div>
            )}
         </div>
      </Box>
   );
};

import React, { useState, useEffect, useRef } from 'react';
import { Card, Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { CloseRounded, StarRounded } from '@mui/icons-material';
import { ShoppingBag, Check, ArrowRight, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookDiscoveryResultProps } from './bookDiscovery.types';
import { SafeImage } from '../common/SafeImage';
import { formatCurrency } from '../../utils/formatCurrency';
import { AnimatedCounter } from './AnimatedCounter';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequiredDialog } from '../auth/LoginRequiredDialog';
import { savePendingAction, PendingAction } from '../../types/authGate';
import { trackEvent } from '../../utils/analytics';

/**
 * BookDiscoveryResult — High-Converting Bookstore Product Modal
 *
 * Implements:
 * - Professional e-commerce bookstore presentation (Cozy Swiss Sanctuary)
 * - Crystal clear visual hierarchy: Store Badge -> 2:3 Paperback -> Verified Specs -> Pricing Deal -> Trust Strip -> Dual CTAs
 * - Eliminates text overlaps (e.g. "%มีเล่มเดียวในคลัง") with dedicated inventory status pill
 * - Fixes double currency bug (฿฿150 -> ฿150)
 * - Complete accessibility (ESC key, focus trap, ARIA dialog)
 */
export const BookDiscoveryResult: React.FC<BookDiscoveryResultProps> = ({
   book,
   onRollAgain,
   onClose,
   isReducedMotion = false,
   className = '',
   mood,
   state = 'result',
   isRunning = false,
   triggerRef,
}) => {
   const navigate = useNavigate();
   const location = useLocation();
   const { addToCart } = useCart();
   const { toggleWishlist, isInWishlist } = useWishlist();
   const { isAuthenticated } = useAuth();

   const [cartState, setCartState] = useState<'idle' | 'loading' | 'success'>('idle');
   const [loginModalOpen, setLoginModalOpen] = useState(false);

   const dialogRef = useRef<HTMLDivElement>(null);
   const closeButtonRef = useRef<HTMLButtonElement>(null);

   const isFavorite = isInWishlist(book.id);

   const discountPercent = book.originalPrice && book.originalPrice > book.price ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : null;

   const savingsAmount = book.originalPrice && book.originalPrice > book.price ? book.originalPrice - book.price : 0;

   // Accessibility: Focus trap, ESC key listener, and focus restoration
   useEffect(() => {
      const previouslyFocused = document.activeElement as HTMLElement | null;

      const timer = setTimeout(() => {
         if (closeButtonRef.current) {
            closeButtonRef.current.focus();
         }
      }, 60);

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            onClose?.();
            return;
         }

         if (e.key === 'Tab' && dialogRef.current) {
            const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
               'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
               if (document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
               }
            } else {
               if (document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
               }
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
         clearTimeout(timer);
         window.removeEventListener('keydown', handleKeyDown);
         if (triggerRef?.current) {
            triggerRef.current.focus();
         } else if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
            previouslyFocused.focus();
         }
      };
   }, [onClose, triggerRef]);

   const handleViewDetails = () => {
      trackEvent('view_product', {
         bookId: book.id,
         title: book.title,
         price: book.price,
         source: 'discovery_popup',
         mood: mood || 'surprise',
      });
      navigate(`/books/${book.id}`);
   };

   const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (cartState === 'success') {
         navigate('/cart');
         return;
      }

      if (!isAuthenticated) {
         const action: PendingAction = { type: 'add-to-cart', bookId: book.id };
         savePendingAction(action);
         setLoginModalOpen(true);
         return;
      }

      if (cartState === 'loading') return;

      addToCart(book);
      setCartState('loading');
      trackEvent('add_to_cart', {
         bookId: book.id,
         title: book.title,
         price: book.price,
         source: 'discovery_popup',
      });

      setTimeout(() => {
         setCartState('success');
         setTimeout(() => {
            setCartState('idle');
         }, 2500);
      }, 200);
   };

   const handleModalLogin = () => {
      const action: PendingAction = { type: 'add-to-cart', bookId: book.id };
      savePendingAction(action);
      setLoginModalOpen(false);
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, {
         state: {
            from: location.pathname + location.search,
            pendingAction: action,
         },
      });
   };

   return (
      <>
         <Card
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="discovery-result-title"
            aria-describedby="discovery-result-desc"
            tabIndex={-1}
            elevation={0}
            sx={{
               width: '100%',
               maxWidth: '580px',
               borderRadius: { xs: '20px', sm: '24px' },
               border: '1px solid #E2E8F0',
               bgcolor: '#FFFFFF',
               p: { xs: 2.25, sm: 3 },
               display: 'flex',
               flexDirection: 'column',
               boxShadow: '0 24px 52px -12px rgba(15, 45, 74, 0.22), 0 0 1px 1px rgba(15, 45, 74, 0.06)',
               position: 'relative',
               overflow: 'hidden',
               outline: 'none',
            }}
            className={className}>
            {/* Top Header: Bookstore Recommendation Badge & Utility Actions */}
            <Box
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: { xs: 1.75, sm: 2.25 },
                  pb: 1.25,
                  borderBottom: '1px solid #F1F5F9',
               }}>
               {/* Store Recommendation Tag */}
               <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1976D2] border border-blue-100/90 shadow-2xs">
                     <Sparkles size={13} className="text-amber-500 fill-amber-500/20" />
                     <span>คัดสรรพิเศษเพื่อคุณ</span>
                  </span>
               </div>

               {/* Action Icons: Wishlist & Close */}
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกเข้า Wishlist'}>
                     <IconButton
                        onClick={(e) => {
                           e.stopPropagation();
                           toggleWishlist(book);
                        }}
                        aria-label={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                        size="small"
                        sx={{
                           p: 0.8,
                           color: isFavorite ? '#EF4444' : '#64748B',
                           bgcolor: isFavorite ? '#FEF2F2' : '#F8FAFC',
                           border: '1px solid #E2E8F0',
                           borderRadius: '10px',
                           transition: 'all 150ms ease',
                           '&:hover': {
                              bgcolor: isFavorite ? '#FEE2E2' : '#F1F5F9',
                              color: isFavorite ? '#DC2626' : '#0F172A',
                              transform: 'translateY(-1px)',
                           },
                        }}>
                        <Heart size={16} className={isFavorite ? 'fill-current text-rose-500' : ''} />
                     </IconButton>
                  </Tooltip>

                  {onClose && (
                     <Tooltip title="ปิดหน้าต่าง">
                        <IconButton
                           ref={closeButtonRef}
                           onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                           }}
                           aria-label="ปิดหน้าต่างข้อมูลหนังสือ"
                           size="small"
                           sx={{
                              p: 0.8,
                              color: '#64748B',
                              bgcolor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: '10px',
                              transition: 'all 150ms ease',
                              '&:hover': {
                                 bgcolor: '#F1F5F9',
                                 color: '#0F172A',
                                 transform: 'translateY(-1px)',
                              },
                           }}>
                           <CloseRounded sx={{ fontSize: 18 }} />
                        </IconButton>
                     </Tooltip>
                  )}
               </Box>
            </Box>

            {/* Content: Loading vs Revealed Book */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <AnimatePresence mode="wait">
                  {isRunning ? (
                     /* Loading Skeleton State */
                     <motion.div
                        key="loading-state"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="flex flex-col sm:grid sm:grid-cols-[140px_1fr] gap-4 sm:gap-6 items-start flex-1">
                        <div className="w-[125px] sm:w-[140px] aspect-[2/3] mx-auto sm:mx-0 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 flex-shrink-0 animate-pulse">
                           <CircularProgress size={26} sx={{ color: '#1976D2' }} thickness={4} />
                           <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider">DISCOVERING</span>
                        </div>

                        <div className="flex flex-col gap-2.5 py-1 w-full">
                           <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                           <div className="h-6 bg-slate-100 rounded-md w-3/4" />
                           <div className="h-4 bg-slate-50 rounded-md w-1/2" />
                           <div className="h-14 bg-slate-50 border border-slate-200/60 rounded-xl w-full my-1" />
                           <div className="h-8 bg-slate-50 rounded-lg w-full" />
                        </div>
                     </motion.div>
                  ) : (
                     /* Revealed PopUp Book Card (Storefront Style) */
                     <motion.div
                        key={`revealed-${book.id}`}
                        initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={isReducedMotion ? { duration: 0.15 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:grid sm:grid-cols-[145px_1fr] gap-4 sm:gap-5 items-start flex-1">
                        {/* 1. Realistic 2:3 Paperback Book Presentation */}
                        <motion.div
                           onClick={handleViewDetails}
                           whileHover={!isReducedMotion ? { scale: 1.018, y: -2 } : undefined}
                           whileTap={!isReducedMotion ? { scale: 0.985 } : undefined}
                           transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                           className="relative w-[130px] sm:w-[145px] aspect-[2/3] mx-auto sm:mx-0 rounded-r-lg rounded-l-[3px] overflow-hidden border border-slate-200/90 shadow-[0_12px_28px_rgba(15,45,74,0.18),0_2px_4px_rgba(15,45,74,0.06)] cursor-pointer flex-shrink-0 bg-slate-100 group/cover">
                           {/* Spine Highlight for physical depth */}
                           <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none z-10" />

                           {/* Clean Discount Tag (No overlapping text) */}
                           {discountPercent && (
                              <div className="absolute top-2 left-2 z-10">
                                 <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#E11D48] text-white shadow-sm tracking-wider">ลด {discountPercent}%</span>
                              </div>
                           )}

                           <SafeImage src={book.cover} alt={book.title} fallbackTitle={book.title} objectFit="cover" loading="eager" fetchPriority="high" />
                        </motion.div>

                        {/* 2. Storefront Product Details Column */}
                        <div className="flex flex-col gap-1 w-full min-w-0">
                           {/* Book Title */}
                           <h3
                              id="discovery-result-title"
                              onClick={handleViewDetails}
                              className="font-bold text-base sm:text-lg text-[#0F2D4A] hover:text-[#1976D2] transition-colors leading-snug line-clamp-2 cursor-pointer tracking-tight break-words"
                              title={book.title}>
                              {book.title}
                           </h3>

                           {/* Author Info */}
                           <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                              <p id="discovery-result-desc" className="font-medium truncate" title={book.author || 'ไม่ระบุผู้แต่ง'}>
                                 ผู้เขียน: <span className="text-slate-700 font-semibold">{book.author || 'ไม่ระบุผู้แต่ง'}</span>
                              </p>
                           </div>

                           {/* High-Converting Price & Deal Box */}
                           <div className="bg-gradient-to-r from-blue-50/60 via-slate-50/60 to-amber-50/30 border border-blue-100/80 rounded-xl p-2.5 sm:p-3 my-1">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                 <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ราคาพิเศษ BookLoop</div>
                                    <div className="flex items-baseline gap-2 flex-wrap">
                                       {/* Animated Price (Fixed double currency bug: AnimatedCounter outputs ฿ by default) */}
                                       <span className="text-2xl sm:text-3xl font-extrabold text-[#1976D2] tracking-tight font-sans">
                                          <AnimatedCounter value={book.price} />
                                       </span>
                                       {book.originalPrice && book.originalPrice > book.price && (
                                          <span className="text-xs sm:text-sm text-slate-400 line-through font-mono">{formatCurrency(book.originalPrice)}</span>
                                       )}
                                       {savingsAmount > 0 && (
                                          <span className="inline-flex items-center px-2 py-0.5 font-sans text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded-md">
                                             ประหยัด {formatCurrency(savingsAmount)}
                                          </span>
                                       )}
                                    </div>
                                 </div>

                                 {/* Store Rating Pill */}
                                 <div className="flex items-center gap-1 bg-white border border-slate-200/90 px-2 py-1 rounded-lg shadow-2xs">
                                    <StarRounded sx={{ fontSize: 16, color: '#F59E0B' }} />
                                    <span className="text-xs font-bold text-slate-800 font-mono">{book.rating ? book.rating.toFixed(1) : '4.8'}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">({book.reviewCount || 75})</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </Box>

            {/* Action Toolbar: Store UX Conversion */}
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                  mt: { xs: 2, sm: 2.25 },
                  pt: 2,
                  borderTop: '1px solid #F1F5F9',
               }}>
               {/* Primary CTA: Add to Cart with Prominent Price */}
               <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isRunning || cartState === 'loading'}
                  whileHover={!isRunning && !isReducedMotion ? { scale: 1.01, y: -1 } : undefined}
                  whileTap={!isRunning && !isReducedMotion ? { scale: 0.985, y: 0 } : undefined}
                  transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                  className={`w-full flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-sm font-bold text-white transition-all cursor-pointer outline-none shadow-[0_4px_14px_rgba(25,118,210,0.22)] ${
                     isRunning
                        ? 'bg-slate-300 cursor-not-allowed shadow-none'
                        : cartState === 'success'
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_14px_rgba(5,150,105,0.25)]'
                          : 'bg-[#1976D2] hover:bg-[#0F2D4A]'
                  }`}>
                  <AnimatePresence mode="wait" initial={false}>
                     {cartState === 'success' ? (
                        <motion.span
                           key="success"
                           initial={isReducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
                           animate={isReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                           exit={isReducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
                           className="flex items-center justify-center gap-1.5 text-white font-bold">
                           <Check size={18} />
                           <span>เพิ่มลงตะกร้าแล้ว (ดูตะกร้าสินค้า)</span>
                        </motion.span>
                     ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                           <ShoppingBag size={17} />
                           <span>เพิ่มลงตะกร้า • {formatCurrency(book.price)}</span>
                        </motion.span>
                     )}
                  </AnimatePresence>
               </motion.button>

               {/* Secondary Actions Row: View Details & Roll Again */}
               <div className="grid grid-cols-2 gap-2">
                  <motion.button
                     type="button"
                     onClick={handleViewDetails}
                     disabled={isRunning}
                     whileHover={!isRunning && !isReducedMotion ? { scale: 1.01, y: -1 } : undefined}
                     whileTap={!isRunning && !isReducedMotion ? { scale: 0.985, y: 0 } : undefined}
                     transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                     className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer outline-none">
                     <span>ดูรายละเอียด</span>
                     <ArrowRight size={14} className="text-slate-400" />
                  </motion.button>

                  <motion.button
                     type="button"
                     onClick={() => {
                        onClose?.();
                        onRollAgain();
                     }}
                     disabled={isRunning}
                     whileHover={!isRunning && !isReducedMotion ? { scale: 1.01, y: -1 } : undefined}
                     whileTap={!isRunning && !isReducedMotion ? { scale: 0.985, y: 0 } : undefined}
                     transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                     className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all outline-none cursor-pointer ${
                        isRunning ? 'opacity-50 cursor-not-allowed' : ''
                     }`}>
                     <RefreshCw size={14} className="text-slate-500" />
                     <span>สุ่มอีกครั้ง</span>
                  </motion.button>
               </div>
            </Box>
         </Card>

         {/* Login Gate Dialog */}
         <LoginRequiredDialog
            open={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onLogin={handleModalLogin}
            mode="add-to-cart"
            customMessage="กรุณาเข้าสู่ระบบเพื่อเพิ่มหนังสือเล่มที่สุ่มได้ลงในตะกร้า"
         />
      </>
   );
};

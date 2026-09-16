import React, { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Rating,
  Chip,
} from '@mui/material';
import {
  FavoriteRounded,
  FavoriteBorderRounded,
  ShoppingCartOutlined,
  CheckRounded,
  ArrowForwardRounded,
  RefreshRounded,
  AutoAwesomeRounded,
  StarRounded,
  QuestionMarkRounded,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookDiscoveryResultProps } from './bookDiscovery.types';
import { SafeImage } from '../common/SafeImage';
import { ConditionBadge } from '../ConditionBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { AnimatedCounter } from './AnimatedCounter';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequiredDialog } from '../auth/LoginRequiredDialog';
import { savePendingAction, PendingAction } from '../../types/authGate';
import { trackEvent } from '../../utils/analytics';

export const BookDiscoveryResult: React.FC<BookDiscoveryResultProps> = ({
  book,
  onRollAgain,
  isReducedMotion = false,
  className = '',
  mood,
  state = 'result',
  isRunning = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [cartState, setCartState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const isFavorite = isInWishlist(book.id);

  const handleViewDetails = () => {
    trackEvent('view_product', {
      bookId: book.id,
      title: book.title,
      price: book.price,
      source: 'discovery_playground',
      mood: mood || 'surprise',
    });
    navigate(`/books/${book.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

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
      source: 'discovery_playground',
    });

    setTimeout(() => {
      setCartState('success');
      setTimeout(() => {
        setCartState('idle');
      }, 1400);
    }, 250);
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
        elevation={0}
        sx={{
          width: '100%',
          height: '100%',
          minHeight: { xs: 'auto', md: '360px' },
          borderRadius: 3.5,
          border: isRunning
            ? '2px dashed #93C5FD'
            : state === 'result'
            ? '2px solid #3B82F6'
            : '1.5px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: state === 'result'
            ? '0 12px 32px rgba(25, 118, 210, 0.16)'
            : '0 2px 10px rgba(15, 45, 74, 0.04)',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          position: 'relative',
        }}
        className={className}
      >
        {/* Top Mini Header: Status badge and Wishlist Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            pb: 1.2,
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                bgcolor: isRunning ? '#EFF6FF' : state === 'result' ? '#FEF3C7' : '#F8FAFC',
                border: isRunning ? '1px solid #BFDBFE' : state === 'result' ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                borderRadius: '9999px',
                py: 0.4,
                px: 1.4,
              }}
            >
              <AutoAwesomeRounded
                sx={{
                  fontSize: 13,
                  color: isRunning
                    ? '#2563EB'
                    : state === 'result'
                    ? '#D97706'
                    : '#475569',
                  animation: isRunning ? 'spin 1.5s linear infinite' : 'none',
                  '@keyframes spin': {
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: isRunning
                    ? '#1976D2'
                    : state === 'result'
                    ? '#B45309'
                    : '#334155',
                  fontSize: '0.74rem',
                  letterSpacing: '0.02em',
                }}
              >
                {isRunning
                  ? 'กำลังสุ่มหนังสือในวงโคจร...'
                  : state === 'result'
                  ? 'หนังสือที่ BookLoop เลือกให้คุณ'
                  : 'หนังสือแนะนำสำหรับคุณ'}
              </Typography>
            </Box>
          </Box>

          <Tooltip title={isFavorite ? 'นำออกจากที่บันทึกไว้' : 'บันทึกเข้า Wishlist'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(book);
              }}
              aria-label={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
              size="small"
              sx={{
                p: 0.6,
                color: isFavorite ? '#EF4444' : '#64748B',
                bgcolor: isFavorite ? '#FEF2F2' : '#F8FAFC',
                border: isFavorite ? '1px solid #FECACA' : '1px solid #E2E8F0',
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: isFavorite ? '#FEE2E2' : '#F1F5F9',
                },
              }}
            >
              {isFavorite ? <FavoriteRounded fontSize="small" /> : <FavoriteBorderRounded fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Content switch: AnimatePresence mode="wait" for Mystery vs Revealed Book */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            {isRunning ? (
              /* Mystery State Card */
              <motion.div
                key="mystery-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="grid grid-cols-[95px_1fr] sm:grid-cols-[120px_1fr] gap-4 sm:gap-5 items-start flex-1"
              >
                <div className="relative w-[95px] sm:w-[120px] aspect-[3/4] rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 flex flex-col items-center justify-center gap-1.5 shadow-sm overflow-hidden flex-shrink-0 animate-pulse">
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: 'radial-gradient(#1976D2 1.5px, transparent 1.5px)',
                      backgroundSize: '12px 12px',
                    }}
                  />
                  <div className="w-11 h-11 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center z-10 shadow-sm">
                    <QuestionMarkRounded sx={{ fontSize: 26, color: '#1976D2' }} />
                  </div>
                  <span className="text-[0.7rem] font-extrabold text-blue-700 tracking-wider z-10">
                    ? ? ?
                  </span>
                </div>

                <div className="flex flex-col gap-2 py-0.5">
                  <span className="inline-block self-start px-2 py-0.5 text-[0.7rem] font-bold bg-blue-100 text-blue-800 rounded-md">
                    กำลังสุ่มค้นหา...
                  </span>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-800 leading-snug">
                    กำลังค้นหาหนังสือพิเศษในวงโคจร...
                  </h3>

                  <p className="text-xs text-slate-500 font-medium">
                    คัดเลือกจากคลังหนังสือมือสองคุณภาพดีให้เข้ากับ Mood ของคุณ
                  </p>

                  <div className="flex items-center gap-2 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <AutoAwesomeRounded sx={{ fontSize: 16, color: '#F59E0B' }} />
                    <span className="text-xs font-semibold text-slate-600">
                      รอลุ้นหนังสือเล่มถัดไปของคุณได้เลย!
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Revealed Real Book Details with Motion Stagger */
              <motion.div
                key={`revealed-${book.id}`}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="grid grid-cols-[95px_1fr] sm:grid-cols-[120px_1fr] gap-4 sm:gap-5 items-start flex-1"
              >
                {/* 3D Tilt Hover Book Cover */}
                <motion.div
                  onClick={handleViewDetails}
                  whileHover={!isReducedMotion ? { scale: 1.04, rotate: -1 } : undefined}
                  whileTap={!isReducedMotion ? { scale: 0.98 } : undefined}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className="relative w-[95px] sm:w-[120px] aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 shadow-md cursor-pointer flex-shrink-0 bg-slate-100"
                >
                  <SafeImage
                    src={book.cover}
                    alt={book.title}
                    fallbackTitle={book.title}
                    objectFit="cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </motion.div>

                {/* Staggered Metadata */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05, delayChildren: 0.04 },
                    },
                  }}
                  className="flex flex-col gap-1.5"
                >
                  {/* Badges */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="flex items-center gap-1.5 flex-wrap"
                  >
                    <Chip
                      label={book.category}
                      size="small"
                      sx={{
                        bgcolor: '#EAF4FF',
                        color: '#1976D2',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                    <ConditionBadge condition={book.condition} size="small" />
                    {book.originalPrice && book.originalPrice > book.price && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Chip
                          label={`ลด ${Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%`}
                          size="small"
                          sx={{
                            bgcolor: '#FEF2F2',
                            color: '#DC2626',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            height: 22,
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <h3
                      onClick={handleViewDetails}
                      className="font-extrabold text-base sm:text-lg text-[#0F2D4A] hover:text-[#1976D2] transition-colors leading-tight line-clamp-2 cursor-pointer"
                    >
                      {book.title}
                    </h3>
                  </motion.div>

                  {/* Author */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <p className="text-xs text-slate-500 font-medium">
                      โดย {book.author}
                    </p>
                  </motion.div>

                  {/* Rating */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <Rating
                      value={book.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                      icon={<StarRounded fontSize="inherit" sx={{ color: '#F59E0B' }} />}
                      emptyIcon={<StarRounded fontSize="inherit" sx={{ opacity: 0.3 }} />}
                      sx={{ fontSize: '0.95rem' }}
                    />
                    <span className="text-xs font-bold text-slate-700">
                      {book.rating.toFixed(1)}
                    </span>
                    {book.reviewCount && (
                      <span className="text-[0.7rem] text-slate-400">
                        ({book.reviewCount} รีวิว)
                      </span>
                    )}
                  </motion.div>

                  {/* Animated Rolling Price */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="flex items-baseline gap-2 mt-0.5"
                  >
                    <span className="text-xl font-extrabold text-[#1976D2]">
                      <AnimatedCounter value={book.price} />
                    </span>
                    {book.originalPrice && book.originalPrice > book.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(book.originalPrice)}
                      </span>
                    )}
                  </motion.div>

                  {/* Story excerpt */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border-l-[3px] border-[#1976D2]">
                      {book.story ? (book.story.length > 70 ? book.story.slice(0, 70) + '...' : book.story) : 'หนังสือทรงคุณค่าที่พร้อมให้คุณเปิดอ่านและส่งต่อ'}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Action Toolbar with Motion Gestures */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1fr 1fr' },
            gap: 1.2,
            mt: 2,
            pt: 1.8,
            borderTop: '1px solid #F1F5F9',
          }}
        >
          {/* Primary: View Details */}
          <motion.button
            type="button"
            onClick={handleViewDetails}
            disabled={isRunning}
            whileHover={!isRunning ? { scale: 1.02 } : undefined}
            whileTap={!isRunning ? { scale: 0.97 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-sm font-bold text-white transition-colors cursor-pointer outline-none ${
              isRunning
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#1976D2] hover:bg-[#1565C0] shadow-sm'
            }`}
          >
            <span>ดูรายละเอียด</span>
            <ArrowForwardRounded sx={{ fontSize: 16 }} />
          </motion.button>

          {/* Add to Cart with morphing state */}
          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={isRunning || cartState === 'loading'}
            whileHover={!isRunning ? { scale: 1.02 } : undefined}
            whileTap={!isRunning ? { scale: 0.97 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-colors outline-none cursor-pointer ${
              isRunning
                ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
                : cartState === 'success'
                ? 'border-green-300 text-green-700 bg-green-50'
                : 'border-slate-300 text-[#0F2D4A] hover:border-[#0F2D4A] hover:bg-slate-50'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {cartState === 'success' ? (
                <motion.span
                  key="success"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1 text-green-700"
                >
                  <CheckRounded sx={{ fontSize: 16 }} />
                  <span>เพิ่มแล้ว!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <ShoppingCartOutlined sx={{ fontSize: 16 }} />
                  <span>เพิ่มลงตะกร้า</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Roll Again */}
          <motion.button
            type="button"
            onClick={onRollAgain}
            disabled={isRunning}
            whileHover={!isRunning ? { scale: 1.02 } : undefined}
            whileTap={!isRunning ? { scale: 0.97 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`flex items-center justify-center gap-1 h-10 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-500 hover:text-[#1976D2] hover:bg-blue-50 transition-colors outline-none cursor-pointer ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshRounded sx={{ fontSize: 16 }} />
            <span>สุ่มอีกครั้ง</span>
          </motion.button>
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

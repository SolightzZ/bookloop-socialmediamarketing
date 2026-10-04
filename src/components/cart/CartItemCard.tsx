import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../hooks/useCart';
import { ConditionBadge } from '../ConditionBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { SafeImage } from '../common/SafeImage';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string, title: string) => void;
}

/**
 * CartItemCard — Swiss tabular row. No card chrome:
 * cover / info / stepper / line total, separated by hairlines.
 * Desktop column grid aligns with the list header in CartPage.
 */
export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const navigate = useNavigate();
  const maxQuantity = Math.max(1, item.stock);
  const isAtMinimum = item.quantity <= 1;
  const isAtMaximum = item.quantity >= maxQuantity;
  const openBook = () => navigate(`/books/${item.id}`);

  const stepper = (
    <Box
      role="group"
      aria-label={`จำนวน ${item.title}`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #D9E2EC',
        borderRadius: '6px',
        bgcolor: '#FFFFFF',
      }}
    >
      <IconButton
        size="small"
        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        disabled={isAtMinimum}
        aria-label="ลดจำนวนสินค้า"
        title={isAtMinimum ? 'จำนวนขั้นต่ำคือ 1 เล่ม' : 'ลดจำนวนสินค้า'}
        sx={{
          width: 36,
          height: 36,
          borderRadius: '6px',
          color: '#102A43',
          '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
        }}
      >
        <Minus size={15} />
      </IconButton>
      <Typography
        aria-live="polite"
        sx={{ px: 1.5, fontWeight: 700, fontSize: '0.9rem', minWidth: 28, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}
      >
        {item.quantity}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        disabled={isAtMaximum}
        aria-label="เพิ่มจำนวนสินค้า"
        title={isAtMaximum ? `มีสินค้าได้สูงสุด ${maxQuantity} เล่ม` : 'เพิ่มจำนวนสินค้า'}
        sx={{
          width: 36,
          height: 36,
          borderRadius: '6px',
          color: '#102A43',
          '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
        }}
      >
        <Plus size={15} />
      </IconButton>
    </Box>
  );

  return (
    <Box
      component="article"
      aria-label={`${item.title} จำนวน ${item.quantity} เล่ม`}
      sx={{ py: { xs: 2.5, md: 3 } }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '72px 1fr', md: '72px 1fr 150px 110px 40px' },
          columnGap: { xs: 2, md: 3 },
          rowGap: 2,
          alignItems: { md: 'center' },
        }}
      >
        {/* Cover */}
        <Box
          role="button"
          tabIndex={0}
          aria-label={`ดูรายละเอียด ${item.title}`}
          onClick={openBook}
          onKeyDown={(e) => {
            if (e.key === 'Enter') openBook();
          }}
          sx={{
            width: 72,
            height: 96,
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #D9E2EC',
            bgcolor: '#FFFFFF',
            cursor: 'pointer',
            '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
          }}
        >
          <SafeImage
            src={item.cover}
            alt={`ปกหนังสือ ${item.title}`}
            fallbackTitle={item.title}
            objectFit="cover"
            sx={{ width: '100%', height: '100%' }}
          />
        </Box>

        {/* Info */}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            onClick={openBook}
            sx={{
              fontWeight: 700,
              color: '#102A43',
              fontSize: { xs: '0.95rem', md: '1rem' },
              lineHeight: 1.4,
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              '&:hover': { color: '#1976D2' },
            }}
          >
            {item.title}
          </Typography>
          <Typography sx={{ color: '#62748A', fontSize: '0.82rem', mt: 0.5 }} noWrap>
            โดย {item.author} · ส่งต่อโดย {item.seller.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <ConditionBadge condition={item.condition} size="small" />
            <Typography sx={{ color: '#62748A', fontSize: '0.78rem', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(item.price)} / เล่ม
            </Typography>
          </Box>
          {/* Mobile stepper row */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 2, mt: 1.5 }}>
            {stepper}
            <Typography sx={{ color: '#62748A', fontSize: '0.75rem' }}>
              สต็อก {maxQuantity} เล่ม
            </Typography>
          </Box>
        </Box>

        {/* Desktop stepper */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {stepper}
          <Typography sx={{ color: '#62748A', fontSize: '0.75rem', mt: 1 }}>
            สต็อก {maxQuantity} เล่ม
          </Typography>
        </Box>

        {/* Line total */}
        <Typography
          sx={{
            fontWeight: 800,
            color: '#102A43',
            fontSize: { xs: '1rem', md: '1.05rem' },
            fontVariantNumeric: 'tabular-nums',
            textAlign: { xs: 'left', md: 'right' },
            gridColumn: { xs: '2', md: 'auto' },
            alignSelf: { xs: 'center', md: 'auto' },
          }}
          aria-label={`รวม ${formatCurrency(item.price * item.quantity)}`}
        >
          {formatCurrency(item.price * item.quantity)}
        </Typography>

        {/* Remove */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => onRemoveItem(item.id, item.title)}
            aria-label={`ลบ ${item.title} ออกจากตะกร้า`}
            title="ลบออกจากตะกร้า"
            sx={{
              width: 40,
              height: 40,
              color: '#62748A',
              '&:hover': { color: '#D64545', bgcolor: '#FDECEC' },
              '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
            }}
          >
            <Trash2 size={17} />
          </IconButton>
        </Box>

        {/* Mobile remove */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, gridColumn: '2', justifyContent: 'flex-start', mt: -1 }}>
          <Button
            size="small"
            startIcon={<Trash2 size={14} />}
            onClick={() => onRemoveItem(item.id, item.title)}
            aria-label={`ลบ ${item.title} ออกจากตะกร้า`}
            sx={{ color: '#62748A', fontSize: '0.8rem', fontWeight: 600, p: 0.5, minWidth: 0, '&:hover': { color: '#D64545', bgcolor: 'transparent' } }}
          >
            ลบออก
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

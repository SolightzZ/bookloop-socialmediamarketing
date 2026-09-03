import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import { Add, Remove, Delete as DeleteIcon } from '@mui/icons-material';
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

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const navigate = useNavigate();
  const maxQuantity = Math.max(1, item.stock);
  const isAtMinimum = item.quantity <= 1;
  const isAtMaximum = item.quantity >= maxQuantity;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2.5,
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2.5 }, width: '100%' }}>
        <Box
          sx={{
            width: { xs: 85, sm: 110 },
            height: { xs: 118, sm: 150 },
            borderRadius: 2,
            overflow: 'hidden',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onClick={() => navigate(`/books/${item.id}`)}
        >
          <SafeImage
            src={item.cover}
            alt={item.title}
            fallbackTitle={item.title}
            objectFit="cover"
            borderRadius={8}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  cursor: 'pointer',
                  lineHeight: 1.3,
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                }}
                onClick={() => navigate(`/books/${item.id}`)}
              >
                {item.title}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                }}
              >
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
              โดย {item.author} • ส่งต่อโดย {item.seller.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <ConditionBadge condition={item.condition} size="small" />
              <Chip
                label={formatCurrency(item.price) + ' / เล่ม'}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.72rem', height: 22 }}
              />
            </Box>
          </Box>

          {/* Desktop Stepper and Delete */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              pt: 1.5,
              borderTop: '1px solid #F0F4F8',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #D9E2EC',
                borderRadius: 1.5,
                bgcolor: '#FFFFFF',
              }}
            >
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={isAtMinimum}
                aria-label="ลดจำนวนสินค้า"
                title={isAtMinimum ? 'จำนวนขั้นต่ำคือ 1 เล่ม' : 'ลดจำนวนสินค้า'}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography aria-live="polite" sx={{ px: 2, fontWeight: 'bold', fontSize: '0.9rem', minWidth: 28, textAlign: 'center' }}>
                {item.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={isAtMaximum}
                aria-label="เพิ่มจำนวนสินค้า"
                title={isAtMaximum ? `มีสินค้าได้สูงสุด ${maxQuantity} เล่ม` : 'เพิ่มจำนวนสินค้า'}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, mr: 'auto' }}>
              มีในสต็อก {maxQuantity} เล่ม
            </Typography>

            <Button
              startIcon={<DeleteIcon />}
              color="error"
              size="small"
              onClick={() => onRemoveItem(item.id, item.title)}
            >
              ลบ
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Mobile Stepper and Delete Bar */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          pt: 1.5,
          borderTop: '1px solid #F0F4F8',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #D9E2EC',
            borderRadius: 1.5,
            bgcolor: '#FFFFFF',
          }}
        >
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={isAtMinimum}
            aria-label="ลดจำนวนสินค้า"
          >
            <Remove fontSize="small" />
          </IconButton>
          <Typography aria-live="polite" sx={{ px: 1.5, fontWeight: 'bold', fontSize: '0.85rem', minWidth: 24, textAlign: 'center' }}>
            {item.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={isAtMaximum}
            aria-label="เพิ่มจำนวนสินค้า"
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          สต็อก {maxQuantity} เล่ม
        </Typography>

        <Button
          startIcon={<DeleteIcon />}
          color="error"
          size="small"
          onClick={() => onRemoveItem(item.id, item.title)}
          sx={{ fontSize: '0.8rem', py: 0.2 }}
        >
          ลบ
        </Button>
      </Box>
    </Card>
  );
};

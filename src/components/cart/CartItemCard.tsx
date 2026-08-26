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
        p: 2.5,
        borderRadius: 2.5,
        border: '1px solid #D9E2EC',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        component="img"
        src={item.cover}
        alt={item.title}
        sx={{
          width: { xs: '100%', sm: 110 },
          height: { xs: 200, sm: 150 },
          objectFit: 'cover',
          borderRadius: 2,
          cursor: 'pointer',
          flexShrink: 0,
        }}
        onClick={() => navigate(`/books/${item.id}`)}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { xs: '16px 0 0 0', sm: '0 0 0 20px' },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'primary.main', cursor: 'pointer', lineHeight: 1.3 }}
                onClick={() => navigate(`/books/${item.id}`)}
              >
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                โดย {item.author} • ส่งต่อโดย {item.seller.name}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {formatCurrency(item.price * item.quantity)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <ConditionBadge condition={item.condition} size="small" />
            <Chip
              label={formatCurrency(item.price) + ' / เล่ม'}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.72rem' }}
            />
          </Box>
        </Box>

        {/* Stepper and Delete */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            pt: 2,
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
      </CardContent>
    </Card>
  );
};

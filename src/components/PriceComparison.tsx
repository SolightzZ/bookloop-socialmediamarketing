import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { formatCurrency, calculateDiscount } from '../utils/formatCurrency';

interface PriceComparisonProps {
  price: number;
  originalPrice?: number;
  size?: 'small' | 'medium' | 'large';
  showSavingsTag?: boolean;
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({
  price,
  originalPrice,
  size = 'medium',
  showSavingsTag = true,
}) => {
  const { savings, percentage } = calculateDiscount(price, originalPrice);

  const priceVariant = size === 'large' ? 'h3' : size === 'medium' ? 'h5' : 'subtitle1';
  const originalVariant = size === 'large' ? 'h6' : size === 'medium' ? 'body1' : 'caption';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
      <Typography variant={priceVariant} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {formatCurrency(price)}
      </Typography>

      {originalPrice && originalPrice > price && (
        <>
          <Typography
            variant={originalVariant}
            sx={{
              textDecoration: 'line-through',
              color: 'text.secondary',
              opacity: 0.8,
            }}
          >
            {formatCurrency(originalPrice)}
          </Typography>

          {showSavingsTag && percentage > 0 && (
            <Chip
              label={`ประหยัด ${percentage}% (-${formatCurrency(savings)})`}
              color="success"
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.75rem', height: 22 }}
            />
          )}
        </>
      )}
    </Box>
  );
};

import React from 'react';
import { Button } from '@mui/material';
import { NotificationsNone as BellIcon } from '@mui/icons-material';

interface PriceAlertButtonProps {
  bookId: string;
  currentPrice: number;
}

/**
 * PriceAlertButton — notifies the user when a book's price drops.
 * Stub implementation for MVP.
 */
export const PriceAlertButton: React.FC<PriceAlertButtonProps> = ({ bookId, currentPrice }) => {
  return (
    <Button
      size="small"
      startIcon={<BellIcon sx={{ fontSize: 16 }} />}
      sx={{
        textTransform: 'none',
        color: '#627D98',
        fontWeight: 600,
        fontSize: '0.8rem',
        borderRadius: 2,
        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.06)', color: '#1976D2' },
      }}
      onClick={() => {
        // Placeholder — would subscribe to price drop notifications
        console.log(`Price alert set for book ${bookId} at ฿${currentPrice}`);
      }}
    >
      แจ้งเตือนเมื่อราคาลด
    </Button>
  );
};

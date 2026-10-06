import React, { memo } from 'react';
import { Box, Pagination } from '@mui/material';

interface BookPaginationControlsProps {
   totalPages: number;
   currentPage: number;
   totalBooks?: number;
   itemsPerPage?: number;
   onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export const BookPaginationControls = memo<BookPaginationControlsProps>(function BookPaginationControls({ totalPages, currentPage, onPageChange }) {
   if (totalPages <= 1) {
      return null;
   }

   return (
      <Box
         component="nav"
         aria-label="การแบ่งหน้าผลลัพธ์หนังสือ"
         sx={{
            mt: { xs: 4, md: 5 },
            mb: { xs: 3, md: 4 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
         }}>
         <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            size="medium"
            siblingCount={1}
            boundaryCount={1}
            sx={{
               '& .MuiPagination-ul': {
                  justifyContent: 'center',
                  gap: { xs: 0.5, sm: 0.75 },
               },
               '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  fontVariantNumeric: 'tabular-nums',
                  borderRadius: '8px',
                  minWidth: { xs: 36, sm: 36 },
                  height: { xs: 36, sm: 36 },
                  color: '#475569',
                  borderColor: '#E2E8F0',
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  '&.Mui-selected': {
                     bgcolor: '#1976D2',
                     color: '#FFFFFF',
                     fontWeight: 700,
                     '&:hover': {
                        bgcolor: '#1565C0',
                     },
                  },
                  '&:hover': {
                     bgcolor: '#F0F7FF',
                     color: '#1976D2',
                  },
                  '&.Mui-focusVisible': {
                     outline: '2px solid #1976D2',
                     outlineOffset: '2px',
                  },
               },
            }}
         />
      </Box>
   );
});

BookPaginationControls.displayName = 'BookPaginationControls';

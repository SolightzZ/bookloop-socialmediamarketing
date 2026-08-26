import React from 'react';
import { Box, Typography, Pagination } from '@mui/material';

interface BookPaginationControlsProps {
   totalPages: number;
   currentPage: number;
   totalBooks: number;
   itemsPerPage: number;
   onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export const BookPaginationControls: React.FC<BookPaginationControlsProps> = ({ totalPages, currentPage, totalBooks, itemsPerPage, onPageChange }) => {
   if (totalPages <= 1) {
      return null;
   }

   const startItem = (currentPage - 1) * itemsPerPage + 1;
   const endItem = Math.min(currentPage * itemsPerPage, totalBooks);

   return (
      <Box
         sx={{
            mt: { xs: 5, md: 6 },
            mb: { xs: 1, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2 },
            py: { xs: 2.5, md: 3 },
            px: { xs: 1, sm: 2 },
            width: '100%',
            minWidth: 0,
            overflow: 'hidden',
            bgcolor: '#FFFFFF',
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
         }}>
         <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            sx={{
               width: '100%',
               minWidth: 0,
               '& .MuiPagination-ul': {
                  width: '100%',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  columnGap: { xs: 0.25, sm: 0.5 },
                  rowGap: { xs: 0.5, sm: 1 },
               },
               '& .MuiPaginationItem-root': {
                  fontWeight: 700,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  borderRadius: 2,
                  minWidth: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  mx: 0,
                  '&.Mui-selected': {
                     bgcolor: 'primary.main',
                     color: '#FFFFFF',
                     '&:hover': {
                        bgcolor: 'primary.dark',
                     },
                  },
               },
            }}
         />

         <Typography
            variant="caption"
            sx={{
               color: 'text.secondary',
               textAlign: 'center',
               width: '100%',
               fontSize: { xs: '0.68rem', sm: '0.75rem' },
               lineHeight: 1.5,
               whiteSpace: { xs: 'normal', sm: 'nowrap' },
            }}>
            แสดง{' '}
            <strong>
               {startItem} - {endItem}
            </strong>{' '}
            จากทั้งหมด <strong>{totalBooks}</strong> เล่ม (หน้า {currentPage} จากทั้งหมด {totalPages} หน้า)
         </Typography>
      </Box>
   );
};

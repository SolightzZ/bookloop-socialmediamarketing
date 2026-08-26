import React from 'react';
import { Box, Typography, Pagination } from '@mui/material';

interface BookPaginationControlsProps {
  totalPages: number;
  currentPage: number;
  totalBooks: number;
  itemsPerPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export const BookPaginationControls: React.FC<BookPaginationControlsProps> = ({
  totalPages,
  currentPage,
  totalBooks,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalBooks);

  return (
    <Box
      sx={{
        mt: 6,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        py: 3,
        px: 2,
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
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
          '& .MuiPaginationItem-root': {
            fontWeight: 700,
            fontSize: '0.95rem',
            borderRadius: 2,
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

      <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        แสดง <strong>{startItem} - {endItem}</strong> จากทั้งหมด <strong>{totalBooks}</strong> เล่ม (หน้า {currentPage} จากทั้งหมด {totalPages} หน้า)
      </Typography>
    </Box>
  );
};

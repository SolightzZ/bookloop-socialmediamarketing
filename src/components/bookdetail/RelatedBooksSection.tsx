import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../data/books';
import { BookCard } from '../BookCard';

interface RelatedBooksSectionProps {
  relatedBooks: Book[];
}

export const RelatedBooksSection: React.FC<RelatedBooksSectionProps> = ({ relatedBooks }) => {
  const navigate = useNavigate();

  if (relatedBooks.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
          หนังสือที่คุณอาจสนใจ
        </Typography>
        <Button
          onClick={() => navigate('/books')}
          sx={{
            color: '#1976D2',
            fontWeight: 700,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
          }}
        >
          ดูทั้งหมด
        </Button>
      </Box>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {relatedBooks.map((relBook) => (
          <Grid size={{ xs: 6, sm: 6, md: 4 }} key={relBook.id}>
            <BookCard book={relBook} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

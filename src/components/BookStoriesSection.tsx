import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { FormatQuote as QuoteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { books } from '../data/books';

export const BookStoriesSection: React.FC = () => {
  const navigate = useNavigate();
  // Filter books with rich stories
  const storyBooks = books.filter((b) => b.story).slice(0, 3);

  return (
    <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'secondary.main',
              fontWeight: 'bold',
              letterSpacing: 1.5,
              display: 'block',
            }}
          >
            BEHIND THE BOOKS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1.5 }}>
            เรื่องราวของหนังสือ
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto', fontWeight: 'normal' }}>
            "หนังสือของคุณอาจเป็นเล่มโปรดของใครอีกคน" สัมผัสความตั้งใจและเหตุผลในการส่งต่อจากเจ้าของเดิม
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {storyBooks.map((book) => (
            <Grid size={{ xs: 12, md: 4 }} key={book.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid #D9E2EC',
                  bgcolor: 'background.default',
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(16, 42, 67, 0.08)',
                  },
                }}
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <QuoteIcon sx={{ fontSize: 36, color: 'secondary.main', opacity: 0.6, mb: 1 }} />

                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      color: 'primary.main',
                      mb: 3,
                      flexGrow: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    "{book.story}"
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      pt: 2,
                      borderTop: '1px solid #D9E2EC',
                    }}
                  >
                    <Box
                      component="img"
                      src={book.cover}
                      alt={book.title}
                      sx={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {book.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                        <Avatar
                          src={book.seller.avatar}
                          alt={book.seller.name}
                          sx={{ width: 18, height: 18 }}
                        />
                        <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
                          ส่งต่อโดย {book.seller.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

import React from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { books } from '../data/books';
import { AppContainer } from './common/Container';
import { SectionHeader } from './common/SectionHeader';
import { StoryCard } from './home/StoryCard';

export const BookStoriesSection: React.FC = () => {
  const navigate = useNavigate();
  const storyBooks = books.filter((b) => b.story).slice(0, 3);

  if (storyBooks.length === 0) return null;

  const featuredStory = storyBooks[0];
  const secondaryStories = storyBooks.slice(1, 3);

  return (
    <Box
      component="section"
      id="behind-the-books"
      aria-labelledby="behind-the-books-heading"
      sx={{
        py: { xs: 7, sm: 9, md: 12 },
        bgcolor: '#F7F9FC',
        borderTop: '1px solid #D9E2EC',
        borderBottom: '1px solid #D9E2EC',
      }}
    >
      <AppContainer>
        <SectionHeader
          id="behind-the-books-heading"
          eyebrow="BEHIND THE BOOKS"
          title="เรื่องราวของหนังสือ"
          subtitle="“หนังสือของคุณอาจเป็นเล่มโปรดของใครอีกคน” สัมผัสความตั้งใจ ความทรงจำ และเหตุผลในการส่งต่อจากเจ้าของเดิม"
          align="center"
        />

        {/* Asymmetric Magazine Editorial Layout */}
        <Grid container spacing={{ xs: 3, md: 3.5 }} sx={{ alignItems: 'stretch' }}>
          {/* Left Column: Featured Story with Large Quotation Typography */}
          <Grid size={{ xs: 12, md: 7 }}>
            <StoryCard
              book={featuredStory}
              isFeatured={true}
              onClick={() => navigate(`/books/${featuredStory.id}`)}
            />
          </Grid>

          {/* Right Column: 2 Secondary Stories Stacked */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2.5, md: 3 },
                height: '100%',
                justifyContent: 'space-between',
              }}
            >
              {secondaryStories.map((book) => (
                <Box key={book.id} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <StoryCard
                    book={book}
                    isFeatured={false}
                    onClick={() => navigate(`/books/${book.id}`)}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </AppContainer>
    </Box>
  );
};

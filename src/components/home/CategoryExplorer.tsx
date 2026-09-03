import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { books } from '../../data/books';
import { featuredCategories, standardCategories } from '../../data/categories';
import { trackEvent } from '../../utils/analytics';
import { FeaturedCategoryCard } from './FeaturedCategoryCard';
import { CategoryCard } from './CategoryCard';

export const CategoryExplorer: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (categoryName: string) => {
    trackEvent('view_category', { category: categoryName });
    navigate(`/books?category=${encodeURIComponent(categoryName)}`);
  };

  const getBookCount = (categoryName: string) => {
    return books.filter((b) => b.category === categoryName).length;
  };

  return (
    <Box
      component="section"
      id="categories"
      aria-labelledby="categories-heading"
      sx={{
        py: { xs: 7, sm: 9, md: 12 },
        bgcolor: '#F7F9FC',
        borderTop: '1px solid #D9E2EC',
        borderBottom: '1px solid #D9E2EC',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
          <Typography
            variant="overline"
            component="span"
            sx={{
              display: 'inline-block',
              color: '#1976D2',
              fontWeight: 800,
              letterSpacing: '0.12em',
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              mb: 1,
              textTransform: 'uppercase',
            }}
          >
            EXPLORE CATEGORIES
          </Typography>

          <Typography
            id="categories-heading"
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 800,
              color: '#0F2D4A',
              fontSize: { xs: '1.75rem', sm: '2.15rem', md: '2.5rem', lg: '2.75rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            ค้นหาหนังสือในหมวดที่คุณชอบ
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#627D98',
              fontSize: { xs: '0.9375rem', sm: '1.05rem' },
              lineHeight: 1.65,
              maxWidth: 640,
              mx: 'auto',
            }}
          >
            เลือกหมวดหมู่ที่ใช่ แล้วเริ่มต้นค้นพบหนังสือเล่มถัดไปของคุณจากเพื่อนนักอ่านทั่วประเทศ
          </Typography>
        </Box>

        {/* LEVEL 1: Featured Categories Grid (2 Columns on Desktop, 1 on Tablet/Mobile) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'repeat(2, 1fr)',
            },
            gap: { xs: 2.5, sm: 3, md: 3.5 },
            mb: { xs: 3, sm: 3.5, md: 4 },
          }}
        >
          {featuredCategories.map((category) => (
            <FeaturedCategoryCard
              key={category.id}
              category={category}
              bookCount={getBookCount(category.name)}
              onClick={() => handleSelectCategory(category.name)}
            />
          ))}
        </Box>

        {/* LEVEL 2: Standard Categories Grid (3 Columns Desktop, 2 on Tablet, 1 on Mobile) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {standardCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              bookCount={getBookCount(category.name)}
              onClick={() => handleSelectCategory(category.name)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

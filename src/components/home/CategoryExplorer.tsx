import React, { useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { books } from '../../data/books';
import { featuredCategories, standardCategories } from '../../data/categories';
import { trackEvent } from '../../utils/analytics';
import { CategoryCard } from './CategoryCard';
import categoryBg from '../../assets/images/find-books-by-category.webp';

export const CategoryExplorer: React.FC = () => {
   const navigate = useNavigate();

   const handleSelectCategory = (categoryName: string) => {
      trackEvent('view_category', { category: categoryName });
      navigate(`/books?category=${encodeURIComponent(categoryName)}`);
   };

   const categoryCountMap = useMemo(() => {
      const map = new Map<string, number>();
      for (const b of books) {
         map.set(b.category, (map.get(b.category) || 0) + 1);
      }
      return map;
   }, []);

   const getBookCount = (categoryName: string) => {
      return categoryCountMap.get(categoryName) || 0;
   };

   // Combine all 8 categories into a unified list
   const allCategories = useMemo(() => {
      return [...featuredCategories, ...standardCategories];
   }, []);

   return (
      <Box
         component="section"
         id="categories"
         aria-labelledby="categories-heading"
         sx={{
            py: { xs: 4, sm: 5.5, md: 7 },
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#EAF3FD',
            backgroundImage: `url(${categoryBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderTop: '1px solid #D9E2EC',
            borderBottom: '1px solid #D9E2EC',
         }}>
         {/* Subtle overlay to guarantee text legibility while keeping illustrations vibrant */}
         <Box
            aria-hidden="true"
            sx={{
               position: 'absolute',
               inset: 0,
               background: 'linear-gradient(180deg, rgba(240, 246, 255, 0.5) 0%, rgba(240, 246, 255, 0.25) 50%, rgba(240, 246, 255, 0.55) 100%)',
               pointerEvents: 'none',
            }}
         />

         <Box
            sx={{
               position: 'relative',
               zIndex: 1,
               maxWidth: '1200px',
               mx: 'auto',
               px: { xs: 1.75, sm: 3, md: 4 },
               width: '100%',
            }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 3.5, md: 4 } }}>
               <Typography
                  id="categories-heading"
                  variant="h2"
                  component="h2"
                  sx={{
                     fontWeight: 800,
                     color: '#0F2D4A',
                     fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.15rem' },
                     lineHeight: 1.25,
                     letterSpacing: '-0.02em',
                  }}>
                  ค้นหาหนังสือในหมวดที่คุณชอบ
               </Typography>
            </Box>

            {/* Compact Grid (4 cols on Desktop, 2 cols on Mobile/Tablet) */}
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                     xs: 'repeat(2, 1fr)',
                     sm: 'repeat(2, 1fr)',
                     md: 'repeat(4, 1fr)',
                  },
                  gap: { xs: 1.25, sm: 2, md: 2.25 },
               }}>
               {allCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} bookCount={getBookCount(category.name)} onClick={() => handleSelectCategory(category.name)} />
               ))}
            </Box>

            {/* Bottom CTA: Browse all books */}
            <Box sx={{ mt: { xs: 2.5, sm: 3.5, md: 4 }, textAlign: 'center' }}>
               <Button
                  onClick={() => {
                     trackEvent('view_category', { category: 'ทั้งหมด' });
                     navigate('/books');
                  }}
                  variant="outlined"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                  sx={{
                     borderRadius: 9999,
                     borderColor: 'rgba(25, 118, 210, 0.28)',
                     color: '#0F2D4A',
                     bgcolor: 'rgba(255, 255, 255, 0.92)',
                     backdropFilter: 'blur(8px)',
                     px: { xs: 2.25, sm: 3 },
                     py: { xs: 0.75, sm: 0.9 },
                     fontSize: { xs: '0.825rem', sm: '0.875rem' },
                     fontWeight: 700,
                     textTransform: 'none',
                     boxShadow: 'none',
                     transition: 'all 200ms ease',
                     WebkitTapHighlightColor: 'transparent',
                     '&:hover': {
                        bgcolor: '#FFFFFF',
                        borderColor: '#1976D2',
                        color: '#1976D2',
                        transform: 'translateY(-1px)',
                        boxShadow: 'none',
                     },
                     '&:active': {
                        transform: 'scale(0.98)',
                     },
                  }}>
                  ดูหนังสือทั้งหมดในคลัง ({books.length} เล่ม)
               </Button>
            </Box>
         </Box>
      </Box>
   );
};

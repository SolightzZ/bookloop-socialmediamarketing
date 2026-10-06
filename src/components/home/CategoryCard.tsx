import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
   AutoStories as NovelIcon,
   SelfImprovement as GrowthIcon,
   BusinessCenter as BusinessIcon,
   Science as KnowledgeIcon,
   Palette as ComicIcon,
   School as EducationIcon,
   ChildCare as KidsIcon,
   AutoAwesome as RareIcon,
   ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { CategoryItem } from '../../data/categories';

export interface CategoryCardProps {
   category: CategoryItem;
   bookCount: number;
   onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, bookCount, onClick }) => {
   const getIcon = () => {
      switch (category.iconName) {
         case 'novel':
            return <NovelIcon sx={{ fontSize: 18 }} />;
         case 'growth':
            return <GrowthIcon sx={{ fontSize: 18 }} />;
         case 'business':
            return <BusinessIcon sx={{ fontSize: 18 }} />;
         case 'knowledge':
            return <KnowledgeIcon sx={{ fontSize: 18 }} />;
         case 'comic':
            return <ComicIcon sx={{ fontSize: 18 }} />;
         case 'education':
            return <EducationIcon sx={{ fontSize: 18 }} />;
         case 'kids':
            return <KidsIcon sx={{ fontSize: 18 }} />;
         case 'rare':
            return <RareIcon sx={{ fontSize: 18 }} />;
         default:
            return <KnowledgeIcon sx={{ fontSize: 18 }} />;
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         onClick();
      }
   };

   return (
      <Box
         component="article"
         role="button"
         tabIndex={0}
         onClick={onClick}
         onKeyDown={handleKeyDown}
         aria-label={`หมวดหมู่ ${category.name}, มีหนังสือ ${bookCount} เล่ม`}
         className="group"
         sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            p: { xs: 1.5, sm: 2 },
            borderRadius: { xs: 3, sm: 2.5 },
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(220, 231, 242, 0.9)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            WebkitTapHighlightColor: 'transparent',
            transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
            boxShadow: '0 2px 8px rgba(15, 45, 74, 0.04)',
            '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 20px rgba(15, 45, 74, 0.09)',
               borderColor: category.accentColor || '#1976D2',
            },
            '&:active': {
               transform: { xs: 'scale(0.97)', sm: 'translateY(-1px)' },
            },
            '&:focus-visible': {
               outline: '2px solid rgba(15, 23, 42, 0.2)',
               outlineOffset: '2px',
            },
         }}>
         {/* Top Section: Icon + Title + (Optional Recommended Badge) */}
         <Box sx={{ mb: { xs: 0.75, sm: 1.25 } }}>
            <Box
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  mb: { xs: 1, sm: 1 },
               }}>
               {/* Supporting Icon */}
               <Box
                  aria-hidden="true"
                  sx={{
                     width: { xs: 36, sm: 32 },
                     height: { xs: 36, sm: 32 },
                     borderRadius: { xs: 2.25, sm: 2 },
                     bgcolor: category.accentBg || '#F0F4F8',
                     color: category.accentColor || '#1976D2',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     flexShrink: 0,
                     transition: 'transform 200ms ease',
                     '.group:hover &': {
                        transform: 'scale(1.08)',
                     },
                  }}>
                  {getIcon()}
               </Box>

               {/* Recommended badge if featured */}
               {category.isFeatured && (
                  <Chip
                     label="แนะนำ"
                     size="small"
                     sx={{
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        color: '#1976D2',
                        fontWeight: 700,
                        fontSize: { xs: '0.65rem', sm: '0.675rem' },
                        height: 20,
                        borderRadius: 1,
                        border: '1px solid rgba(25, 118, 210, 0.15)',
                        px: 0.25,
                        '& .MuiChip-label': { px: 0.75 },
                     }}
                  />
               )}
            </Box>

            {/* Title */}
            <Typography
               variant="subtitle1"
               component="h3"
               sx={{
                  fontWeight: 700,
                  color: '#0F2D4A',
                  fontSize: { xs: '0.925rem', sm: '1rem' },
                  lineHeight: 1.25,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mb: { xs: 0, sm: 0.5 },
               }}>
               {category.name}
            </Typography>

            {/* Description */}
            <Typography
               variant="body2"
               sx={{
                  color: '#627D98',
                  fontSize: { xs: '0.725rem', sm: '0.8rem' },
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: { xs: '2.8em', sm: '2.9em' },
               }}>
               {category.desc}
            </Typography>
         </Box>

         {/* Bottom Metadata: Book count & Arrow */}
         <Box
            sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               pt: { xs: 0.75, sm: 1.25 },
               mt: 'auto',
               borderTop: { xs: 'none', sm: '1px solid #F0F4F8' },
            }}>
            <Box
               sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: { xs: 0.75, sm: 0 },
                  py: { xs: 0.2, sm: 0 },
                  borderRadius: 1,
                  bgcolor: { xs: 'rgba(15, 45, 74, 0.04)', sm: 'transparent' },
               }}>
               <Typography
                  variant="caption"
                  sx={{
                     fontWeight: 600,
                     color: '#627D98',
                     fontSize: { xs: '0.725rem', sm: '0.775rem' },
                  }}>
                  <Box component="span" sx={{ fontWeight: 700, color: '#102A43' }}>
                     {bookCount}
                  </Box>{' '}
                  เล่ม
               </Typography>
            </Box>

            <Box
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 24, sm: 'auto' },
                  height: { xs: 24, sm: 'auto' },
                  borderRadius: { xs: '50%', sm: 0 },
                  bgcolor: { xs: category.accentBg || 'rgba(25, 118, 210, 0.08)', sm: 'transparent' },
                  color: category.accentColor || '#1976D2',
                  transition: 'transform 200ms ease, background-color 200ms ease',
                  '.group:hover &': {
                     transform: 'translateX(3px)',
                  },
               }}>
               <ArrowForwardIcon sx={{ fontSize: { xs: 13, sm: 16 } }} />
            </Box>
         </Box>
      </Box>
   );
};

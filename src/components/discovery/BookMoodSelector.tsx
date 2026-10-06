import React from 'react';
import { Box, Typography } from '@mui/material';
import { AutoAwesomeRounded, FavoriteRounded, PsychologyRounded, SentimentSatisfiedAltRounded, RocketLaunchRounded, SpaRounded } from '@mui/icons-material';
import { motion, useReducedMotion } from 'motion/react';
import { BookMoodSelectorProps, DiscoveryMood } from './bookDiscovery.types';

const MOODS: DiscoveryMood[] = [
   {
      id: 'surprise',
      label: 'เซอร์ไพรส์',
      shortLabel: 'เซอร์ไพรส์',
      icon: <AutoAwesomeRounded sx={{ fontSize: 16 }} />,
      categories: [],
      description: 'สุ่มจากหนังสือทุกหมวดหมู่',
   },
   {
      id: 'feel-good',
      label: 'ฟีลกู๊ด',
      shortLabel: 'ฟีลกู๊ด',
      icon: <FavoriteRounded sx={{ fontSize: 16 }} />,
      categories: ['นิยาย', 'เด็ก'],
      description: 'เรื่องราวอบอุ่นหัวใจและฮีลใจ',
   },
   {
      id: 'knowledge',
      label: 'ความรู้',
      shortLabel: 'ความรู้',
      icon: <PsychologyRounded sx={{ fontSize: 16 }} />,
      categories: ['ความรู้', 'การศึกษา'],
      description: 'สาระและความรู้รอบตัว',
   },
   {
      id: 'fun',
      label: 'สนุก',
      shortLabel: 'สนุก',
      icon: <SentimentSatisfiedAltRounded sx={{ fontSize: 16 }} />,
      categories: ['การ์ตูน', 'นิยาย'],
      description: 'สนุกเพลิดเพลินวางไม่ลง',
   },
   {
      id: 'self-growth',
      label: 'พัฒนาตัวเอง',
      shortLabel: 'พัฒนาตัวเอง',
      icon: <RocketLaunchRounded sx={{ fontSize: 16 }} />,
      categories: ['พัฒนาตนเอง', 'ธุรกิจ'],
      description: 'แนวคิดและพัฒนาทักษะชีวิต',
   },
   {
      id: 'relax',
      label: 'อ่านสบาย',
      shortLabel: 'อ่านสบาย',
      icon: <SpaRounded sx={{ fontSize: 16 }} />,
      categories: ['นิยาย', 'หนังสือสะสม', 'เด็ก'],
      description: 'อ่านชิลๆ สบายอารมณ์',
   },
];

export const BookMoodSelector: React.FC<BookMoodSelectorProps> = ({ selectedMood, onSelectMood, disabled = false, className = '' }) => {
   const shouldReduceMotion = useReducedMotion();

   return (
      <Box className={`w-full flex flex-col items-center ${className}`}>
         <Box
            sx={{
               display: 'flex',
               flexWrap: 'wrap',
               justifyContent: 'center',
               gap: 1,
               maxWidth: '680px',
            }}>
            {MOODS.map((mood) => {
               const isSelected = selectedMood === mood.id;
               return (
                  <motion.button
                     key={mood.id}
                     type="button"
                     disabled={disabled}
                     onClick={() => onSelectMood(mood.id)}
                     aria-pressed={isSelected}
                     whileHover={!disabled && !shouldReduceMotion ? { y: -1 } : undefined}
                     whileTap={!disabled && !shouldReduceMotion ? { scale: 0.98 } : undefined}
                     transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                     className={`relative flex items-center gap-1.5 h-[34px] px-3.5 rounded-full text-[0.82rem] font-semibold select-none cursor-pointer outline-none transition-colors border ${
                        isSelected ? 'text-white border-[#1677E8] font-bold shadow-none' : 'text-[#17324D] bg-white border-[#DCEEFF] hover:border-[#B9D9FF] hover:bg-[#F8FBFF] shadow-none'
                     } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                     {isSelected && (
                        <motion.span
                           layoutId={shouldReduceMotion ? undefined : 'activeMoodPillIndicator'}
                           className="absolute inset-0 bg-[#1677E8] rounded-full z-0"
                           transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        />
                     )}
                     <span className={`relative z-10 flex items-center transition-colors duration-200 ${isSelected ? 'text-white' : 'text-[#1677E8]'}`}>{mood.icon}</span>
                     <span className="relative z-10 whitespace-nowrap">{mood.label}</span>
                  </motion.button>
               );
            })}
         </Box>
      </Box>
   );
};

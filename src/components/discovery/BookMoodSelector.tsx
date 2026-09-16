import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  AutoAwesomeRounded,
  FavoriteRounded,
  PsychologyRounded,
  SentimentSatisfiedAltRounded,
  RocketLaunchRounded,
  SpaRounded,
} from '@mui/icons-material';
import { motion } from 'motion/react';
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

export const BookMoodSelector: React.FC<BookMoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  disabled = false,
  className = '',
}) => {
  return (
    <Box className={`w-full flex flex-col items-center gap-1.5 ${className}`}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: '#64748B',
          fontSize: '0.8rem',
          letterSpacing: '0.02em',
        }}
      >
        วันนี้อยากอ่านแบบไหน?
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          maxWidth: '660px',
        }}
      >
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <motion.button
              key={mood.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMood(mood.id)}
              aria-pressed={isSelected}
              whileHover={!disabled ? { y: -2, scale: 1.02 } : undefined}
              whileTap={!disabled ? { scale: 0.95 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`relative flex items-center gap-1.5 h-[34px] px-3.5 rounded-full text-[0.82rem] font-semibold select-none cursor-pointer outline-none transition-colors border ${
                isSelected
                  ? 'text-white border-[#1976D2] font-bold shadow-[0_3px_12px_rgba(25,118,210,0.25)]'
                  : 'text-slate-700 bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-[0_1px_3px_rgba(15,45,74,0.04)]'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSelected && (
                <motion.span
                  layoutId="activeMoodPillIndicator"
                  className="absolute inset-0 bg-[#1976D2] rounded-full z-0"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center transition-colors duration-200 ${
                  isSelected ? 'text-white' : 'text-[#1976D2]'
                }`}
              >
                {mood.icon}
              </span>
              <span className="relative z-10 whitespace-nowrap">
                {mood.label}
              </span>
            </motion.button>
          );
        })}
      </Box>
    </Box>
  );
};

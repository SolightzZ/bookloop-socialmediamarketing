import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
  AutoAwesomeRounded,
  FavoriteRounded,
  PsychologyRounded,
  SentimentSatisfiedAltRounded,
  RocketLaunchRounded,
  SpaRounded,
} from '@mui/icons-material';
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
          maxWidth: '640px',
        }}
      >
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <Chip
              key={mood.id}
              label={mood.label}
              icon={
                <Box
                  component="span"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isSelected ? '#FFFFFF' : '#1976D2',
                  }}
                >
                  {mood.icon}
                </Box>
              }
              clickable={!disabled}
              disabled={disabled}
              onClick={() => onSelectMood(mood.id)}
              aria-pressed={isSelected}
              sx={{
                height: 32, // Target compact 32-36px height
                px: 1.2,
                fontSize: '0.8rem',
                fontWeight: isSelected ? 700 : 600,
                borderRadius: '9999px',
                transition: 'all 0.18s ease-out',
                bgcolor: isSelected ? '#1976D2' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#334155',
                border: isSelected ? '1px solid #1976D2' : '1px solid #CBD5E1',
                boxShadow: 'none', // NO GLOW
                '&:hover': {
                  bgcolor: isSelected ? '#1565C0' : '#F1F5F9',
                  borderColor: isSelected ? '#1565C0' : '#94A3B8',
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

import React from 'react';
import { Box, Typography, TextField, Chip } from '@mui/material';
import { AutoStoriesRounded, LightbulbOutlined } from '@mui/icons-material';

interface BookStorySectionProps {
  story: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MAX_STORY_LENGTH = 500;

const STORY_STARTERS = [
  'เล่มนี้ให้ข้อคิดในการใช้ชีวิตและการทำงานที่ดีมาก...',
  'เหมาะมากสำหรับคนที่กำลังค้นหาตัวเอง...',
  'อ่านจบแล้วรู้สึกอบอุ่นหัวใจและมีกำลังใจเพิ่มขึ้น...',
  'หนังสือสภาพสะสม อ่านไปรอบเดียว อยากส่งต่อให้คนรักเล่มนี้...',
];

export const BookStorySection: React.FC<BookStorySectionProps> = ({ story, onChange }) => {
  const currentLength = story ? story.length : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_STORY_LENGTH) {
      onChange(e);
    }
  };

  const handleApplyStarter = (starter: string) => {
    if (!story) {
      onChange({ target: { name: 'story', value: starter } } as any);
    } else {
      onChange({ target: { name: 'story', value: `${story} ${starter}` } } as any);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 2.5, sm: 3 },
        bgcolor: '#F8FAFC',
        borderRadius: 3.5,
        border: '1.5px solid #E2E8F0',
        borderLeft: '4px solid #1976D2',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <AutoStoriesRounded sx={{ color: '#1976D2', fontSize: 20 }} />
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '1rem' }}
        >
          เรื่องราวของหนังสือ (Book Story)
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: '#64748B', mb: 1.5, fontSize: '0.82rem' }}>
        เล่าความประทับใจสั้นๆ หรือเหตุผลที่อยากส่งต่อ เพื่อให้หนังสือเล่มนี้มีความหมายพิเศษสำหรับผู้อ่านคนถัดไป
      </Typography>

      {/* Story starter chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: '#D97706' }}>
          <LightbulbOutlined sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.72rem' }}>
            ไอเดียชวนเล่า:
          </Typography>
        </Box>
        {STORY_STARTERS.map((starter) => (
          <Chip
            key={starter}
            label={starter.slice(0, 32) + '...'}
            size="small"
            onClick={() => handleApplyStarter(starter)}
            sx={{
              height: 24,
              fontSize: '0.72rem',
              fontWeight: 600,
              bgcolor: '#FFFFFF',
              color: '#334155',
              border: '1px solid #CBD5E1',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#F0F7FF',
                borderColor: '#1976D2',
                color: '#1976D2',
              },
            }}
          />
        ))}
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        name="story"
        value={story}
        onChange={handleChange}
        placeholder="เช่น หนังสือเล่มนี้เปลี่ยนมุมมองการใช้ชีวิตของผมมาก หวังว่าเจ้าของคนใหม่จะได้รับแรงบันดาลใจเช่นกันครับ..."
        size="small"
        slotProps={{
          input: {
            sx: { bgcolor: '#FFFFFF', borderRadius: 2 },
          },
        }}
      />

      {/* Character Counter */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: currentLength >= MAX_STORY_LENGTH ? '#DC2626' : '#94A3B8',
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        >
          {currentLength} / {MAX_STORY_LENGTH} ตัวอักษร
        </Typography>
      </Box>
    </Box>
  );
};

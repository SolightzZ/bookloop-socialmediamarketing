import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { AutoStories as StoryIcon } from '@mui/icons-material';

interface BookStoryInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BookStoryInput: React.FC<BookStoryInputProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ p: 2.5, bgcolor: 'rgba(23, 105, 170, 0.05)', borderRadius: 2, border: '1px solid #D9E2EC' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <StoryIcon sx={{ color: 'secondary.main' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          เรื่องราวของหนังสือ (Book Story) — คุณลักษณะเด่นของ BookLoop
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
        ทำไมหนังสือเล่มนี้ถึงมีความหมายสำหรับคุณ? หรืออยากบอกอะไรกับเจ้าของคนถัดไป?
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        name="story"
        value={value}
        onChange={onChange}
        placeholder="เช่น เล่มนี้ช่วยให้ผมมีวินัยในการทำงานมากขึ้น หวังว่าเจ้าของคนใหม่จะได้รับพลังบวกเช่นกันครับ..."
        size="small"
        sx={{ bgcolor: '#FFFFFF' }}
      />
    </Box>
  );
};

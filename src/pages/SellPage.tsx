import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { SellHero } from '../components/sell/SellHero';
import { SellSteps } from '../components/sell/SellSteps';
import { SellBookForm, SellFormData } from '../components/sell/SellBookForm';

export default function SellPage() {
  const navigate = useNavigate();
  const [stepState, setStepState] = useState<{ current: number; completed: number[] }>({
    current: 0,
    completed: [],
  });

  useEffect(() => {
    trackEvent('sell_book_click', { page: 'sell' });
    window.scrollTo(0, 0);
  }, []);

  const handleStepProgressChange = useCallback((current: number, completed: number[]) => {
    setStepState({ current, completed });
  }, []);

  const handleFormSubmit = async (data: SellFormData, image: string): Promise<void> => {
    trackEvent('sell_book_submit_demo', {
      title: data.title,
      category: data.category,
      condition: data.condition,
      price: Number(data.price),
    });

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    await showSuccess(
      'ส่งหนังสือสำเร็จ!',
      `หนังสือ "${data.title}" ได้รับการบันทึกขึ้นระบบเรียบร้อย ขอบคุณที่ร่วมส่งต่อเรื่องราวในชุมชน BookLoop`
    );

    navigate('/books');
  };

  return (
    <Box sx={{ bgcolor: '#F7F9FC', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 1. Hero Section (Desktop: 150-180px, Mobile: 140-160px) */}
      <SellHero />

      {/* 2. Main Content Grid (Max-width 1180px, Desktop: 280px minmax(0, 1fr)) */}
      <Box
        sx={{
          maxWidth: '1180px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' },
            gap: { xs: 3, md: 4 },
            alignItems: 'start',
          }}
        >
          {/* Left Sidebar: Reusable SellSteps with real progression states */}
          <SellSteps
            currentStepIndex={stepState.current}
            completedStepIndices={stepState.completed}
          />

          {/* Right Main Content: Structured, modular SellBookForm */}
          <Box sx={{ minWidth: 0 }}>
            <SellBookForm
              onSubmit={handleFormSubmit}
              onStepProgressChange={handleStepProgressChange}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

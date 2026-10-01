import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';
import { apiClient } from '../services/apiClient';
import { authService, getStoredSession } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { SellHero } from '../components/sell/SellHero';
import { SellSteps } from '../components/sell/SellSteps';
import { SellBookForm, SellFormData } from '../components/sell/SellBookForm';

export default function SellPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
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

    // บันทึกลง backend (best-effort — ออฟไลน์ก็ยังลงขายในเครื่องได้)
    let listingId = `LST-local-${Date.now().toString(36)}`;
    let cover = image;
    try {
      const result = await apiClient.post<{
        success: boolean;
        listing: { id: string; image: string };
      }>('listings_create.php', {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        condition: data.condition,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        defects: data.defects,
        story: data.story,
        image,
      });
      if (result.success && result.listing) {
        listingId = result.listing.id;
        // รูปที่ server เก็บเป็นไฟล์แล้ว — ใช้ path ฝั่ง server ถ้า frontend อยู่ same-origin ไม่ได้
        // เก็บ dataURL เดิมไว้แสดงผลบนเครื่อง (Account tab) จึงไม่ทับ cover
      }
    } catch {
      // backend ไม่พร้อม — เก็บเฉพาะบนเครื่อง (โหมดออฟไลน์)
    }

    // mirror ลงโปรไฟล์บนเครื่อง (แท็บ "หนังสือของฉัน" ใน Account)
    try {
      const session = getStoredSession();
      const ownerId = user?.id ?? session?.userId;
      if (ownerId) {
        authService.addListedBook(ownerId, {
          id: listingId,
          title: data.title,
          author: data.author,
          price: Number(data.price),
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          condition: data.condition,
          category: data.category,
          cover,
          dateListed: new Date().toISOString().split('T')[0],
          status: 'active',
          views: 0,
        });
      }
    } catch {
      // mirror ล้มต้องไม่พัง flow ลงขาย
    }

    await showSuccess(
      'ส่งหนังสือสำเร็จ!',
      `หนังสือ "${data.title}" ได้รับการบันทึกขึ้นระบบเรียบร้อย ขอบคุณที่ร่วมส่งต่อหนังสือในชุมชน BookLoop`
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

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Book } from '../../data/books';

interface ConditionStripProps {
  book: Book;
}

const CONDITION_LABEL: Record<Book['condition'], string> = {
  Excellent: 'ดีเยี่ยม (95%+)',
  'Very Good': 'ดีมาก (85–94%)',
  Good: 'ปานกลาง (70–84%)',
  Acceptable: 'พอใช้ (50–69%)',
};

/**
 * ConditionStrip — 4-column scannable condition spec.
 * Typography + subtle vertical separators, no cards.
 * All values come from real book data (no invented scores).
 */
export const ConditionStrip: React.FC<ConditionStripProps> = ({ book }) => {
  const items: { label: string; value: string; sub?: string }[] = [
    {
      label: 'สภาพรวม',
      value: CONDITION_LABEL[book.condition] ?? book.condition,
    },
    {
      label: 'ผู้ขายอธิบาย',
      value: book.conditionDescription ? shorten(book.conditionDescription, 42) : '—',
      sub: book.conditionDescription && book.conditionDescription.length > 42 ? book.conditionDescription : undefined,
    },
    {
      label: 'ตำหนิ',
      value: book.defects && book.defects.length > 0 ? book.defects.join(', ') : 'ไม่มี',
    },
    {
      label: 'รูปถ่ายจริง',
      value: `${book.images?.length || 1} รูป`,
      sub: 'ถ่ายจากเล่มจริงที่ขาย',
    },
  ];

  return (
    <Box
      component="section"
      aria-label="สภาพหนังสือ"
      sx={{ py: { xs: 0.5, md: 1 } }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          color: '#102A43',
          fontSize: { xs: '1.375rem', md: '1.5rem' },
          letterSpacing: '-0.01em',
          mb: { xs: 2, md: 2.5 },
        }}
      >
        สภาพหนังสือ
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          rowGap: { xs: 2.5, md: 0 },
        }}
      >
        {items.map((item, i) => (
          <Box
            key={item.label}
            title={item.sub}
            sx={{
              pr: { xs: 2, md: 3 },
              pl: { md: i === 0 ? 0 : 3 },
              borderLeft: {
                xs: 'none',
                md: i === 0 ? 'none' : '1px solid #D9E2EC',
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#62748A',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                mb: 0.75,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                color: '#102A43',
                fontWeight: 700,
                fontSize: { xs: '0.9rem', md: '0.95rem' },
                lineHeight: 1.5,
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

function shorten(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

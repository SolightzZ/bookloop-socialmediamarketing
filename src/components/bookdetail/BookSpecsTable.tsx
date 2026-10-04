import React from 'react';
import { Box, Typography } from '@mui/material';
import { Book } from '../../data/books';
import { ConditionBadge } from '../ConditionBadge';

interface BookSpecsTableProps {
  book: Book;
}

/**
 * BookSpecsTable — editorial specification list.
 * Label/value rows with subtle horizontal dividers, no card.
 */
export const BookSpecsTable: React.FC<BookSpecsTableProps> = ({ book }) => {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'สำนักพิมพ์', value: book.publisher || '—' },
    { label: 'ปีที่พิมพ์', value: book.publishedYear || '—' },
    { label: 'ISBN', value: book.isbn || '—' },
    { label: 'จำนวนหน้า', value: book.pages ? `${book.pages} หน้า` : '—' },
    { label: 'ภาษา', value: book.language || 'ไทย' },
    ...(book.edition ? [{ label: 'ฉบับ / พิมพ์ครั้งที่', value: book.edition }] : []),
    { label: 'หมวดหมู่', value: book.category },
    {
      label: 'สภาพโดยรวม',
      value: <ConditionBadge condition={book.condition} size="small" />,
    },
  ];

  return (
    <Box component="section" aria-label="ข้อมูลหนังสือ">
      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          color: '#102A43',
          fontSize: { xs: '1.375rem', md: '1.5rem' },
          letterSpacing: '-0.01em',
          mb: 1,
        }}
      >
        ข้อมูลหนังสือ
      </Typography>

      <Box component="dl" sx={{ m: 0 }}>
        {rows.map((row) => (
          <Box
            key={row.label}
            sx={{
              display: 'flex',
              gap: 2,
              py: 1.5,
              borderBottom: '1px solid #D9E2EC',
              alignItems: 'center',
            }}
          >
            <Typography
              component="dt"
              sx={{ width: '38%', flexShrink: 0, color: '#62748A', fontSize: '0.875rem' }}
            >
              {row.label}
            </Typography>
            <Typography
              component="dd"
              sx={{ m: 0, color: '#102A43', fontSize: '0.9rem', fontWeight: 500, minWidth: 0 }}
            >
              {row.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

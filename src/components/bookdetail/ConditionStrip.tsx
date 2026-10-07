import React, { useState } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { Book } from '../../data/books';
import { getConditionMeta } from '../ConditionBadge';

interface ConditionStripProps {
  book: Book;
}

const LONG_DESC_CHARS = 90;

/**
 * ConditionStrip — scannable condition evidence.
 * Facts row (overall / defects / real photos) + full seller note below
 * with a real expander — never a touch-dead tooltip. All values come
 * from real book data (no invented scores).
 */
export const ConditionStrip: React.FC<ConditionStripProps> = ({ book }) => {
  const [expanded, setExpanded] = useState(false);
  const desc = book.conditionDescription?.trim() ?? '';
  const isLongDesc = desc.length > LONG_DESC_CHARS;
  const defects = book.defects ?? [];
  const photoCount = book.images?.length || 1;
  const overall = getConditionMeta(book.condition);

  return (
    <Box component="section" aria-label="สภาพหนังสือ" sx={{ py: { xs: 0.5, md: 1 } }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          color: '#102A43',
          fontSize: { xs: '1.375rem', md: '1.5rem' },
          letterSpacing: '-0.01em',
          mb: { xs: 2, md: 2.5 },
        }}>
        สภาพหนังสือ
      </Typography>

      {/* Facts row: short, comparable, no truncation */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          rowGap: { xs: 2.5, md: 0 },
        }}>
        <Box sx={{ pr: { xs: 2, md: 3 } }}>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#62748A', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', mb: 0.75 }}>
            สภาพรวม
          </Typography>
          <Typography sx={{ color: '#102A43', fontWeight: 700, fontSize: { xs: '0.9rem', md: '0.95rem' }, lineHeight: 1.5 }}>
            {overall.detail} ({overall.band})
          </Typography>
        </Box>

        <Box
          sx={{
            pr: { xs: 2, md: 3 },
            pl: { md: 3 },
            borderLeft: { xs: 'none', md: '1px solid #D9E2EC' },
          }}>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#62748A', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', mb: 0.75 }}>
            ตำหนิที่ผู้ขายแจ้ง
          </Typography>
          {defects.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {defects.map((d) => (
                <Chip
                  key={d}
                  label={d}
                  size="small"
                  sx={{
                    bgcolor: '#FFFFFF',
                    border: '1px solid #D9E2EC',
                    color: '#102A43',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 26,
                    borderRadius: '6px',
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: '#102A43', fontWeight: 700, fontSize: { xs: '0.9rem', md: '0.95rem' }, lineHeight: 1.5 }}>
              ไม่มี
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            pr: { xs: 2, md: 0 },
            pl: { md: 3 },
            borderLeft: { xs: 'none', md: '1px solid #D9E2EC' },
          }}>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#62748A', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', mb: 0.75 }}>
            รูปถ่ายจริง
          </Typography>
          <Typography
            sx={{
              color: '#102A43',
              fontWeight: 700,
              fontSize: { xs: '0.9rem', md: '0.95rem' },
              lineHeight: 1.5,
              fontVariantNumeric: 'tabular-nums',
            }}>
            {photoCount} รูป
          </Typography>
          <Typography sx={{ color: '#62748A', fontSize: '0.75rem', mt: 0.25 }}>ถ่ายจากเล่มจริงที่ขาย</Typography>
        </Box>
      </Box>

      {/* Seller note: full text, clamped with a real expander when long */}
      <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid #E6EDF4' }}>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#62748A', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', mb: 0.75 }}>
          ผู้ขายอธิบายสภาพ
        </Typography>
        {desc ? (
          <>
            <Typography
              sx={{
                color: '#102A43',
                fontSize: { xs: '0.9rem', md: '0.95rem' },
                lineHeight: 1.7,
                ...(!expanded && isLongDesc
                  ? { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
                  : {}),
              }}>
              {desc}
            </Typography>
            {isLongDesc && (
              <Button
                size="small"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                sx={{
                  color: '#1976D2',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  minHeight: 44,
                  px: 0,
                  mt: 0.25,
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                  '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
                }}>
                {expanded ? 'ย่อลง' : 'อ่านคำอธิบายเต็ม'}
              </Button>
            )}
          </>
        ) : (
          <Typography sx={{ color: '#62748A', fontSize: { xs: '0.9rem', md: '0.95rem' } }}>ผู้ขายไม่ได้เขียนคำอธิบายเพิ่ม</Typography>
        )}
      </Box>
    </Box>
  );
};

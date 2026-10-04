import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { BadgeCheck, PenLine } from 'lucide-react';
import { Review } from '../data/books';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';

interface ReviewListProps {
  reviews?: Review[];
  overallRating: number;
  totalReviews: number;
  bookTitle: string;
}

/**
 * ReviewList — editorial review area.
 * Summary (big score + distribution bars) then divider-separated
 * reviews: avatar / name / verified / date / rating / text.
 * Write-a-review dialog preserved.
 */
export const ReviewList: React.FC<ReviewListProps> = ({
  reviews = [],
  overallRating,
  totalReviews,
  bookTitle,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [newRating, setNewRating] = useState<number | null>(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const r of localReviews) {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[5 - star] += 1;
    }
    const total = localReviews.length || 1;
    return [5, 4, 3, 2, 1].map((star, i) => ({
      star,
      pct: Math.round((counts[i] / total) * 100),
    }));
  }, [localReviews]);

  const displayedTotal = totalReviews + (localReviews.length - reviews.length);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) return;

    const created: Review = {
      id: `rev-${Date.now()}`,
      userName: newName,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80`,
      rating: newRating || 5,
      date: 'วันนี้',
      comment: newComment,
      verifiedPurchase: true,
    };

    setLocalReviews([created, ...localReviews]);
    setOpenModal(false);
    setNewComment('');
    setNewName('');

    trackEvent('review_submit_demo', { bookTitle, rating: newRating });
    showSuccess('ส่งความคิดเห็นสำเร็จ', 'ขอบคุณสำหรับรีวิวส่งต่อความประทับใจให้กับชุมชน');
  };

  return (
    <Box>
      {/* Summary: score + distribution */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '220px 1fr' },
          gap: { xs: 3, sm: 5 },
          alignItems: 'start',
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 800, color: '#102A43', fontSize: '3rem', lineHeight: 1 }}
            aria-label={`คะแนนเฉลี่ย ${overallRating.toFixed(1)} จาก 5`}
          >
            {overallRating.toFixed(1)}
            <Box component="span" sx={{ fontSize: '1.125rem', fontWeight: 600, color: '#62748A' }}>
              {' '}/ 5
            </Box>
          </Typography>
          <Rating
            value={overallRating}
            precision={0.1}
            readOnly
            sx={{ color: '#F5A623', my: 1, '& .MuiRating-iconEmpty': { color: '#D9E2EC' } }}
            aria-hidden
          />
          <Typography sx={{ color: '#62748A', fontSize: '0.85rem' }}>
            จากผู้รีวิว {displayedTotal} รีวิว
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PenLine size={15} />}
            onClick={() => setOpenModal(true)}
            sx={{
              mt: 2,
              borderRadius: '8px',
              borderColor: '#D9E2EC',
              color: '#0F3557',
              fontWeight: 700,
              bgcolor: '#FFFFFF',
              '&:hover': { borderColor: '#1976D2', color: '#1976D2', bgcolor: '#FFFFFF' },
              '&:focus-visible': { outline: '2px solid #1976D2', outlineOffset: '2px' },
            }}
          >
            เขียนรีวิว
          </Button>
        </Box>

        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1, pt: { sm: 1 } }}>
          {distribution.map((row) => (
            <Box
              key={row.star}
              component="li"
              sx={{ display: 'grid', gridTemplateColumns: '32px 1fr 44px', alignItems: 'center', gap: 1.5 }}
              aria-label={`${row.star} ดาว ${row.pct} เปอร์เซ็นต์`}
            >
              <Typography sx={{ color: '#62748A', fontSize: '0.82rem', fontWeight: 600 }}>
                {row.star} ★
              </Typography>
              <Box
                aria-hidden
                sx={{ height: 6, borderRadius: '6px', bgcolor: '#E8EEF4', overflow: 'hidden' }}
              >
                <Box sx={{ width: `${row.pct}%`, height: '100%', borderRadius: '6px', bgcolor: '#F5A623' }} />
              </Box>
              <Typography sx={{ color: '#62748A', fontSize: '0.82rem', textAlign: 'right' }}>
                {row.pct}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Review items — dividers, no cards */}
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {localReviews.length === 0 ? (
          <Typography sx={{ py: 3, textAlign: 'center', color: '#62748A', fontSize: '0.9rem' }}>
            ยังไม่มีรีวิวสำหรับเล่มนี้ ร่วมเป็นคนแรกที่แชร์ความรู้สึกกัน!
          </Typography>
        ) : (
          localReviews.map((rev) => (
            <Box
              key={rev.id}
              component="li"
              sx={{ py: 2.5, borderTop: '1px solid #D9E2EC' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Avatar src={rev.avatar} alt={`รูปโปรไฟล์ของ ${rev.userName}`} sx={{ width: 36, height: 36 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontWeight: 700, color: '#102A43', fontSize: '0.9rem' }}>
                      {rev.userName}
                    </Typography>
                    {rev.verifiedPurchase && (
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, color: '#18864B', fontSize: '0.72rem', fontWeight: 700 }}>
                        <BadgeCheck size={13} aria-hidden />
                        ซื้อจริง
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ color: '#62748A', fontSize: '0.78rem' }}>{rev.date}</Typography>
                </Box>
                <Box sx={{ ml: 'auto', flexShrink: 0 }}>
                  <Rating
                    value={rev.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                    aria-label={`คะแนน ${rev.rating} จาก 5`}
                    sx={{ color: '#F5A623', '& .MuiRating-iconEmpty': { color: '#D9E2EC' } }}
                  />
                </Box>
              </Box>
              <Typography sx={{ color: '#102A43', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {rev.comment}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      {/* Write review dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>เขียนรีวิวหนังสือ</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            หนังสือ: <strong>{bookTitle}</strong>
          </Typography>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              ให้คะแนนความประทับใจ
            </Typography>
            <Rating value={newRating} onChange={(_, val) => setNewRating(val)} size="large" />
          </Box>
          <TextField
            fullWidth
            label="ชื่อของคุณ"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            margin="normal"
            size="small"
            required
          />
          <TextField
            fullWidth
            label="แชร์ความรู้สึกหรือสภาพหนังสือที่คุณได้รับ"
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            margin="normal"
            size="small"
            required
            placeholder="เช่น หนังสือแพ็คมาอย่างดี สภาพเหมือนใหม่ ประทับใจมากครับ..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={!newComment.trim() || !newName.trim()}
          >
            ส่งรีวิว
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

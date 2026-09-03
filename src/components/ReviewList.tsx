import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Verified as VerifiedIcon, RateReview as ReviewIcon } from '@mui/icons-material';
import { Review } from '../data/books';
import { showSuccess } from '../utils/alerts';
import { trackEvent } from '../utils/analytics';

interface ReviewListProps {
  reviews?: Review[];
  overallRating: number;
  totalReviews: number;
  bookTitle: string;
}

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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) {
      return;
    }

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
      {/* Header with summary rating and button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {overallRating.toFixed(1)}
          </Typography>
          <Box>
            <Rating value={overallRating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              จากทั้งหมด {totalReviews + (localReviews.length - reviews.length)} รีวิว
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ReviewIcon />}
          size="small"
          onClick={() => setOpenModal(true)}
          sx={{ borderRadius: 2 }}
        >
          เขียนรีวิว
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Review items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {localReviews.length === 0 ? (
          <Typography variant="body2" sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
            ยังไม่มีรีวิวสำหรับเล่มนี้ ร่วมเป็นคนแรกที่แชร์ความรู้สึกกัน!
          </Typography>
        ) : (
          localReviews.map((rev) => (
            <Box key={rev.id} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar src={rev.avatar} alt={rev.userName} sx={{ width: 36, height: 36 }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {rev.userName}
                      </Typography>
                      {rev.verifiedPurchase && (
                        <Chip
                          icon={<VerifiedIcon sx={{ fontSize: '12px !important', color: '#2E7D5B !important' }} />}
                          label="ซื้อจริง"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(46, 125, 91, 0.1)',
                            color: 'success.main',
                            fontWeight: 600,
                            fontSize: '0.68rem',
                            height: 18,
                            px: 0.5,
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {rev.date}
                    </Typography>
                  </Box>
                </Box>

                <Rating value={rev.rating} precision={0.5} readOnly size="small" />
              </Box>

              <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6, color: 'text.primary' }}>
                {rev.comment}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      {/* Dialog for Review */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>เขียนรีวิวหนังสือ</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            หนังสือ: <strong>{bookTitle}</strong>
          </Typography>

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              ให้คะแนนความประทับใจ
            </Typography>
            <Rating
              value={newRating}
              onChange={(_, val) => setNewRating(val)}
              size="large"
            />
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

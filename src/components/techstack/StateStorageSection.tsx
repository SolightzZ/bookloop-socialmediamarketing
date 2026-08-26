import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { Storage as StorageIcon, Speed as SpeedIcon } from '@mui/icons-material';

export const StateStorageSection: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>
          State Management & Data Persistence
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
          การจัดระเบียบ State ระหว่าง Global Context, Local Storage, และ URL Query Parameters
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorageIcon sx={{ color: 'secondary.main' }} />
              Client Persistence (localStorage)
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main', fontFamily: 'monospace' }}>
                  bookloop_cart
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.6 }}>
                  เก็บรายการสินค้าในตะกร้า <code>productId</code> และ <code>quantity</code> คำนวณราคาสดใหม่จาก Catalog เพื่อป้องกันข้อมูลคลาดเคลื่อน
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main', fontFamily: 'monospace' }}>
                  bookloop_wishlist
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.6 }}>
                  เก็บ Array ของ <code>productId</code> ที่ผู้ใช้กดหัวใจบันทึกไว้ ซิงค์อัตโนมัติเมื่อกด Favorite
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main', fontFamily: 'monospace' }}>
                  URL Query State (React Router)
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.6 }}>
                  เก็บค่า <code>q</code>, <code>category</code>, <code>condition</code>, <code>sort</code>, <code>maxPrice</code>, <code>page</code> เพื่อให้แชร์ลิงก์ได้โดยตรง
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon sx={{ color: '#059669' }} />
              Analytics Event Tracking Schema
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
              Event Tracking ผ่านฟังก์ชัน <code>trackEvent(name, payload)</code> เพื่อมอนิเตอร์ Funnel การใช้งาน:
            </Typography>
            <Box sx={{ p: 2, bgcolor: '#0F172A', color: '#38BDF8', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.825rem', maxHeight: 220, overflowY: 'auto' }}>
              <pre style={{ margin: 0 }}>
{`// รายการ Event ที่รองรับในระบบ BookLoop
trackEvent('view_home')
trackEvent('search_book', { query })
trackEvent('view_category', { category })
trackEvent('view_product', { id, title })
trackEvent('favorite_book', { id })
trackEvent('add_to_cart', { id, quantity })
trackEvent('begin_checkout', { totalAmount })
trackEvent('purchase_demo', { orderId })
trackEvent('sell_book_submit_demo', { title })`}
              </pre>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

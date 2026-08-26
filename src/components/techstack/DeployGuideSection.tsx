import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Terminal as TerminalIcon,
  ContentCopy as CopyIcon,
  GitHub as GitHubIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';

interface DeployGuideSectionProps {
  onCopy: (text: string) => void;
}

export const DeployGuideSection: React.FC<DeployGuideSectionProps> = ({ onCopy }) => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>
          ความพร้อมสำหรับ Deploy ขึ้น GitHub & Cloud Platforms
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
          คู่มือและขั้นตอนการนำโปรเจกต์ BookLoop ขึ้น GitHub, ติดตั้ง Dependencies, Build และ Deploy ขึ้น Vercel, Netlify, หรือ GitHub Pages
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TerminalIcon sx={{ color: 'secondary.main' }} />
              คำสั่งพื้นฐาน (Commands)
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    1. ติดตั้ง Dependencies
                  </Typography>
                  <IconButton size="small" onClick={() => onCopy('npm install')}>
                    <CopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#0F172A', color: '#38BDF8', p: 1, borderRadius: 1 }}>
                  npm install
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    2. รัน Development Server
                  </Typography>
                  <IconButton size="small" onClick={() => onCopy('npm run dev')}>
                    <CopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#0F172A', color: '#38BDF8', p: 1, borderRadius: 1 }}>
                  npm run dev
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    3. ตรวจสอบ Type & Lint
                  </Typography>
                  <IconButton size="small" onClick={() => onCopy('npm run lint')}>
                    <CopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#0F172A', color: '#38BDF8', p: 1, borderRadius: 1 }}>
                  npm run lint
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    4. Build Production Bundle
                  </Typography>
                  <IconButton size="small" onClick={() => onCopy('npm run build')}>
                    <CopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#0F172A', color: '#38BDF8', p: 1, borderRadius: 1 }}>
                  npm run build
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <GitHubIcon sx={{ color: '#102A43' }} />
              ขั้นตอนการ Push ขึ้น GitHub
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                  1. สร้าง Git Repository & Commit
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#0F172A', color: '#38BDF8', p: 1, borderRadius: 1, whiteSpace: 'pre-wrap' }}>
{`git init
git add .
git commit -m "feat: initial bookloop second-hand book marketplace"`}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                  2. เพิ่ม Remote และ Push ขึ้น GitHub
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#0F172A', color: '#38BDF8', p: 1, borderRadius: 1, whiteSpace: 'pre-wrap' }}>
{`git remote add origin https://github.com/USERNAME/bookloop.git
git branch -M main
git push -u origin main`}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 1.5, border: '1px solid #BBF7D0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SuccessIcon sx={{ fontSize: 18 }} />
                  Vercel / Netlify Auto Deploy
                </Typography>
                <Typography variant="body2" sx={{ color: '#14532D', mt: 0.5, fontSize: '0.85rem', lineHeight: 1.5 }}>
                  เชื่อมต่อ GitHub Repo เข้ากับ Vercel หรือ Netlify โดยตั้งค่า Build Command เป็น <code>npm run build</code> และ Output Directory เป็น <code>dist</code> เพื่อให้ระบบ Deploy อัตโนมัติทุกครั้งที่ Push
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

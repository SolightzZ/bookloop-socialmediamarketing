import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Alert,
  AlertTitle,
} from '@mui/material';
import { stackLayers, corePrinciples } from './techStackData';

export const StackOverviewTable: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>
          หลักการสถาปัตยกรรม MUI-First Architecture
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3, maxWidth: 960 }}>
          BookLoop ถูกพัฒนาขึ้นโดยใช้ <strong>MUI (Material UI) เป็นแกนหลักระดับรากฐาน</strong> ทั้งในด้าน Layout Grid, Typography, Responsive Breakpoints, Theme Tokens, Accessibility (A11y), และ Component Primitives เพื่อสร้างความสม่ำเสมอ ความเสถียร และลดความซ้ำซ้อนของโค้ด
        </Typography>

        <Alert severity="info" sx={{ mb: 4, borderRadius: 2, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF' }}>
          <AlertTitle sx={{ fontWeight: 700, fontSize: '0.95rem' }}>ลำดับความสำคัญในการจัดวางสไตล์ (Hierarchy of Styling):</AlertTitle>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0369A1' }}>
            1. Standard MUI Component ➔ 2. MUI Theme Tokens & sx Props ➔ 3. Emotion Styled Component ➔ 4. Plain CSS (เฉพาะกรณีที่จำเป็นจริง)
          </Typography>
        </Alert>
      </Box>

      {/* Stack Table */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
        ตารางสรุปเทคโนโลยีในแต่ละ Layer
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, mb: 5, overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F1F5F9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: '18%' }}>Layer</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '28%' }}>Technology</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '42%' }}>หน้าที่และการทำงานในระบบ</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '12%' }}>กลุ่ม</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stackLayers.map((row) => (
              <TableRow key={row.layer} hover>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{row.layer}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {row.logo}
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main', fontFamily: 'monospace' }}>
                      {row.tech}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.6 }}>{row.role}</TableCell>
                <TableCell>
                  <Chip label={row.category} size="small" variant="outlined" sx={{ fontSize: '0.75rem', fontWeight: 600 }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Core Principles Cards */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 2.5 }}>
        7 กฎเหล็กของสถาปัตยกรรม MUI-First
      </Typography>
      <Grid container spacing={2.5}>
        {corePrinciples.map((item, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: '1px solid #E2E8F0',
                bgcolor: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                {item.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

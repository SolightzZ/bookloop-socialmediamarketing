import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Code as CodeIcon,
  Layers as LayersIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  CheckCircleOutlined as CheckIcon,
  CloudUploadOutlined as DeployIcon,
  GitHub as GitHubIcon,
  ArrowForward as ArrowForwardIcon,
  ViewQuilt as LayoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme';
import { trackEvent } from '../utils/analytics';
import Swal from 'sweetalert2';
import { StackOverviewTable } from '../components/techstack/StackOverviewTable';
import { MuiComponentsCatalog } from '../components/techstack/MuiComponentsCatalog';
import { DesignTokensSection } from '../components/techstack/DesignTokensSection';
import { StateStorageSection } from '../components/techstack/StateStorageSection';
import { DeployGuideSection } from '../components/techstack/DeployGuideSection';
import { VerificationChecklist } from '../components/techstack/VerificationChecklist';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tech-tabpanel-${index}`}
      aria-labelledby={`tech-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: { xs: 2.5, md: 3.5 } }}>{children}</Box>}
    </div>
  );
}

export default function TechStackPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    trackEvent('view_tech_stack');
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'คัดลอกคำสั่งเรียบร้อยแล้ว',
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12 }}>
      {/* Header / Hero Section */}
      <Box
        sx={{
          bgcolor: tokens.colors.footerBg,
          color: '#FFFFFF',
          py: { xs: 6, md: 8 },
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 3.5, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <CodeIcon sx={{ color: '#38BDF8', fontSize: 30 }} />
            <Typography
              variant="overline"
              sx={{
                color: '#38BDF8',
                fontWeight: 800,
                letterSpacing: 2,
                fontSize: '0.85rem',
              }}
            >
              FRONTEND ARCHITECTURE & TECH STACK
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.85rem', sm: '2.4rem', md: '3.1rem' },
              letterSpacing: '-0.5px',
              mb: 2,
              lineHeight: 1.25,
              color: '#FFFFFF !important',
            }}
          >
            BookLoop Frontend Technology Stack
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#E2E8F0',
              fontWeight: 400,
              maxWidth: 880,
              lineHeight: 1.7,
              fontSize: { xs: '0.95rem', md: '1.15rem' },
              mb: 3.5,
            }}
          >
            โครงสร้างสถาปัตยกรรมระดับมืออาชีพที่ออกแบบโดยใช้ <strong>MUI เป็นแกนหลัก (MUI-First Standard)</strong> ร่วมกับ React 19, TypeScript และ Vite 8 พร้อมระบบ Responsive Design, Global Context State, Client Persistence และความพร้อมเต็มรูปแบบสำหรับ <strong>Deploy บน GitHub & Cloud Platform</strong>
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
            <Chip
              icon={<GitHubIcon sx={{ color: '#38BDF8 !important', fontSize: 18 }} />}
              label="GitHub Deploy Ready"
              sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)' }}
            />
            <Chip label="React 19" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontWeight: 700 }} />
            <Chip label="MUI Core + Icons" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontWeight: 700 }} />
            <Chip label="TypeScript 5.8" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontWeight: 700 }} />
            <Chip label="React Router v7" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontWeight: 700 }} />
            <Chip label="Vite 8 SPA" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontWeight: 700 }} />
            <Chip label="SweetAlert2" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontWeight: 700 }} />
            <Chip label="Client Persistence" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontWeight: 700 }} />
          </Box>
        </Container>
      </Box>

      {/* Main Content Area with Navigation Tabs */}
      <Container maxWidth="xl" sx={{ mt: 4, px: { xs: 2, sm: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #D9E2EC',
            bgcolor: '#FFFFFF',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.875rem', md: '0.95rem' },
                minHeight: 58,
                px: { xs: 2, md: 3 },
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <Tab icon={<LayersIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="1. ภาพรวมสถาปัตยกรรม (Architecture)" />
            <Tab icon={<LayoutIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="2. MUI Components System" />
            <Tab icon={<PaletteIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="3. Design Tokens & Typography" />
            <Tab icon={<StorageIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="4. State & Data Persistence" />
            <Tab icon={<DeployIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="5. GitHub & Deploy Guide" />
            <Tab icon={<CheckIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="6. Verification Checklist" />
          </Tabs>

          <Box sx={{ p: { xs: 2.5, sm: 3.5, md: 4.5 } }}>
            <TabPanel value={tabValue} index={0}>
              <StackOverviewTable />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <MuiComponentsCatalog />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <DesignTokensSection />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <StateStorageSection />
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <DeployGuideSection onCopy={copyToClipboard} />
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
              <VerificationChecklist />
            </TabPanel>
          </Box>
        </Paper>

        {/* Quick Navigation Footer Cards */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
            สำรวจส่วนอื่นๆ ของ BookLoop
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/books')}
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 2, px: 3.5, py: 1.1, fontWeight: 700 }}
            >
              ค้นหาหนังสือในระบบ
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/about')}
              sx={{ borderRadius: 2, px: 3, py: 1.1, fontWeight: 600 }}
            >
              เกี่ยวกับเรา & BookLoop Story
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/sell')}
              sx={{ borderRadius: 2, px: 3, py: 1.1, fontWeight: 600 }}
            >
              ทดลองฟอร์มลงขายหนังสือ
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

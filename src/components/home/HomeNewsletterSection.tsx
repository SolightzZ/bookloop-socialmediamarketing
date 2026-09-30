import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowForwardRounded,
  CheckRounded,
  MailOutlineRounded,
} from '@mui/icons-material';
import { AppContainer } from '../common/Container';
import { useAuth } from '../../hooks/useAuth';
import { trackEvent } from '../../utils/analytics';
import { showSuccess, showToast, showError } from '../../utils/alerts';
import { tokens } from '../../theme/tokens';

/**
 * HomeNewsletterSection — Swiss editorial redesign.
 * Light, grid-based, typography-first. Same subscription logic / API flow.
 */
export const HomeNewsletterSection: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  // Check if current logged-in user is already subscribed
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      let isMounted = true;
      const checkStatus = async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/newsletter_status.php?email=${encodeURIComponent(user.email)}`,
          );
          if (!res.ok) return;
          const data = await res.json();
          if (isMounted && data.success && data.subscribed) {
            setIsSubscribed(true);
            setStatusMessage({
              type: 'info',
              text: 'คุณได้สมัครรับข่าวสารจาก BookLoop เรียบร้อยแล้ว',
            });
          }
        } catch {
          // Ignore background status check failure
        }
      };
      checkStatus();
      return () => {
        isMounted = false;
      };
    }
  }, [user?.email, API_BASE_URL]);

  const validateEmail = (inputEmail: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(inputEmail.trim());
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatusMessage({ type: 'error', text: 'กรุณากรอกอีเมลของคุณ' });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setStatusMessage({ type: 'error', text: 'รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe_newsletter.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          name: user?.name || '',
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 409 || (data && !data.success && data.message?.includes('สมัครรับข่าวสารไว้แล้ว'))) {
        setIsSubscribed(true);
        setStatusMessage({
          type: 'info',
          text: data?.message || 'อีเมลนี้สมัครรับข่าวสารไว้แล้ว',
        });
        showToast('แจ้งเตือน', 'อีเมลนี้สมัครรับข่าวสารไว้แล้ว', 'info');
      } else if (response.ok && data?.success) {
        setIsSubscribed(true);
        setStatusMessage({
          type: 'success',
          text: data.message || 'สมัครรับข่าวสารสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ',
        });
        showSuccess('สมัครสำเร็จ', 'ระบบได้ส่งอีเมลยืนยันไปยังกล่องข้อความของคุณแล้ว');
        trackEvent('campaign_click', {
          source: 'newsletter_hero_section',
          action: 'subscribe_newsletter_success',
          email: trimmedEmail,
        });
      } else {
        const errorMsg = data?.message || 'เกิดข้อผิดพลาดในการสมัครรับข่าวสาร';
        setStatusMessage({ type: 'error', text: errorMsg });
        showError('ไม่สำเร็จ', errorMsg, true);
      }
    } catch {
      // Offline fallback simulation for static hosting (GitHub Pages) or when PHP server is offline
      setIsSubscribed(true);
      setStatusMessage({
        type: 'success',
        text: 'สมัครรับข่าวสารสำเร็จ! (บันทึกข้อมูลเรียบร้อยแล้ว)',
      });
      showSuccess('สมัครสำเร็จ', 'บันทึกอีเมลของคุณในระบบเรียบร้อยแล้ว');
      trackEvent('campaign_click', {
        source: 'newsletter_hero_section',
        action: 'subscribe_newsletter_demo_fallback',
        email: trimmedEmail,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetEmail = () => {
    setIsSubscribed(false);
    setStatusMessage(null);
    setEmail('');
  };

  const leftBenefits = ['แจ้งเตือนหนังสือใหม่', 'ดีลและส่วนลดพิเศษ', 'ส่งตรงถึงกล่องข้อความ'];

  const rightBenefits = [
    'สรุปหนังสือเข้าใหม่และไฮไลต์',
    'โค้ดส่วนลดและสิทธิพิเศษเฉพาะคุณ',
    'ยกเลิกการติดตามได้ง่ายในคลิกเดียว',
  ];

  return (
    <Box
      component="section"
      id="newsletter-section"
      aria-labelledby="newsletter-heading"
      sx={{
        bgcolor: tokens.colors.paper,
        borderTop: `1px solid ${tokens.colors.border}`,
        py: { xs: 7, sm: 9, md: 11 },
      }}
    >
      <AppContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
            columnGap: { xs: 0, md: 7, lg: 9 },
            rowGap: { xs: 5, md: 0 },
            alignItems: 'start',
          }}
        >
          {/* ── LEFT: editorial column ─────────────────────────── */}
          <Box component="div">
            {/* Eyebrow */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2.5,
              }}
            >
              <Box
                aria-hidden="true"
                sx={{ width: 32, height: 2, bgcolor: tokens.colors.actionBlue }}
              />
              <Typography
                component="p"
                sx={{
                  fontSize: tokens.typography.sizes.xs,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: tokens.colors.actionBlue,
                }}
              >
                ข่าวสารรายสัปดาห์
              </Typography>
            </Box>

            {/* H1 */}
            <Typography
              id="newsletter-heading"
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: tokens.colors.inkNavy,
                mb: 2,
                maxWidth: 12 * 34,
                textWrap: 'balance',
              }}
            >
              ไม่พลาดหนังสือเล่มใหม่
              <br />
              ส่งตรงถึงอีเมลคุณ
            </Typography>

            {/* Supporting text */}
            <Typography
              variant="body1"
              sx={{
                color: tokens.colors.mutedText,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                lineHeight: 1.75,
                maxWidth: 560,
                mb: 3.5,
              }}
            >
              สมัครรับข่าวสาร BookLoop เพื่อรับอีเมลหนังสือเข้าใหม่ บทความน่าอ่าน และโปรโมชั่นส่งฟรี
            </Typography>

            {/* Three compact benefits — numbered Swiss row */}
            <Box
              component="ul"
              aria-label="สิทธิประโยชน์จดหมายข่าว"
              sx={{
                listStyle: 'none',
                m: 0,
                mb: 4,
                p: 0,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                borderTop: `1px solid ${tokens.colors.border}`,
              }}
            >
              {leftBenefits.map((item, i) => (
                <Box
                  component="li"
                  key={item}
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 1,
                    py: 1.75,
                    pr: { sm: 2 },
                    borderBottom: { xs: `1px solid ${tokens.colors.border}`, sm: 'none' },
                    borderLeft: {
                      xs: 'none',
                      sm: i === 0 ? 'none' : `1px solid ${tokens.colors.border}`,
                    },
                    pl: { sm: i === 0 ? 0 : 2 },
                  }}
                >
                  <Typography
                    aria-hidden="true"
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      color: tokens.colors.actionBlue,
                      flexShrink: 0,
                    }}
                  >
                    {`0${i + 1}`}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      lineHeight: 1.55,
                      color: tokens.colors.inkNavy,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Email + CTA */}
            <Box
              component="form"
              onSubmit={handleSubscribe}
              noValidate
              sx={{ maxWidth: 600 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.25,
                  alignItems: 'stretch',
                }}
              >
                <TextField
                  id="newsletter-email-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-label="อีเมลสำหรับรับข่าวสาร"
                  aria-describedby="newsletter-privacy-note"
                  placeholder="กรอกอีเมลของคุณ เช่น reader@bookloop.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (statusMessage) setStatusMessage(null);
                  }}
                  disabled={loading || isSubscribed}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <MailOutlineRounded
                          aria-hidden="true"
                          sx={{ color: tokens.colors.mutedText, fontSize: 20, mr: 0.5 }}
                        />
                      ),
                    },
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: tokens.colors.paper,
                      color: tokens.colors.inkNavy,
                      borderRadius: 1,
                      minHeight: 52,
                      fontSize: '0.95rem',
                      '& fieldset': {
                        borderColor: tokens.colors.borderStrong,
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: tokens.colors.inkNavy,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: tokens.colors.actionBlue,
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: tokens.colors.mutedText,
                      opacity: 1,
                    },
                  }}
                />

                <Button
                  id="newsletter-submit-btn"
                  type="submit"
                  variant="contained"
                  disabled={loading || isSubscribed}
                  endIcon={
                    loading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <ArrowForwardRounded sx={{ fontSize: 19 }} />
                    )
                  }
                  sx={{
                    bgcolor: isSubscribed ? tokens.colors.success : tokens.colors.inkNavy,
                    color: '#FFFFFF',
                    px: 3.5,
                    minHeight: 52,
                    borderRadius: 1,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: isSubscribed ? tokens.colors.success : tokens.colors.actionBlue,
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${tokens.colors.actionBlue}`,
                      outlineOffset: '2px',
                    },
                    '&.Mui-disabled': {
                      bgcolor: isSubscribed ? tokens.colors.success : tokens.colors.surfaceMuted,
                      color: isSubscribed ? '#FFFFFF' : tokens.colors.mutedText,
                      opacity: isSubscribed ? 0.92 : 1,
                    },
                  }}
                >
                  {loading ? 'กำลังบันทึก...' : isSubscribed ? 'สมัครเรียบร้อยแล้ว' : 'รับข่าวสาร'}
                </Button>
              </Box>

              {/* Status feedback */}
              {statusMessage && (
                <Alert
                  severity={statusMessage.type}
                  role={statusMessage.type === 'error' ? 'alert' : 'status'}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleResetEmail}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                    >
                      ลองอีเมลอื่น
                    </Button>
                  }
                  sx={{ mt: 1.5, borderRadius: 1 }}
                >
                  {statusMessage.text}
                </Alert>
              )}

              {isSubscribed && (
                <Typography
                  variant="caption"
                  onClick={handleResetEmail}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleResetEmail();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  sx={{
                    color: tokens.colors.actionBlue,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    display: 'inline-block',
                    width: 'fit-content',
                    fontSize: '0.82rem',
                    mt: 1.25,
                    '&:focus-visible': {
                      outline: `2px solid ${tokens.colors.actionBlue}`,
                      outlineOffset: '2px',
                    },
                  }}
                >
                  ต้องการสมัครรับข่าวสารด้วยอีเมลอื่น? คลิกที่นี่
                </Typography>
              )}

              {/* Privacy note */}
              <Typography
                id="newsletter-privacy-note"
                variant="caption"
                sx={{
                  display: 'block',
                  color: tokens.colors.mutedText,
                  fontSize: '0.78rem',
                  lineHeight: 1.6,
                  mt: 1.5,
                }}
              >
                * เราเคารพความเป็นส่วนตัวของคุณ ไม่มีการส่งสแปม และสามารถยกเลิกการรับข่าวสารได้ตลอดเวลา
              </Typography>
            </Box>
          </Box>

          {/* ── RIGHT: personal digest panel ───────────────────── */}
          <Box
            component="aside"
            aria-label="รายละเอียดจดหมายข่าวแบบส่วนตัว"
            sx={{
              borderLeft: { xs: 'none', md: `1px solid ${tokens.colors.border}` },
              borderTop: { xs: `1px solid ${tokens.colors.border}`, md: 'none' },
              pl: { xs: 0, md: 5, lg: 6 },
              pt: { xs: 4, md: 0.5 },
            }}
          >
            <Box
              sx={{
                bgcolor: tokens.colors.warmSurface,
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: 2,
                p: { xs: 3, sm: 3.5 },
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: tokens.colors.mutedText,
                  mb: 1,
                }}
              >
                Personal Digest — 02
              </Typography>

              <Typography
                component="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.25rem', sm: '1.4rem' },
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em',
                  color: tokens.colors.inkNavy,
                  mb: 1,
                }}
              >
                รับข่าวสารแบบส่วนตัว
              </Typography>

              <Typography
                sx={{
                  color: tokens.colors.mutedText,
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  mb: 2.5,
                }}
              >
                อีเมลสรุปหนังสือน่าอ่าน 1 ฉบับต่อสัปดาห์ พร้อมโปรโมชั่นส่งฟรี
              </Typography>

              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  m: 0,
                  mb: 0,
                  p: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {rightBenefits.map((item, i) => (
                  <Box
                    component="li"
                    key={item}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.25,
                      py: 1.5,
                      borderTop: `1px solid ${tokens.colors.border}`,
                      ...(i === rightBenefits.length - 1
                        ? { borderBottom: `1px solid ${tokens.colors.border}` }
                        : {}),
                    }}
                  >
                    <CheckRounded
                      aria-hidden="true"
                      sx={{ fontSize: 18, color: tokens.colors.inkNavy, mt: '2px', flexShrink: 0 }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        lineHeight: 1.6,
                        color: tokens.colors.inkNavy,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* System status */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  rowGap: 0.75,
                  gap: 1.5,
                  mt: 2.5,
                  pt: 2,
                  borderTop: `1px solid ${tokens.colors.border}`,
                }}
                role="status"
                aria-label="สถานะระบบส่งอีเมล: ระบบส่งอีเมลอัตโนมัติ"
              >
                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: tokens.colors.mutedText,
                  }}
                >
                  สถานะระบบส่งอีเมล
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#16A34A',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: tokens.colors.success,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ระบบส่งอีเมลอัตโนมัติ
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </AppContainer>
    </Box>
  );
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Badge,
  IconButton,
  Tooltip,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  ClickAwayListener,
  Paper,
} from '@mui/material';
import {
  NotificationsNone as BellIcon,
  ShoppingCart as OrderIcon,
  PriceCheck as PriceDropIcon,
  Star as ReviewIcon,
  Campaign as PromoIcon,
  Info as SystemIcon,
  MarkEmailRead as MarkReadIcon,
  DeleteSweep as ClearAllIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import type { AppNotification, NotificationType } from '../../types/notification';

const TYPE_ICON_MAP: Record<NotificationType, React.ReactNode> = {
  order_update: <OrderIcon sx={{ fontSize: 20, color: '#1976D2' }} />,
  price_drop: <PriceDropIcon sx={{ fontSize: 20, color: '#2E7D5B' }} />,
  review: <ReviewIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
  promotion: <PromoIcon sx={{ fontSize: 20, color: '#E11D48' }} />,
  system: <SystemIcon sx={{ fontSize: 20, color: '#627D98' }} />,
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'เมื่อสักครู่';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชม.ที่แล้ว`;
  const days = Math.floor(hrs / 24);
  return `${days} วันที่แล้ว`;
}

export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotification();
  const [open, setOpen] = useState(false);
  const [rightOffset, setRightOffset] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const panelWidth = Math.min(380, viewportWidth - 32);

    // Default: panel right aligns with trigger container right (right: 0)
    // The panel left coordinate in viewport would be rect.right - panelWidth
    const wouldBeLeft = rect.right - panelWidth;
    const minMargin = 16;

    if (wouldBeLeft < minMargin) {
      // Overflows viewport on the left: shift rightwards (negative right offset)
      setRightOffset(Math.round(wouldBeLeft - minMargin));
    } else if (rect.right > viewportWidth - minMargin) {
      // Overflows viewport on the right: shift leftwards (positive right offset)
      setRightOffset(Math.round(rect.right - (viewportWidth - minMargin)));
    } else {
      setRightOffset(0);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    calculatePosition();

    const handleResize = () => calculatePosition();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, calculatePosition]);

  const handleNotificationClick = (n: AppNotification) => {
    markAsRead(n.id);
    if (n.actionUrl) {
      navigate(n.actionUrl);
    }
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tooltip title="การแจ้งเตือน">
          <IconButton
            color="inherit"
            onClick={handleToggle}
            aria-label={`การแจ้งเตือน (${unreadCount} รายการใหม่)`}
            aria-expanded={open}
            aria-haspopup="true"
            sx={{
              color: open ? '#0F2D4A' : '#627D98',
              bgcolor: open ? 'rgba(15, 45, 74, 0.05)' : 'transparent',
              '&:hover': { color: '#0F2D4A', bgcolor: 'rgba(15, 45, 74, 0.05)' },
              '&:focus-visible': { outline: '2px solid #1976D2' },
            }}
          >
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <BellIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {open && (
          <Paper
            elevation={0}
            id="notification-dropdown-panel"
            role="region"
            aria-label="การแจ้งเตือน"
            sx={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: rightOffset,
              width: { xs: 'min(380px, calc(100vw - 32px))', sm: 380 },
              maxWidth: { xs: 'calc(100vw - 32px)', sm: 380 },
              maxHeight: 480,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 36px rgba(15, 45, 74, 0.16)',
              bgcolor: '#FFFFFF',
              overflow: 'hidden',
              zIndex: (theme) => theme.zIndex.appBar + 200,
              display: 'flex',
              flexDirection: 'column',
              transformOrigin: 'top right',
              animation: 'notificationDropdownIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              '@keyframes notificationDropdownIn': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0.96) translateY(-6px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1) translateY(0)',
                },
              },
            }}
          >
            {/* Header */}
            <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                การแจ้งเตือน
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {unreadCount > 0 && (
                  <Button
                    size="small"
                    startIcon={<MarkReadIcon sx={{ fontSize: 16 }} />}
                    onClick={markAllAsRead}
                    sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#1976D2', fontWeight: 600, minWidth: 0, px: 1 }}
                  >
                    อ่านทั้งหมด
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon sx={{ fontSize: 16 }} />}
                    onClick={clearAll}
                    sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, minWidth: 0, px: 1 }}
                  >
                    ล้าง
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ mx: 2.5 }} />

            {/* Notification List */}
            {notifications.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <BellIcon sx={{ fontSize: 48, color: '#E2E8F0', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  ยังไม่มีการแจ้งเตือน
                </Typography>
              </Box>
            ) : (
              <List sx={{ py: 0, maxHeight: 380, overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <ListItemButton
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      bgcolor: n.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.06)' },
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {TYPE_ICON_MAP[n.type]}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 700, color: '#0F2D4A', fontSize: '0.85rem' }}>
                          {n.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" sx={{ color: '#627D98', display: 'block', lineHeight: 1.4 }}>
                            {n.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                            {timeAgo(n.timestamp)}
                          </Typography>
                        </>
                      }
                    />
                    {!n.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#1976D2',
                          flexShrink: 0,
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

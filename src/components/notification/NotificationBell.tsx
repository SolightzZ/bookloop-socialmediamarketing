import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Tooltip,
  Popover,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
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
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotification();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (n: AppNotification) => {
    markAsRead(n.id);
    if (n.actionUrl) {
      navigate(n.actionUrl);
    }
    handleClose();
  };

  return (
    <>
      <Tooltip title="การแจ้งเตือน">
        <IconButton
          color="inherit"
          onClick={handleOpen}
          aria-label={`การแจ้งเตือน (${unreadCount} รายการใหม่)`}
          sx={{
            color: '#627D98',
            '&:hover': { color: '#0F2D4A', bgcolor: 'rgba(15, 45, 74, 0.05)' },
            '&:focus-visible': { outline: '2px solid #1976D2' },
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <BellIcon sx={{ fontSize: 22 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 380,
              maxHeight: 480,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 30px rgba(15, 45, 74, 0.12)',
              overflow: 'hidden',
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
      </Popover>
    </>
  );
};

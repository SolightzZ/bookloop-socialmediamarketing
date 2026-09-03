import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  PersonOutlined as ProfileIcon,
  ShoppingBagOutlined as OrdersIcon,
  FavoriteBorder as WishlistIcon,
  MenuBook as MyBooksIcon,
  SettingsOutlined as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { showConfirm, showSuccess } from '../../utils/alerts';
import { trackEvent } from '../../utils/analytics';

interface UserMenuProps {
  onItemClick?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onItemClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!user) return null;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleClose();
    if (onItemClick) onItemClick();
    navigate(path);
  };

  const handleLogout = () => {
    handleClose();
    showConfirm('ต้องการออกจากระบบหรือไม่?', 'คุณสามารถเข้าสู่ระบบกลับมาได้ตลอดเวลา').then((result) => {
      if (result.isConfirmed) {
        trackEvent('user_logout', { userId: user.id });
        logout();
        if (onItemClick) onItemClick();
        showSuccess('ออกจากระบบเรียบร้อย', 'แล้วพบกันใหม่ที่ BookLoop');
        navigate('/');
      }
    });
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        aria-controls={open ? 'user-account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-label="บัญชีผู้ใช้"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0,
          p: 0.5,
          borderRadius: '50%',
          color: 'text.primary',
          bgcolor: open ? 'rgba(15, 41, 66, 0.06)' : 'transparent',
          transition: 'all 0.15s ease',
          '&:hover': {
            bgcolor: 'rgba(15, 41, 66, 0.08)',
          },
        }}
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          sx={{
            width: { xs: 34, sm: 36 },
            height: { xs: 34, sm: 36 },
            bgcolor: 'primary.main',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: '2px solid #FFFFFF',
            boxShadow: open ? '0 0 0 2px #1976D2' : '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.15s ease',
          }}
        >
          {user.name.charAt(0)}
        </Avatar>
      </Button>

      <Menu
        id="user-account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: 250,
              mt: 1.5,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 25px -5px rgba(15, 41, 66, 0.1), 0 8px 10px -6px rgba(15, 41, 66, 0.05)',
              overflow: 'visible',
              p: 0.5,
            },
          },
        }}
      >
        {/* User Card Header */}
        <Box sx={{ px: 2, py: 1.5, mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }} noWrap>
            {user.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5, borderColor: '#F1F5F9' }} />

        {/* User Menu Items */}
        <MenuItem
          onClick={() => handleNavigate('/account/profile')}
          sx={{ py: 1, px: 1.75, borderRadius: 1.5, '&:hover': { bgcolor: '#F8FAFC' } }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'primary.main' }}>
            <ProfileIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>บัญชีของฉัน</Typography>}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigate('/account/orders')}
          sx={{ py: 1, px: 1.75, borderRadius: 1.5, '&:hover': { bgcolor: '#F8FAFC' } }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'primary.main' }}>
            <OrdersIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>คำสั่งซื้อของฉัน</Typography>}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigate('/account/wishlist')}
          sx={{ py: 1, px: 1.75, borderRadius: 1.5, '&:hover': { bgcolor: '#F8FAFC' } }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'primary.main' }}>
            <WishlistIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>รายการโปรด</Typography>}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigate('/account/books')}
          sx={{ py: 1, px: 1.75, borderRadius: 1.5, '&:hover': { bgcolor: '#F8FAFC' } }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'primary.main' }}>
            <MyBooksIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>หนังสือของฉัน</Typography>}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigate('/account/settings')}
          sx={{ py: 1, px: 1.75, borderRadius: 1.5, '&:hover': { bgcolor: '#F8FAFC' } }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'primary.main' }}>
            <SettingsIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>ตั้งค่าบัญชี</Typography>}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5, borderColor: '#F1F5F9' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1,
            px: 1.75,
            borderRadius: 1.5,
            color: 'error.main',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.06)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'error.main' }}>
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'error.main' }}>ออกจากระบบ</Typography>}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

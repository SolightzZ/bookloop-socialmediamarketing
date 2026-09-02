import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Button,
  InputBase,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  PersonOutlined as ProfileIcon,
  ShoppingBagOutlined as OrdersIcon,
  FavoriteBorder as WishlistIcon,
  MenuBook as MyBooksIcon,
  SettingsOutlined as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { NAV_ITEMS } from './navItems';
import { useAuth } from '../../hooks/useAuth';
import { showConfirm, showSuccess } from '../../utils/alerts';

const DrawerSearch = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: Number(theme.shape.borderRadius || 8) * 2,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  border: '1px solid #E2E8F0',
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    fontSize: '0.9rem',
  },
}));

interface AppMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const AppMobileDrawer: React.FC<AppMobileDrawerProps> = ({
  open,
  onClose,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    showConfirm('ต้องการออกจากระบบหรือไม่?').then((res) => {
      if (res.isConfirmed) {
        logout();
        onClose();
        showSuccess('ออกจากระบบแล้ว');
        navigate('/');
      }
    });
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
      }}
    >
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigate('/');
              onClose();
            }}
          >
            <Box
              component="img"
              src="/images/logo.png"
              alt="BookLoop Logo"
              referrerPolicy="no-referrer"
              sx={{
                width: 34,
                height: 34,
                mr: 1.5,
                borderRadius: 1.5,
                objectFit: 'contain',
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.3px', color: 'primary.main' }}>
              BookLoop
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="ปิดเมนู" size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User profile card or login prompt */}
        {isAuthenticated && user ? (
          <Box
            sx={{
              p: 1.75,
              mb: 2,
              borderRadius: 2.5,
              bgcolor: 'rgba(15, 41, 66, 0.04)',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
            onClick={() => {
              navigate('/account/profile');
              onClose();
            }}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 700 }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }} noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
              onClick={() => {
                navigate('/login');
                onClose();
              }}
              sx={{ borderRadius: 2, fontWeight: 700, py: 0.85 }}
            >
              เข้าสู่ระบบ
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => {
                navigate('/register');
                onClose();
              }}
              sx={{ borderRadius: 2, fontWeight: 700, py: 0.85 }}
            >
              สมัครสมาชิก
            </Button>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Box component="form" onSubmit={onSearchSubmit} sx={{ mb: 2.5 }}>
          <DrawerSearch>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="ค้นหาชื่อหนังสือ..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              inputProps={{ 'aria-label': 'ค้นหาชื่อหนังสือ' }}
            />
          </DrawerSearch>
        </Box>

        {/* Main Nav Items */}
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                    bgcolor: isActive ? 'rgba(23, 105, 170, 0.08)' : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(23, 105, 170, 0.12)',
                      '&:hover': { bgcolor: 'rgba(23, 105, 170, 0.18)' },
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'secondary.main' : 'text.primary',
                          fontSize: '0.925rem',
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* User Account Navigation links for authenticated users */}
        {isAuthenticated && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="caption" sx={{ px: 1.5, color: 'text.secondary', fontWeight: 700, mb: 0.5, display: 'block' }}>
              จัดการบัญชีของคุณ
            </Typography>
            <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate('/account/profile');
                    onClose();
                  }}
                  sx={{ borderRadius: 2, py: 0.85, px: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
                    <ProfileIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontSize: '0.875rem' }}>บัญชีของฉัน</Typography>} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate('/account/orders');
                    onClose();
                  }}
                  sx={{ borderRadius: 2, py: 0.85, px: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
                    <OrdersIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontSize: '0.875rem' }}>คำสั่งซื้อของฉัน</Typography>} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate('/account/wishlist');
                    onClose();
                  }}
                  sx={{ borderRadius: 2, py: 0.85, px: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
                    <WishlistIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontSize: '0.875rem' }}>รายการโปรด</Typography>} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate('/account/books');
                    onClose();
                  }}
                  sx={{ borderRadius: 2, py: 0.85, px: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
                    <MyBooksIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontSize: '0.875rem' }}>หนังสือของฉัน</Typography>} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate('/account/settings');
                    onClose();
                  }}
                  sx={{ borderRadius: 2, py: 0.85, px: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
                    <SettingsIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontSize: '0.875rem' }}>ตั้งค่าบัญชี</Typography>} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{ borderRadius: 2, py: 0.85, px: 1.5, color: 'error.main' }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'error.main' }}>
                    <LogoutIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'error.main' }}>ออกจากระบบ</Typography>} />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}

        <Box sx={{ mt: 'auto', pt: 2.5, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => {
              navigate('/sell');
              onClose();
            }}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            ส่งต่อหนังสือ
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

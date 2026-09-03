import React from 'react';
import { Box, Badge, IconButton, Typography } from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  AddCircleOutlined as SellIcon,
  ShoppingCart as CartIcon,
  Person as AccountIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { label: 'หน้าแรก', path: '/', icon: HomeIcon },
  { label: 'ค้นหา', path: '/books', icon: SearchIcon },
  { label: 'ขาย', path: '/sell', icon: SellIcon },
  { label: 'ตะกร้า', path: '/cart', icon: CartIcon },
  { label: 'บัญชี', path: '/account', icon: AccountIcon },
] as const;

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      component="nav"
      aria-label="เมนูหลัก (มือถือ)"
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar + 50,
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        boxShadow: '0 -2px 8px rgba(15, 45, 74, 0.06)',
        py: 0.5,
        px: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        const needsAuth = item.path === '/account' && !isAuthenticated;

        return (
          <IconButton
            key={item.path}
            onClick={() => navigate(needsAuth ? '/login' : item.path)}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.25,
              py: 0.75,
              px: 1.5,
              minWidth: 56,
              borderRadius: 2,
              color: active ? '#1976D2' : '#94A3B8',
              bgcolor: active ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: active ? 'rgba(25, 118, 210, 0.12)' : 'rgba(15, 45, 74, 0.04)' },
              '&:focus-visible': { outline: '2px solid #1976D2' },
            }}
          >
            {item.path === '/cart' ? (
              <Badge badgeContent={cartCount} color="primary" max={99} sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
                <Icon sx={{ fontSize: 24 }} />
              </Badge>
            ) : (
              <Icon sx={{ fontSize: 24 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                fontWeight: active ? 700 : 500,
                lineHeight: 1,
                color: 'inherit',
              }}
            >
              {item.label}
            </Typography>
          </IconButton>
        );
      })}
    </Box>
  );
};

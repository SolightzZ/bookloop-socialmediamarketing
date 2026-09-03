import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  InputBase,
  Tooltip,
  Divider,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCartOutlined as CartIcon,
  FavoriteBorder as WishlistIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { NAV_ITEMS } from './navItems';
import { useAuth } from '../../hooks/useAuth';
import { AuthButton } from '../navbar/AuthButton';
import { UserMenu } from '../navbar/UserMenu';
import { SearchBar } from '../common/SearchBar';
import { NotificationBell } from '../notification/NotificationBell';

const logoImg = '/images/logo.png';
export interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  onOpenMobileMenu,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (location.pathname === path) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    onSearchSubmit(e);
    setMobileSearchOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        component="header"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: (theme) => theme.zIndex.appBar + 100,
          pt: { xs: 1, sm: 1.25, md: isScrolled ? 1 : 1.5 },
          pb: { xs: 0.75, sm: 1, md: 1 },
          px: { xs: 1.25, sm: 2, md: 3 },
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
        }}
      >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          pointerEvents: 'auto',
          maxWidth: { lg: '1240px' },
          bgcolor: '#F7FAFC',
          backgroundColor: '#F7FAFC',
          borderRadius: { xs: 3.5, md: 50 },
          border: '1px solid',
          borderColor: isScrolled ? '#CBD5E1' : '#E2E8F0',
          boxShadow: isScrolled
            ? '0 1px 3px 0 rgba(15, 45, 74, 0.04), 0 1px 2px -1px rgba(15, 45, 74, 0.03)'
            : '0 1px 2px 0 rgba(15, 45, 74, 0.02)',
          px: { xs: 1.5, sm: 2.25, md: 3 },
          py: 0,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 2px 6px -1px rgba(15, 45, 74, 0.06), 0 1px 3px 0 rgba(15, 45, 74, 0.03)',
            borderColor: '#CBD5E1',
          },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            height: { xs: 58, sm: 64, md: 72 },
            minHeight: { xs: 58, sm: 64, md: 72 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
            width: '100%',
          }}
        >
          {/* LEFT: Brand Logo */}
          <Box
            component="div"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/');
              }
            }}
            aria-label="BookLoop - กลับไปหน้าแรก"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: 2,
              p: 0.5,
              flexShrink: 0,
              '&:focus-visible': {
                outline: '2px solid #1976D2',
                outlineOffset: '2px',
              },
            }}
          >
            <Box
              component="img"
              src={logoImg}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              sx={{
                width: { xs: 32, md: 38 },
                height: { xs: 32, md: 38 },
                mr: { xs: 1, md: 1.25 },
                borderRadius: 1.5,
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="h5"
              component="span"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#0F2D4A',
                fontSize: { xs: '1.25rem', md: '1.45rem' },
                lineHeight: 1,
              }}
            >
              BookLoop
            </Typography>
          </Box>

          {/* DESKTOP CENTER: Navigation Links */}
          <Box
            component="nav"
            aria-label="เมนูหลัก"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: { md: 0.5, lg: 1.25 },
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#1976D2' : '#627D98',
                    borderRadius: 50,
                    px: { md: 1.2, lg: 2 },
                    py: 0.65,
                    fontSize: { md: '0.85rem', lg: '0.9rem' },
                    bgcolor: isActive ? '#EAF4FF' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? '#EAF4FF' : 'rgba(25, 118, 210, 0.06)',
                      color: '#1976D2',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #1976D2',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* DESKTOP RIGHT: Global Search + Actions + User Menu */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: { md: 1, lg: 1.5 },
              flexShrink: 0,
            }}
          >
            {/* Global Search Bar (Unified SearchBar component) */}
            <SearchBar
              variant="header"
              value={searchQuery}
              onChange={onSearchQueryChange}
              onSubmit={onSearchSubmit}
            />

            {/* Wishlist */}
            <Tooltip title="รายการโปรดของคุณ">
              <IconButton
                color="inherit"
                onClick={() => navigate('/books?favorite=true')}
                aria-label={`รายการโปรด (${wishlistCount} เล่ม)`}
                sx={{
                  color: '#627D98',
                  '&:hover': { color: '#0F2D4A', bgcolor: 'rgba(15, 45, 74, 0.05)' },
                  '&:focus-visible': { outline: '2px solid #1976D2' },
                }}
              >
                <Badge badgeContent={wishlistCount} color="error" max={99}>
                  <WishlistIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Cart */}
            <Tooltip title="ตะกร้าสินค้า">
              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
                aria-label={`ตะกร้าสินค้า (${cartCount} รายการ)`}
                sx={{
                  color: '#627D98',
                  '&:hover': { color: '#0F2D4A', bgcolor: 'rgba(15, 45, 74, 0.05)' },
                  '&:focus-visible': { outline: '2px solid #1976D2' },
                }}
              >
                <Badge badgeContent={cartCount} color="primary" max={99}>
                  <CartIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notification Bell */}
            <NotificationBell />

            <Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto', borderColor: '#D9E2EC' }} />

            {/* Auth / User Menu with No Flicker */}
            {isLoading ? (
              <Box sx={{ minWidth: 148, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={18} sx={{ color: '#1976D2' }} />
              </Box>
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <AuthButton />
            )}
          </Box>

          {/* MOBILE RIGHT: Search, Cart, Menu */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            {/* Mobile Search Toggle */}
            <IconButton
              color="inherit"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label={mobileSearchOpen ? 'ปิดช่องค้นหา' : 'ค้นหาหนังสือ'}
              sx={{
                color: mobileSearchOpen ? '#1976D2' : '#627D98',
                '&:focus-visible': { outline: '2px solid #1976D2' },
              }}
            >
              {mobileSearchOpen ? <CloseIcon sx={{ fontSize: 22 }} /> : <SearchIcon sx={{ fontSize: 22 }} />}
            </IconButton>

            {/* Mobile Cart */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              aria-label={`ตะกร้าสินค้า (${cartCount} รายการ)`}
              sx={{
                color: '#627D98',
                '&:focus-visible': { outline: '2px solid #1976D2' },
              }}
            >
              <Badge badgeContent={cartCount} color="primary" max={99}>
                <CartIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              edge="end"
              onClick={onOpenMobileMenu}
              aria-label="เมนู"
              sx={{
                color: '#0F2D4A',
                ml: 0.5,
                '&:focus-visible': { outline: '2px solid #1976D2' },
              }}
            >
              <MenuIcon sx={{ fontSize: 26 }} />
            </IconButton>
          </Box>
        </Toolbar>

        {/* MOBILE COLLAPSIBLE SEARCH BAR */}
        <Collapse in={mobileSearchOpen}>
          <Box
            sx={{
              pb: 2,
              pt: 0.5,
              display: { xs: 'block', md: 'none' },
            }}
          >
            <SearchBar
              variant="hero"
              value={searchQuery}
              onChange={onSearchQueryChange}
              onSubmit={handleMobileSearchSubmit}
              placeholder="ค้นหาชื่อหนังสือ, ผู้เขียน, หรือ ISBN..."
            />
          </Box>
        </Collapse>
      </Container>
    </AppBar>

    {/* Responsive spacer to ensure page content starts below the fixed floating navbar */}
    <Box
      aria-hidden="true"
      sx={{
        height: { xs: 70, sm: 76, md: 84 },
        width: '100%',
        flexShrink: 0,
      }}
    />
  </>
  );
};

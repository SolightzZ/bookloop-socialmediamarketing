import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container, InputBase, Tooltip, Divider, CircularProgress } from '@mui/material';
import { ShoppingCartOutlined as CartIcon, FavoriteBorder as WishlistIcon, Favorite as WishlistActiveIcon, Menu as MenuIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { NAV_ITEMS } from './navItems';
import { useAuth } from '../../hooks/useAuth';
import { AuthButton } from '../navbar/AuthButton';
import { UserMenu } from '../navbar/UserMenu';
import { NotificationBell } from '../notification/NotificationBell';
import { AnimatedBadge } from '../common/AnimatedBadge';

const logoImg = `${import.meta.env.BASE_URL}images/logo.webp`;
export interface HeaderProps {
   cartCount: number;
   wishlistCount: number;
   onOpenMobileMenu: () => void;
   searchQuery?: string;
   onSearchQueryChange?: (query: string) => void;
   onSearchSubmit?: (e: React.FormEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, wishlistCount, onOpenMobileMenu }) => {
   const navigate = useNavigate();
   const location = useLocation();
   const { isAuthenticated, isLoading } = useAuth();
   const [isScrolled, setIsScrolled] = useState(false);

   const isWishlistActive =
      (location.pathname === '/books' && new URLSearchParams(location.search).get('favorite') === 'true') || location.pathname === '/wishlist' || location.pathname === '/account/wishlist';

   useEffect(() => {
      let ticking = false;
      const handleScroll = () => {
         if (!ticking) {
            window.requestAnimationFrame(() => {
               const scrolled = window.scrollY > 20;
               setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
               ticking = false;
            });
            ticking = true;
         }
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

   const handleLogoClick = () => {
      if (location.pathname === '/') {
         // อยู่หน้าแรกแล้ว — navigate เป็น no-op จึงต้อง scroll เอง
         window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
         navigate('/');
      }
   };

   return (
      <Box
         sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 1200,
            pointerEvents: 'none',
         }}>
         <AppBar
            position="static"
            component="header"
            color="transparent"
            elevation={0}
            sx={{
               bgcolor: 'transparent',
               backgroundColor: 'transparent',
               backgroundImage: 'none',
               boxShadow: 'none',
               width: '100%',
               pt: { xs: 1, sm: 1.25, md: isScrolled ? 1 : 1.5 },
               pb: { xs: 0.75, sm: 1, md: 1 },
               px: { xs: 1.25, sm: 2, md: 3 },
               transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
               pointerEvents: 'none',
            }}>
            <Container
               maxWidth="lg"
               disableGutters
               sx={{
                  pointerEvents: 'auto',
                  maxWidth: { lg: '1240px' },
                  bgcolor: '#FFFFFF',
                  backgroundColor: '#FFFFFF',
                  borderRadius: { xs: 3, md: 50 },
                  border: '1px solid',
                  borderColor: isScrolled ? '#CBD5E1' : '#E5EAF0',
                  boxShadow: isScrolled ? '0 2px 6px -1px rgba(16, 42, 67, 0.08), 0 1px 3px 0 rgba(16, 42, 67, 0.04)' : '0 1px 3px 0 rgba(16, 42, 67, 0.04)',
                  px: { xs: 2, sm: 2, md: 1.75, lg: 2.5, xl: 3 },
                  py: 0,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                     boxShadow: '0 2px 6px -1px rgba(15, 45, 74, 0.06), 0 1px 3px 0 rgba(15, 45, 74, 0.03)',
                     borderColor: '#CBD5E1',
                  },
               }}>
               <Toolbar
                  disableGutters
                  sx={{
                     height: { xs: 60, sm: 64, md: 64 },
                     minHeight: { xs: 60, sm: 64, md: 64 },
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     gap: { xs: 1, md: 0.75, lg: 1.5 },
                     width: '100%',
                  }}>
                  {/* LEFT: Brand Logo */}
                  <Box
                     component="div"
                     role="button"
                     tabIndex={0}
                     onClick={handleLogoClick}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                           e.preventDefault();
                           handleLogoClick();
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
                        whiteSpace: 'nowrap',
                        '&:focus-visible': {
                           outline: '2px solid rgba(15, 23, 42, 0.2)',
                           outlineOffset: '2px',
                        },
                     }}>
                     <Box
                        component="img"
                        src={logoImg}
                        alt=""
                        aria-hidden="true"
                        referrerPolicy="no-referrer"
                        sx={{
                           width: { xs: 32, md: 34, lg: 38 },
                           height: { xs: 32, md: 34, lg: 38 },
                           mr: { xs: 0.75, md: 0.85, lg: 1.25 },
                           borderRadius: 1.5,
                           objectFit: 'contain',
                           flexShrink: 0,
                        }}
                     />
                     <Typography
                        variant="h5"
                        component="span"
                        sx={{
                           fontWeight: 800,
                           letterSpacing: '-0.02em',
                           fontSize: { xs: '1.2rem', md: '1.25rem', lg: '1.45rem' },
                           lineHeight: 1,
                           whiteSpace: 'nowrap',
                        }}>
                        <Box component="span" sx={{ color: '#102A43' }}>
                           Book
                        </Box>
                        <Box component="span" sx={{ color: '#1976D2' }}>
                           Loop
                        </Box>
                     </Typography>
                  </Box>

                  {/* DESKTOP CENTER: Navigation Links */}
                  <Box
                     component="nav"
                     aria-label="เมนูหลัก"
                     sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        flexShrink: 0,
                        gap: { md: 0.25, lg: 0.5, xl: 0.75 },
                     }}>
                     {NAV_ITEMS.map((item) => {
                        const isActive = !isWishlistActive && location.pathname === item.path;
                        return (
                           <button
                              key={item.label}
                              type="button"
                              onClick={() => handleNavigation(item.path)}
                              className={`relative px-3.5 py-1.5 rounded-full text-[0.85rem] lg:text-[0.88rem] font-medium whitespace-nowrap outline-none select-none cursor-pointer transition-colors duration-200 ${
                                 isActive ? 'text-[#1976D2] font-bold' : 'text-[#627D98] hover:text-[#1976D2]'
                              }`}>
                              {isActive && <span className="absolute inset-0 bg-[#EAF4FF] rounded-full z-0" />}
                              <span className="relative z-10">{item.label}</span>
                           </button>
                        );
                     })}
                  </Box>

                  {/* DESKTOP RIGHT: Actions + User Menu */}
                  <Box
                     sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        gap: { md: 0.75, lg: 1.25, xl: 1.5 },
                        flexShrink: 0,
                     }}>
                     {/* Wishlist with AnimatedBadge */}
                     <Tooltip title={isWishlistActive ? 'กำลังดูรายการโปรด' : 'รายการโปรดของคุณ'}>
                        <IconButton
                           size="small"
                           color="inherit"
                           onClick={() => navigate('/books?favorite=true')}
                           aria-label={`รายการโปรด (${wishlistCount} เล่ม)`}
                           sx={{
                              color: isWishlistActive ? '#E11D48' : '#627D98',
                              bgcolor: isWishlistActive ? '#FFF1F2' : 'transparent',
                              border: isWishlistActive ? '1px solid #FFE4E6' : '1px solid transparent',
                              borderRadius: '10px',
                              p: { md: 0.6, lg: 0.8 },
                              '&:hover': {
                                 color: isWishlistActive ? '#BE123C' : '#0F2D4A',
                                 bgcolor: isWishlistActive ? '#FFE4E6' : 'rgba(15, 45, 74, 0.05)',
                              },
                              '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
                           }}>
                           <AnimatedBadge count={wishlistCount} color="error" max={99}>
                              {isWishlistActive ? <WishlistActiveIcon sx={{ fontSize: { md: 20, lg: 22 }, color: '#E11D48' }} /> : <WishlistIcon sx={{ fontSize: { md: 20, lg: 22 } }} />}
                           </AnimatedBadge>
                        </IconButton>
                     </Tooltip>

                     {/* Cart with Apple Intelligence style Pop & Ripple Badge */}
                     <Tooltip title="ตะกร้าสินค้า">
                        <IconButton
                           size="small"
                           color="inherit"
                           onClick={() => navigate('/cart')}
                           aria-label={`ตะกร้าสินค้า (${cartCount} รายการ)`}
                           sx={{
                              color: '#627D98',
                              p: { md: 0.6, lg: 1 },
                              '&:hover': { color: '#0F2D4A', bgcolor: 'rgba(15, 45, 74, 0.05)' },
                              '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
                           }}>
                           <AnimatedBadge count={cartCount} color="primary" max={99}>
                              <CartIcon sx={{ fontSize: { md: 20, lg: 22 } }} />
                           </AnimatedBadge>
                        </IconButton>
                     </Tooltip>

                     {/* Notification Bell */}
                     <NotificationBell />

                     <Divider orientation="vertical" flexItem sx={{ height: 22, my: 'auto', mx: { md: 0.25, lg: 0.5 }, borderColor: '#D9E2EC' }} />

                     {/* Auth / User Menu with No Flicker */}
                     {isLoading ? (
                        <Box sx={{ minWidth: { md: 80, lg: 110 }, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <CircularProgress size={18} sx={{ color: '#1976D2' }} />
                        </Box>
                     ) : isAuthenticated ? (
                        <UserMenu />
                     ) : (
                        <AuthButton />
                     )}
                  </Box>

                  {/* MOBILE RIGHT: Cart, Menu */}
                  <Box
                     sx={{
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        gap: 0.75,
                        flexShrink: 0,
                     }}>
                     {/* Mobile Cart */}
                     <IconButton
                        color="inherit"
                        onClick={() => navigate('/cart')}
                        aria-label={`ตะกร้าสินค้า (${cartCount} รายการ)`}
                        sx={{
                           color: '#102A43',
                           minWidth: 44,
                           minHeight: 44,
                           p: 1.2,
                           borderRadius: '10px',
                           '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
                        }}>
                        <AnimatedBadge count={cartCount} color="primary" max={99}>
                           <CartIcon sx={{ fontSize: 22 }} />
                        </AnimatedBadge>
                     </IconButton>

                     {/* Mobile Menu Button */}
                     <IconButton
                        color="inherit"
                        edge="end"
                        onClick={(e) => {
                           (e.currentTarget as HTMLElement)?.blur();
                           onOpenMobileMenu();
                        }}
                        aria-label="เมนู"
                        sx={{
                           color: '#102A43',
                           minWidth: 44,
                           minHeight: 44,
                           p: 1.2,
                           borderRadius: '10px',
                           ml: 0.25,
                           '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
                        }}>
                        <MenuIcon sx={{ fontSize: 24 }} />
                     </IconButton>
                  </Box>
               </Toolbar>
            </Container>
         </AppBar>
      </Box>
   );
};

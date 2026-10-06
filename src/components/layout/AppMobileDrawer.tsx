import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Box, Typography, IconButton, ButtonBase, InputBase, Avatar, CircularProgress } from '@mui/material';
import {
   CloseRounded as CloseIcon,
   SearchRounded as SearchIcon,
   HomeOutlined as HomeIcon,
   FavoriteBorderRounded as HeartIcon,
   SendOutlined as SendIcon,
   PersonOutlineRounded as UserIcon,
   ShoppingBagOutlined as ShoppingBagIcon,
   MenuBookOutlined as BookOpenIcon,
   SettingsOutlined as SettingsIcon,
   ChevronRightRounded as ChevronRightIcon,
   LoginRounded as LoginIcon,
   PersonAddAlt1Rounded as RegisterIcon,
   LogoutRounded as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { tokens } from '../../theme/tokens';
import { showConfirm, showSuccess } from '../../utils/alerts';
import { trackEvent } from '../../utils/analytics';

export interface AppMobileDrawerProps {
   open: boolean;
   onClose: () => void;
   searchQuery: string;
   onSearchQueryChange: (query: string) => void;
   onSearchSubmit: (e: React.FormEvent) => void;
}

interface MainNavItem {
   label: string;
   path: string;
   icon: React.ComponentType<{ sx?: any }>;
}

const MAIN_NAV_ITEMS: readonly MainNavItem[] = [
   { label: 'หน้าแรก', path: '/', icon: HomeIcon },
   { label: 'ค้นหาหนังสือ', path: '/books', icon: SearchIcon },
   { label: 'สิ่งที่ชอบหนังสือ', path: '/wishlist', icon: HeartIcon },
   { label: 'ส่งต่อหนังสือ', path: '/sell', icon: SendIcon },
] as const;

interface AccountMenuItem {
   label: string;
   path: string;
   icon: React.ComponentType<{ sx?: any }>;
}

const ACCOUNT_MENU_ITEMS: readonly AccountMenuItem[] = [
   { label: 'บัญชีของฉัน', path: '/account/profile', icon: UserIcon },
   { label: 'คำสั่งซื้อของฉัน', path: '/account/orders', icon: ShoppingBagIcon },
   { label: 'รายการโปรด', path: '/account/wishlist', icon: HeartIcon },
   { label: 'หนังสือของฉัน', path: '/account/books', icon: BookOpenIcon },
   { label: 'ตั้งค่าบัญชี', path: '/account/settings', icon: SettingsIcon },
] as const;

/** Preload lazy route chunks ahead of time for instantaneous transitions on slow connections */
const prefetchRoute = (path: string) => {
   try {
      if (path.startsWith('/account')) {
         import('../../pages/AccountPage');
      } else if (path === '/books' || path === '/wishlist') {
         import('../../pages/BooksPage');
      } else if (path === '/sell') {
         import('../../pages/SellPage');
      } else if (path === '/') {
         import('../../pages/HomePage');
      } else if (path === '/login') {
         import('../../pages/LoginPage');
      } else if (path === '/register') {
         import('../../pages/RegisterPage');
      }
   } catch {
      // Ignore prefetch errors
   }
};

/**
 * AppMobileDrawer
 *
 * Theme: "Blue Ring"
 * Minimal Blue UI + Soft Ring Geometry + Clean White Surface
 *
 * - Slides from RIGHT to LEFT (anchor="right")
 * - 78–85vw width on mobile (max 360px)
 * - 20px 0 0 20px border radius, shadow -8px 0 30px
 * - Circular Blue Ring geometry accents
 * - Soft light-blue selection surface (#EAF4FF) for active menu
 * - Compact profile, search field with "Ctrl K" badge
 * - Account section routes directly to:
 *   /account/profile, /account/orders, /account/wishlist, /account/books, /account/settings
 * - Clean white background, no cards, no accent border lines
 * - Logout is managed within AccountPage (account/settings)
 */
export const AppMobileDrawer: React.FC<AppMobileDrawerProps> = ({ open, onClose, searchQuery, onSearchQueryChange, onSearchSubmit }) => {
   const navigate = useNavigate();
   const location = useLocation();
   const { user, isAuthenticated, isLoading, logout } = useAuth();

   // Warm up lazy bundles during idle time when drawer opens
   useEffect(() => {
      if (open) {
         const timer = setTimeout(() => {
            prefetchRoute('/account/orders');
            prefetchRoute('/books');
         }, 50);
         return () => clearTimeout(timer);
      }
   }, [open]);

   const handleNavigate = (path: string) => {
      prefetchRoute(path);
      onClose();
      requestAnimationFrame(() => {
         navigate(path);
      });
   };

   const handleLogout = () => {
      showConfirm('ต้องการออกจากระบบหรือไม่?', 'คุณสามารถเข้าสู่ระบบกลับมาได้ตลอดเวลา', 'ออกจากระบบ', 'ยกเลิก', true).then((result) => {
         if (result.isConfirmed) {
            trackEvent('user_logout', { userId: user?.id });
            logout();
            onClose();
            showSuccess('ออกจากระบบเรียบร้อย', 'แล้วพบกันใหม่ที่ BookLoop');
            navigate('/');
         }
      });
   };

   const isCurrentPage = (path: string) => {
      if (path === '/') return location.pathname === '/';
      if (path === '/wishlist') {
         return location.pathname === '/account/wishlist' || location.search.includes('favorite=true');
      }
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
   };

   return (
      <Drawer
         anchor="right"
         variant="temporary"
         open={open}
         onClose={onClose}
         ModalProps={{
            keepMounted: true, // Optimized mobile performance
            disableEnforceFocus: true, // Allow SweetAlert2 on topmost layer without focus trap contention
            disableScrollLock: true,
         }}
         transitionDuration={{ enter: 200, exit: 180 }}
         slotProps={{
            backdrop: {
               sx: {
                  backgroundColor: 'rgba(15, 23, 42, 0.48)',
                  willChange: 'opacity',
               },
            },
         }}
         sx={{
            display: { xs: 'block', md: 'none' },
            zIndex: (theme) => theme.zIndex.drawer + 20,
            '& .MuiDrawer-paper': {
               boxSizing: 'border-box',
               position: 'fixed',
               top: 0,
               right: 0,
               bottom: 0,
               left: 'auto !important',
               width: { xs: '82vw', sm: 350 },
               maxWidth: { xs: '85vw', sm: 360 },
               minWidth: { xs: '78vw', sm: 320 },
               height: '100vh',
               bgcolor: '#FFFFFF',
               color: '#0F2D4A',
               borderLeft: '1px solid #E8EDF3',
               borderRight: 'none',
               borderRadius: '20px 0 0 20px',
               boxShadow: '-8px 0 30px rgba(15, 23, 42, 0.12)',
               display: 'flex',
               flexDirection: 'column',
               overflow: 'hidden',
               willChange: 'transform',
               WebkitBackfaceVisibility: 'hidden',
               backfaceVisibility: 'hidden',
               transform: 'translate3d(0, 0, 0)',
            },
         }}>
         {/* Subtle Blue Ring ambient corner decoration */}
         <Box
            aria-hidden="true"
            sx={{
               position: 'absolute',
               bottom: -45,
               right: -45,
               width: 150,
               height: 150,
               borderRadius: '50%',
               border: '1.5px solid rgba(25, 118, 210, 0.06)',
               pointerEvents: 'none',
            }}
         />
         <Box
            aria-hidden="true"
            sx={{
               position: 'absolute',
               bottom: -65,
               right: -65,
               width: 190,
               height: 190,
               borderRadius: '50%',
               border: '1px solid rgba(25, 118, 210, 0.03)',
               pointerEvents: 'none',
            }}
         />

         {/* ---------------------------------------------------- */}
         {/* HEADER (60px) — Clean Logo + Close Button            */}
         {/* ---------------------------------------------------- */}
         <Box
            component="header"
            sx={{
               height: 60,
               minHeight: 60,
               px: 2.25,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               borderBottom: '1px solid #E8EDF3',
               bgcolor: '#FFFFFF',
               zIndex: 1,
            }}>
            <Box
               component="button"
               onClick={() => handleNavigate('/')}
               aria-label="BookLoop หน้าแรก"
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  p: 0,
                  textAlign: 'left',
               }}>
               <Box
                  component="img"
                  src={`${import.meta.env.BASE_URL}images/logo.webp`}
                  alt="BookLoop Logo"
                  sx={{
                     width: 28,
                     height: 28,
                     borderRadius: '6px',
                     objectFit: 'contain',
                     flexShrink: 0,
                  }}
               />
               <Typography
                  component="span"
                  sx={{
                     fontFamily: tokens.typography.fontFamily,
                     fontWeight: 800,
                     fontSize: '1.05rem',
                     letterSpacing: '-0.02em',
                     color: '#0F2D4A',
                  }}>
                  BookLoop
               </Typography>
            </Box>

            <IconButton
               autoFocus
               onClick={onClose}
               aria-label="ปิดเมนู"
               sx={{
                  width: 40,
                  height: 40,
                  color: '#0F2D4A',
                  borderRadius: '8px',
                  '&:hover': {
                     bgcolor: '#F5F7FA',
                  },
                  '&:focus-visible': {
                     outline: '2px solid #1976D2',
                     outlineOffset: '2px',
                  },
               }}>
               <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
         </Box>

         {/* ---------------------------------------------------- */}
         {/* SCROLLABLE BODY CONTENT                              */}
         {/* ---------------------------------------------------- */}
         <Box
            sx={{
               flex: 1,
               overflowY: 'auto',
               overflowX: 'hidden',
               px: 2.25,
               pt: 2,
               pb: 'max(20px, env(safe-area-inset-bottom, 20px))',
               display: 'flex',
               flexDirection: 'column',
               zIndex: 1,
            }}>
            {/* -------------------------------------------------- */}
            {/* 1. PROFILE AREA                                    */}
            {/* -------------------------------------------------- */}
            {isLoading ? (
               <Box
                  sx={{
                     p: 1.5,
                     borderRadius: '12px',
                     bgcolor: '#EAF4FF',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     minHeight: 58,
                     mb: 1.75,
                  }}>
                  <CircularProgress size={20} sx={{ color: '#1976D2' }} />
               </Box>
            ) : isAuthenticated && user ? (
               <Box
                  component={ButtonBase}
                  onClick={() => handleNavigate('/account/profile')}
                  aria-label="ดูโปรไฟล์บัญชีของคุณ"
                  sx={{
                     width: '100%',
                     p: 1.5,
                     mb: 1.75,
                     borderRadius: '12px',
                     bgcolor: '#EAF4FF',
                     display: 'flex',
                     alignItems: 'center',
                     gap: 1.5,
                     textAlign: 'left',
                     position: 'relative',
                     overflow: 'hidden',
                     transition: 'background-color 160ms ease',
                     border: 'none',
                     outline: 'none',
                     '&:hover': {
                        bgcolor: '#E2EFFF',
                     },
                  }}>
                  {/* Subtle Blue Ring decorative concentric geometry */}
                  <Box
                     aria-hidden="true"
                     sx={{
                        position: 'absolute',
                        right: -20,
                        top: -20,
                        width: 84,
                        height: 84,
                        borderRadius: '50%',
                        border: '1.5px solid rgba(25, 118, 210, 0.14)',
                        pointerEvents: 'none',
                     }}
                  />
                  <Box
                     aria-hidden="true"
                     sx={{
                        position: 'absolute',
                        right: -36,
                        top: -36,
                        width: 116,
                        height: 116,
                        borderRadius: '50%',
                        border: '1px solid rgba(25, 118, 210, 0.07)',
                        pointerEvents: 'none',
                     }}
                  />

                  {/* Circular Dark Navy Avatar with White Letter */}
                  <Box sx={{ position: 'relative', flexShrink: 0 }}>
                     <Avatar
                        src={user.avatar}
                        alt={user.name || user.email}
                        sx={{
                           width: 42,
                           height: 42,
                           bgcolor: '#0F2D4A',
                           color: '#FFFFFF',
                           fontSize: '0.95rem',
                           fontWeight: 700,
                           boxShadow: '0 2px 8px rgba(15, 45, 74, 0.12)',
                        }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'W'}
                     </Avatar>
                     {/* Subtle concentric blue ring around avatar */}
                     <Box
                        aria-hidden="true"
                        sx={{
                           position: 'absolute',
                           inset: -3,
                           borderRadius: '50%',
                           border: '1.5px solid rgba(25, 118, 210, 0.28)',
                           pointerEvents: 'none',
                        }}
                     />
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1, zIndex: 1 }}>
                     <Typography
                        noWrap
                        sx={{
                           fontFamily: tokens.typography.fontFamily,
                           fontSize: '0.875rem',
                           fontWeight: 700,
                           color: '#0F2D4A',
                           lineHeight: 1.25,
                        }}>
                        {user.name || user.email}
                     </Typography>
                     <Typography
                        noWrap
                        sx={{
                           fontFamily: tokens.typography.fontFamily,
                           fontSize: '0.75rem',
                           color: '#64748B',
                           lineHeight: 1.3,
                           mt: 0.25,
                        }}>
                        {user.email || 'สมาชิก BookLoop'}
                     </Typography>
                  </Box>
               </Box>
            ) : (
               <Box
                  sx={{
                     p: 1.5,
                     mb: 1.75,
                     borderRadius: '12px',
                     bgcolor: '#EAF4FF',
                     display: 'flex',
                     flexDirection: 'column',
                     gap: 1.25,
                     position: 'relative',
                     overflow: 'hidden',
                  }}>
                  {/* Subtle Blue Ring in background */}
                  <Box
                     aria-hidden="true"
                     sx={{
                        position: 'absolute',
                        right: -20,
                        top: -20,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        border: '1.5px solid rgba(25, 118, 210, 0.14)',
                        pointerEvents: 'none',
                     }}
                  />
                  <Typography
                     sx={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#0F2D4A',
                        lineHeight: 1.3,
                     }}>
                     ยินดีต้อนรับสู่ BookLoop
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                     <ButtonBase
                        onClick={() => handleNavigate('/login')}
                        sx={{
                           height: 38,
                           borderRadius: '8px',
                           bgcolor: '#0F2D4A',
                           color: '#FFFFFF',
                           fontSize: '0.8125rem',
                           fontWeight: 600,
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           gap: 0.5,
                           transition: 'opacity 160ms ease',
                           '&:hover': { opacity: 0.92 },
                        }}>
                        <LoginIcon sx={{ fontSize: 16 }} />
                        เข้าสู่ระบบ
                     </ButtonBase>
                     <ButtonBase
                        onClick={() => handleNavigate('/register')}
                        sx={{
                           height: 38,
                           borderRadius: '8px',
                           bgcolor: '#FFFFFF',
                           color: '#1976D2',
                           border: '1px solid rgba(25, 118, 210, 0.25)',
                           fontSize: '0.8125rem',
                           fontWeight: 600,
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           gap: 0.5,
                           transition: 'all 160ms ease',
                           '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' },
                        }}>
                        <RegisterIcon sx={{ fontSize: 16 }} />
                        สมัครสมาชิก
                     </ButtonBase>
                  </Box>
               </Box>
            )}

            {/* -------------------------------------------------- */}
            {/* 2. SEARCH FIELD (42px) with Ctrl K pill             */}
            {/* -------------------------------------------------- */}
            <Box
               component="form"
               onSubmit={onSearchSubmit}
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 42,
                  px: 1.5,
                  mb: 2,
                  borderRadius: '10px',
                  bgcolor: '#F5F7FA',
                  border: '1px solid transparent',
                  transition: 'all 160ms ease',
                  '&:focus-within': {
                     bgcolor: '#FFFFFF',
                     border: '1px solid rgba(25, 118, 210, 0.35)',
                     boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.08)',
                  },
               }}>
               <SearchIcon
                  sx={{
                     fontSize: 18,
                     color: '#64748B',
                     mr: 1,
                     flexShrink: 0,
                  }}
               />
               <InputBase
                  id="mobile-drawer-search-input"
                  name="search"
                  placeholder="ค้นหาชื่อหนังสือ..."
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  inputProps={{
                     'aria-label': 'ค้นหาชื่อหนังสือ',
                     id: 'mobile-drawer-search-input',
                     name: 'search',
                  }}
                  sx={{
                     flex: 1,
                     fontFamily: tokens.typography.fontFamily,
                     fontSize: '0.875rem',
                     color: '#0F2D4A',
                     '& .MuiInputBase-input': {
                        p: 0,
                        '&::placeholder': {
                           color: '#94A3B8',
                           opacity: 1,
                        },
                     },
                  }}
               />
               <Box
                  aria-hidden="true"
                  sx={{
                     px: 0.75,
                     py: 0.25,
                     borderRadius: '4px',
                     bgcolor: '#FFFFFF',
                     border: '1px solid #E2E8F0',
                     color: '#94A3B8',
                     fontSize: '0.6875rem',
                     fontWeight: 600,
                     letterSpacing: '0.02em',
                     flexShrink: 0,
                     userSelect: 'none',
                  }}>
                  Ctrl K
               </Box>
            </Box>

            {/* -------------------------------------------------- */}
            {/* 3. MAIN NAVIGATION (Blue Ring Active Surface)      */}
            {/* -------------------------------------------------- */}
            <Box component="nav" aria-label="เมนูหลักใน Drawer" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
               {MAIN_NAV_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  const active = isCurrentPage(item.path);

                  return (
                     <ButtonBase
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        onTouchStart={() => prefetchRoute(item.path)}
                        onMouseEnter={() => prefetchRoute(item.path)}
                        aria-current={active ? 'page' : undefined}
                        sx={{
                           height: 44,
                           minHeight: 44,
                           width: '100%',
                           px: 1.5,
                           borderRadius: '10px',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'space-between',
                           textAlign: 'left',
                           bgcolor: active ? '#EAF4FF' : 'transparent',
                           color: active ? '#1976D2' : '#0F2D4A',
                           border: 'none',
                           outline: 'none',
                           transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                           '&:hover': {
                              bgcolor: active ? '#EAF4FF' : '#F8FAFC',
                           },
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                           {/* Blue circular ring icon for active item */}
                           <Box
                              sx={{
                                 width: 28,
                                 height: 28,
                                 borderRadius: '50%',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 border: active ? '1.5px solid #1976D2' : '1.5px solid transparent',
                                 bgcolor: active ? '#FFFFFF' : 'transparent',
                                 color: active ? '#1976D2' : '#64748B',
                                 boxShadow: active ? '0 1px 4px rgba(25, 118, 210, 0.15)' : 'none',
                                 transition: 'all 160ms ease',
                                 flexShrink: 0,
                              }}>
                              <IconComponent sx={{ fontSize: 18 }} />
                           </Box>
                           <Typography
                              component="span"
                              sx={{
                                 fontFamily: tokens.typography.fontFamily,
                                 fontSize: '0.9rem',
                                 fontWeight: active ? 600 : 500,
                                 color: 'inherit',
                                 letterSpacing: '-0.01em',
                              }}>
                              {item.label}
                           </Typography>
                        </Box>

                        {/* Subtle Right Arrow */}
                        <ChevronRightIcon
                           sx={{
                              fontSize: 18,
                              color: active ? '#1976D2' : '#CBD5E1',
                              flexShrink: 0,
                              transition: 'transform 160ms ease',
                           }}
                        />
                     </ButtonBase>
                  );
               })}
            </Box>

            {/* -------------------------------------------------- */}
            {/* 4. SECTION DIVIDER (#E8EDF3)                       */}
            {/* -------------------------------------------------- */}
            <Box
               sx={{
                  height: '1px',
                  bgcolor: '#E8EDF3',
                  my: 2,
                  width: '100%',
               }}
            />

            {/* -------------------------------------------------- */}
            {/* 5. ACCOUNT SECTION                                 */}
            {/* -------------------------------------------------- */}
            {isAuthenticated && (
               <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                     component="span"
                     sx={{
                        px: 1.5,
                        pb: 1,
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: '#94A3B8',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                     }}>
                     จัดการบัญชีของคุณ
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                     {ACCOUNT_MENU_ITEMS.map((item) => {
                        const IconComponent = item.icon;
                        const active = location.pathname === item.path;

                        return (
                           <ButtonBase
                              key={item.path}
                              onClick={() => handleNavigate(item.path)}
                              onTouchStart={() => prefetchRoute(item.path)}
                              onMouseEnter={() => prefetchRoute(item.path)}
                              aria-current={active ? 'page' : undefined}
                              sx={{
                                 height: 42,
                                 minHeight: 42,
                                 width: '100%',
                                 px: 1.5,
                                 borderRadius: '8px',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 textAlign: 'left',
                                 bgcolor: active ? '#F0F7FF' : 'transparent',
                                 color: active ? '#1976D2' : '#0F2D4A',
                                 border: 'none',
                                 outline: 'none',
                                 transition: 'all 160ms ease',
                                 '&:hover': {
                                    bgcolor: active ? '#F0F7FF' : '#F8FAFC',
                                 },
                              }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                 <IconComponent
                                    sx={{
                                       fontSize: 20,
                                       color: active ? '#1976D2' : '#64748B',
                                       flexShrink: 0,
                                    }}
                                 />
                                 <Typography
                                    component="span"
                                    sx={{
                                       fontFamily: tokens.typography.fontFamily,
                                       fontSize: '0.875rem',
                                       fontWeight: active ? 600 : 500,
                                       color: 'inherit',
                                    }}>
                                    {item.label}
                                 </Typography>
                              </Box>

                              <ChevronRightIcon
                                 sx={{
                                    fontSize: 18,
                                    color: active ? '#1976D2' : '#CBD5E1',
                                    flexShrink: 0,
                                 }}
                              />
                           </ButtonBase>
                        );
                     })}
                  </Box>
               </Box>
            )}

            {/* -------------------------------------------------- */}
            {/* 6. LOGOUT                                          */}
            {/* -------------------------------------------------- */}
            {isAuthenticated && (
               <Box sx={{ mt: 2.5, pt: 1, pb: 1.5 }}>
                  <ButtonBase
                     onClick={handleLogout}
                     aria-label="ออกจากระบบ"
                     sx={{
                        height: 44,
                        minHeight: 44,
                        width: '100%',
                        px: 1.5,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 1.5,
                        bgcolor: '#FEF2F2',
                        color: '#DC2626',
                        border: 'none',
                        outline: 'none',
                        transition: 'all 160ms ease',
                        '&:hover': {
                           bgcolor: '#FEE2E2',
                        },
                        '&:active': {
                           bgcolor: '#FECACA',
                        },
                     }}>
                     <LogoutIcon
                        sx={{
                           fontSize: 20,
                           color: '#DC2626',
                           flexShrink: 0,
                        }}
                     />
                     <Typography
                        component="span"
                        sx={{
                           fontFamily: tokens.typography.fontFamily,
                           fontSize: '0.875rem',
                           fontWeight: 600,
                           color: '#DC2626',
                        }}>
                        ออกจากระบบ
                     </Typography>
                  </ButtonBase>
               </Box>
            )}
         </Box>
      </Drawer>
   );
};

import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { HomeOutlined as HomeIcon, SearchOutlined as SearchIcon, AddRounded as SellIcon, ShoppingCartOutlined as CartIcon, PersonOutlineRounded as AccountIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { tokens } from '../../theme/tokens';

interface NavItemConfig {
   label: string;
   path: string;
   icon: React.ComponentType<{ sx?: any }>;
   isAction?: boolean;
}

const NAV_ITEMS: readonly NavItemConfig[] = [
   { label: 'หน้าแรก', path: '/', icon: HomeIcon },
   { label: 'ค้นหา', path: '/books', icon: SearchIcon },
   { label: 'ขาย', path: '/sell', icon: SellIcon, isAction: true },
   { label: 'ตะกร้า', path: '/cart', icon: CartIcon },
   { label: 'บัญชี', path: '/account', icon: AccountIcon },
] as const;

/**
 * AppNavMobilebar / MobileBottomNav
 *
 * Swiss International Typographic Style:
 * - Strict 5-column grid system
 * - Clean geometric layout and baseline alignment
 * - Minimalist functional indicators (no heavy shadows, no glassmorphism, no bloated pills)
 * - 44px+ touch targets, 64px content height + edge-to-edge safe-area padding
 * - Active state highlighted with BookLoop Blue (#0F6CF0) and top geometric indicator
 * - Edge-to-edge: background extends to the physical bottom edge so the
 *   OS Home Indicator never overlaps labels/icons.
 */
const AppNavMobilebar: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { cartCount } = useCart();
   const { isAuthenticated } = useAuth();

   const isItemActive = (path: string) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname.startsWith(path);
   };

   const handleItemClick = (path: string) => {
      if (path === '/account' && !isAuthenticated) {
         navigate('/login');
      } else {
         navigate(path);
      }
   };

   return (
      <Box
         component="nav"
         aria-label="เมนูหลักบนมือถือ (AppNavMobilebar)"
         sx={{
            display: { xs: 'grid', md: 'none' },
            gridTemplateColumns: 'repeat(5, 1fr)',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.appBar + 50,
            minHeight: '50px',
            bgcolor: '#FFFFFF',
            borderTop: '1px solid #E5EAF0',
            boxShadow: '0 -1px 3px rgba(16, 42, 67, 0.03)',
            // Edge-to-edge smartphones: 8px base lift + dynamic OS inset.
            // max() pushes items above the Home Indicator while the solid
            // background (incl. padding box) extends to the physical bottom edge.
            paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
            paddingTop: '4px',
            boxSizing: 'border-box',
            userSelect: 'none',
            // Ensure no gap below the bar on iOS rubber-banding / transparent nav bars.
            '&::after': {
               content: '""',
               position: 'absolute',
               top: '100%',
               left: 0,
               right: 0,
               height: 'env(safe-area-inset-bottom, 0px)',
               bgcolor: '#FFFFFF',
            },
         }}>
         {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const active = isItemActive(item.path);
            const isSell = item.isAction;

            return (
               <ButtonBase
                  key={item.path}
                  onClick={() => handleItemClick(item.path)}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     justifyContent: 'center',
                     minHeight: '48px',
                     minWidth: '40px',
                     height: '100%',
                     width: '100%',
                     position: 'relative',
                     p: 0,
                     py: '2px',
                     gap: '2px',
                     color: active ? '#1976D2' : '#718096',
                     transition: 'color 160ms cubic-bezier(0.16, 1, 0.3, 1), background-color 160ms ease',
                     '&:hover': {
                        bgcolor: 'rgba(16, 42, 67, 0.02)',
                     },
                     '&:active': {
                        bgcolor: 'rgba(16, 42, 67, 0.05)',
                     },
                     '&:focus-visible': {
                        outline: '2px solid rgba(25, 118, 210, 0.3)',
                        outlineOffset: '2px',
                     },
                  }}>
                  {/* Blue Ring Top Indicator for Active Item */}
                  {active && (
                     <Box
                        aria-hidden="true"
                        sx={{
                           position: 'absolute',
                           top: 0,
                           left: '50%',
                           transform: 'translateX(-50%)',
                           width: '20px',
                           height: '2px',
                           bgcolor: '#1976D2',
                           borderRadius: '0 0 2px 2px',
                        }}
                     />
                  )}

                  {/* Icon Container with Badge */}
                  <Box
                     sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                     }}>
                     {isSell ? (
                        // Sell action receives circular plus icon
                        <Box
                           sx={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1.5px solid ${active ? '#1976D2' : '#102A43'}`,
                              bgcolor: active ? '#EAF4FF' : 'transparent',
                              color: active ? '#1976D2' : '#102A43',
                              transition: 'all 160ms ease',
                           }}>
                           <IconComponent sx={{ fontSize: 15 }} />
                        </Box>
                     ) : (
                        <IconComponent
                           sx={{
                              fontSize: 18,
                              strokeWidth: active ? 0.4 : 0,
                              stroke: 'currentColor',
                              transition: 'transform 160ms ease',
                           }}
                        />
                     )}

                     {/* Minimalist Cart Badge */}
                     {item.path === '/cart' && cartCount > 0 && (
                        <Box
                           aria-label={`${cartCount} รายการในตะกร้า`}
                           sx={{
                              position: 'absolute',
                              top: -2,
                              right: -6,
                              minWidth: '13px',
                              height: '13px',
                              borderRadius: '7px',
                              bgcolor: '#1976D2',
                              color: '#FFFFFF',
                              fontSize: '8px',
                              fontWeight: 700,
                              lineHeight: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              px: 0.3,
                              border: '1.5px solid #FFFFFF',
                              boxSizing: 'border-box',
                           }}>
                           {cartCount > 99 ? '99+' : cartCount}
                        </Box>
                     )}
                  </Box>

                  {/* Thai Label */}
                  <Typography
                     component="span"
                     sx={{
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: '9.5px',
                        fontWeight: active ? 700 : 500,
                        lineHeight: 1.15,
                        color: active ? '#1976D2' : isSell ? '#102A43' : '#718096',
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        transition: 'color 160ms ease',
                     }}>
                     {item.label}
                  </Typography>
               </ButtonBase>
            );
         })}
      </Box>
   );
};

export const MobileBottomNav = AppNavMobilebar;

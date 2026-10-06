import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { trackEvent } from '../utils/analytics';
import { Header } from '../components/layout/Header';
import { AppMobileDrawer } from '../components/layout/AppMobileDrawer';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/common/ScrollToTop';

export const AppLayout: React.FC = () => {
   const { cartCount } = useCart();
   const { wishlist } = useWishlist();
   const navigate = useNavigate();
   const location = useLocation();
   const isHomePage = location.pathname === '/';
   const [mobileOpen, setMobileOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
   }, [location.pathname, location.search]);

   const handleDrawerToggle = () => {
      setMobileOpen((prev) => !prev);
   };

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
         trackEvent('search_book', { query: searchQuery.trim() });
         navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
         setMobileOpen(false);
      }
   };

   return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
         <Header cartCount={cartCount} wishlistCount={wishlist.length} onOpenMobileMenu={handleDrawerToggle} />

         <AppMobileDrawer open={mobileOpen} onClose={handleDrawerToggle} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} onSearchSubmit={handleSearch} />

         <Box
            component="main"
            sx={{
               flexGrow: 1,
               display: 'flex',
               flexDirection: 'column',
               pt: isHomePage ? 0 : { xs: '64px', sm: '68px', md: '72px' },
            }}>
            <Outlet />
         </Box>

         <Footer />

         {/* Mobile Bottom Navigation */}
         <MobileBottomNav />

         <ScrollToTop />

         {/* Spacer for mobile bottom nav (content 50px + top 4px + bottom safe-area 8px+) */}
         <Box sx={{ display: { xs: 'block', md: 'none' }, height: 'calc(50px + 4px + max(8px, env(safe-area-inset-bottom, 8px)))', flexShrink: 0 }} />
      </Box>
   );
};

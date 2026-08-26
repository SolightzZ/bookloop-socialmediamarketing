import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { trackEvent } from '../utils/analytics';
import { AppNavbar } from '../components/layout/AppNavbar';
import { AppMobileDrawer } from '../components/layout/AppMobileDrawer';
import { AppFooter } from '../components/layout/AppFooter';

export const AppLayout: React.FC = () => {
   const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
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
         <AppNavbar
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={handleSearch}
            onOpenMobileMenu={handleDrawerToggle}
         />

         <AppMobileDrawer open={mobileOpen} onClose={handleDrawerToggle} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} onSearchSubmit={handleSearch} />

         <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Outlet />
         </Box>

         <AppFooter />
      </Box>
   );
};

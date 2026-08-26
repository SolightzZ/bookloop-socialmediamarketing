import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../theme';
import { CartProvider } from '../hooks/useCart';
import { WishlistProvider } from '../hooks/useWishlist';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
         </CartProvider>
      </ThemeProvider>
   );
};

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../theme';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../hooks/useCart';
import { WishlistProvider } from '../hooks/useWishlist';
import { NotificationProvider } from '../context/NotificationContext';
import { RecentlyViewedProvider } from '../context/RecentlyViewedContext';
import { PriceAlertProvider } from '../context/PriceAlertContext';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return (
      <ErrorBoundary>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
               <CartProvider>
                  <WishlistProvider>
                     <NotificationProvider>
                        <RecentlyViewedProvider>
                           <PriceAlertProvider>{children}</PriceAlertProvider>
                        </RecentlyViewedProvider>
                     </NotificationProvider>
                  </WishlistProvider>
               </CartProvider>
            </AuthProvider>
         </ThemeProvider>
      </ErrorBoundary>
   );
};


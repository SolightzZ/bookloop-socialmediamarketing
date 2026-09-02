import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import HomePage from '../pages/HomePage';
import BooksPage from '../pages/BooksPage';
import BookDetailPage from '../pages/BookDetailPage';
import SellPage from '../pages/SellPage';
import AboutPage from '../pages/AboutPage';
import CampaignPage from '../pages/CampaignPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import AccountPage from '../pages/AccountPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { AppProviders } from './providers';

const githubPagesBasePath = '/bookloop-socialmediamarketing';
const basename =
   window.location.pathname === githubPagesBasePath ||
   window.location.pathname.startsWith(`${githubPagesBasePath}/`)
      ? githubPagesBasePath
      : '/';

const router = createBrowserRouter([
   {
      path: '/',
      element: <AppLayout />,
      children: [
         { index: true, element: <HomePage /> },
         { path: 'books', element: <BooksPage /> },
         { path: 'books/:id', element: <BookDetailPage /> },
         { path: 'sell', element: <SellPage /> },
         { path: 'about', element: <AboutPage /> },
         { path: 'campaign/read-share-repeat', element: <CampaignPage /> },
         { path: 'cart', element: <CartPage /> },
         { path: 'checkout', element: <CheckoutPage /> },
         { path: 'order/success', element: <OrderSuccessPage /> },
         { path: 'orders/:orderId', element: <OrderDetailPage /> },
         { path: 'login', element: <LoginPage /> },
         { path: 'register', element: <RegisterPage /> },
         { path: 'forgot-password', element: <ForgotPasswordPage /> },
         { path: 'reset-password', element: <ResetPasswordPage /> },
         {
            path: 'account',
            element: (
               <ProtectedRoute>
                  <AccountPage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/profile',
            element: (
               <ProtectedRoute>
                  <AccountPage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/orders',
            element: (
               <ProtectedRoute>
                  <AccountPage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/orders/:orderId',
            element: <OrderDetailPage />,
         },
         {
            path: 'account/wishlist',
            element: (
               <ProtectedRoute>
                  <AccountPage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/books',
            element: (
               <ProtectedRoute>
                  <AccountPage />
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/settings',
            element: (
               <ProtectedRoute>
                  <AccountPage />
               </ProtectedRoute>
            ),
         },
      ],
   },
], { basename });

export const AppRouter = () => {
   return (
      <AppProviders>
         <RouterProvider router={router} />
      </AppProviders>
   );
};


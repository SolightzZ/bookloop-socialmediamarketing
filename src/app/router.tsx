import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { RequireAuth } from '../components/auth/RequireAuth';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { AppProviders } from './providers';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { PageLoadingSkeleton } from '../components/common/LoadingSkeleton';

const HomePage = lazy(() => import('../pages/HomePage'));
const BooksPage = lazy(() => import('../pages/BooksPage'));
const BookDetailPage = lazy(() => import('../pages/BookDetailPage'));
const SellPage = lazy(() => import('../pages/SellPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage'));
const OrderDetailPage = lazy(() => import('../pages/OrderDetailPage'));
const SellerProfilePage = lazy(() => import('../pages/SellerProfilePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
   <Suspense fallback={<PageLoadingSkeleton />}>
      <Component />
   </Suspense>
);

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
      errorElement: <ErrorBoundary />,
      children: [
         { index: true, element: withSuspense(HomePage) },
         { path: 'books', element: withSuspense(BooksPage) },
         { path: 'books/:id', element: withSuspense(BookDetailPage) },
         { path: 'seller/:sellerId', element: withSuspense(SellerProfilePage) },
         { path: 'sell', element: withSuspense(SellPage) },
         { path: 'cart', element: withSuspense(CartPage) },
         {
            path: 'checkout',
            element: (
               <RequireAuth>
                  {withSuspense(CheckoutPage)}
               </RequireAuth>
            ),
         },
         {
            path: 'order/success',
            element: (
               <RequireAuth>
                  {withSuspense(OrderSuccessPage)}
               </RequireAuth>
            ),
         },
         {
            path: 'orders/:orderId',
            element: (
               <RequireAuth>
                  {withSuspense(OrderDetailPage)}
               </RequireAuth>
            ),
         },
         { path: 'login', element: withSuspense(LoginPage) },
         { path: 'register', element: withSuspense(RegisterPage) },
         { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
         { path: 'reset-password', element: withSuspense(ResetPasswordPage) },
         {
            path: 'account',
            element: (
               <ProtectedRoute>
                  {withSuspense(AccountPage)}
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/profile',
            element: (
               <ProtectedRoute>
                  {withSuspense(AccountPage)}
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/orders',
            element: (
               <ProtectedRoute>
                  {withSuspense(AccountPage)}
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/orders/:orderId',
            element: withSuspense(OrderDetailPage),
         },
         {
            path: 'account/wishlist',
            element: (
               <ProtectedRoute>
                  {withSuspense(AccountPage)}
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/books',
            element: (
               <ProtectedRoute>
                  {withSuspense(AccountPage)}
               </ProtectedRoute>
            ),
         },
         {
            path: 'account/settings',
            element: (
               <ProtectedRoute>
                  {withSuspense(AccountPage)}
               </ProtectedRoute>
            ),
         },
         { path: '*', element: withSuspense(NotFoundPage) },
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


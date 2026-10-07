import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
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
const OnboardingPage = lazy(() => import('../pages/OnboardingPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage'));
const OrderDetailPage = lazy(() => import('../pages/OrderDetailPage'));
const SellerProfilePage = lazy(() => import('../pages/SellerProfilePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const HelpPage = lazy(() => import('../pages/HelpPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
   <Suspense fallback={<PageLoadingSkeleton />}>
      <Component />
   </Suspense>
);

// basename ตาม base ตอน build (vite แทนค่า import.meta.env.BASE_URL ให้เอง):
// - dev (base '/') → '/'
// - GitHub Pages (base '/bookloop-socialmediamarketing/') → '/bookloop-socialmediamarketing'
// - InfinityFree same-origin (build:app, base '/app/') → '/app'
// เปลี่ยนชื่อ repo/path ทีหลังไม่ต้องมาแก้ไฟล์นี้ แค่แก้ base ใน vite.config.ts หรือ --base ตอน build
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

const router = createBrowserRouter([
   {
      path: '/',
      element: <AppLayout />,
      errorElement: <ErrorBoundary />,
      children: [
         { index: true, element: withSuspense(HomePage) },
         { path: 'books', element: withSuspense(BooksPage) },
         { path: 'wishlist', element: <Navigate to="/books?favorite=true" replace /> },
         { path: 'books/:id', element: withSuspense(BookDetailPage) },
         { path: 'seller/:sellerId', element: withSuspense(SellerProfilePage) },
         { path: 'sell', element: withSuspense(SellPage) },
         { path: 'cart', element: withSuspense(CartPage) },
         { path: 'about', element: withSuspense(AboutPage) },
         { path: 'help', element: withSuspense(HelpPage) },
         { path: 'faq', element: <Navigate to="/help" replace /> },
         { path: 'pricing', element: withSuspense(PricingPage) },
         { path: 'privacy', element: withSuspense(PrivacyPage) },
         { path: 'contact', element: withSuspense(ContactPage) },
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
         {
            path: 'onboarding',
            element: (
               <RequireAuth>
                  {withSuspense(OnboardingPage)}
               </RequireAuth>
            ),
         },
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
            element: (
               <ProtectedRoute>
                  {withSuspense(OrderDetailPage)}
               </ProtectedRoute>
            ),
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

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
import TechStackPage from '../pages/TechStackPage';
import { AppProviders } from './providers';

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
         { path: 'techstack', element: <TechStackPage /> },
         { path: 'tech-stack', element: <TechStackPage /> },
      ],
   },
]);

export const AppRouter = () => {
   return (
      <AppProviders>
         <RouterProvider router={router} />
      </AppProviders>
   );
};

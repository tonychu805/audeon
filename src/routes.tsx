import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { LibraryPage } from './pages/LibraryPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { CommunityDetailPage } from './pages/CommunityDetailPage';
import { TrackDetailPage } from './pages/TrackDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'explore',
        element: <ExplorePage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'creators/:creatorId',
        element: <CreatorProfilePage />,
      },
      {
        path: 'communities/:communityId',
        element: <CommunityDetailPage />,
      },
      {
        path: 'tracks/:trackId',
        element: <TrackDetailPage />,
      },
      {
        path: '*',
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);
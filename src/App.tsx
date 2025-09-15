import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { router } from './routes';

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PlayerProvider } from './context/PlayerContext';
import { router } from './routes';

function App() {
  return (
    <HelmetProvider>
      <PlayerProvider>
        <RouterProvider router={router} />
      </PlayerProvider>
    </HelmetProvider>
  );
}

export default App;
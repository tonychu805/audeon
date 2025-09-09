import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { router } from './routes';

function App() {
  return (
    <PlayerProvider>
      <RouterProvider router={router} />
    </PlayerProvider>
  );
}

export default App;
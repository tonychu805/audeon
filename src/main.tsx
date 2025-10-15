import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UmamiAnalytics } from './components/analytics/UmamiAnalytics';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UmamiAnalytics />
    <App />
  </StrictMode>
);

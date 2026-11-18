import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast.js';
import { AppRoutes } from './routes/AppRoutes.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;

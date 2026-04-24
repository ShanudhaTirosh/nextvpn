import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/globals.css';
import './styles/components.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/Toast';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

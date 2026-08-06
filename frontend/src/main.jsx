import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SearchProvider } from '@/context/SearchContext';
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);


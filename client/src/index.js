import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { LoaderProvider } from './context/LoaderContext';
import { AuthProvider } from './context/userAuth';
import '@mui/material/styles';   


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <LoaderProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoaderProvider>
  </BrowserRouter>
);


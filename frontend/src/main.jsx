import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="394053838870-f22602veuj3fiqak2i3h0f8a0s3659m7.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
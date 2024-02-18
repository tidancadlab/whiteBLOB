import React from 'react';
import ReactDOM from 'react-dom/client';
import './output.css';
import App from './App';
import Auth from './auth/auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth>
      <App />
    </Auth>
  </React.StrictMode>
);

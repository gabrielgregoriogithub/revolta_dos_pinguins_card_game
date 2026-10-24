import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(() => {
      // A aplicação continua funcional mesmo quando o ambiente não oferece SW.
    });
  });
}

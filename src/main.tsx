import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import '@fontsource/cinzel/latin-700.css';
import '@fontsource/cinzel/latin-900.css';
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-900.css';
import './styles.css';
import './visual-refresh.css';
import './campaign-worlds.css';
import './equipment-ui.css';
import './dragdrop-ui.css';
import './card-reference.css';
import './status-ui.css';
import './card-layout.css';
import './combat-fx.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(() => {
      // A aplicação continua funcional mesmo quando o ambiente não oferece SW.
    });
  });
}

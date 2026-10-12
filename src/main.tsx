import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import '@/index.css';
import '@/i18n';
import { App } from '@/app/App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root not found in document');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Suppress console logs in production only
if (import.meta.env.PROD) {
  console.log = () => { };
  console.warn = () => { };
  console.error = () => { };
  console.info = () => { };
  console.debug = () => { };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

import { ErrorBoundary } from './components/ErrorBoundary';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

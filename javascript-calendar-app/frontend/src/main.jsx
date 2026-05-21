/**
 * Application Entry Point
 *
 * This is the main entry point for the React application.
 * It creates the root React element and renders the App component into the DOM.
 *
 * React.StrictMode is enabled to help identify potential problems in the application
 * during development by:
 * - Detecting unexpected side effects
 * - Warning about deprecated APIs
 * - Warning about legacy string ref API usage
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Create a root for the React application and render the App component
// The root element with id 'root' is defined in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

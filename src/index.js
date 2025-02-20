import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Import the global styles
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Creating root
root.render(
  <React.StrictMode>
    <App /> {/* No BrowserRouter here */}
  </React.StrictMode>
);
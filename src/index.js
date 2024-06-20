import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Global styles
import ShopContextProvider from './components/Context/ShopContext';

const container = document.getElementById('root');
const root = createRoot(container);


root.render(
  <React.StrictMode>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </React.StrictMode>
);

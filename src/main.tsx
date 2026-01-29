import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import CSS Global (Base styles, Typography, Reset)
// import './index.css';

// // Import CSS Spesifik App (Layouting, Component Styles)
// // Ditaruh setelah index.css agar bisa meng-override jika perlu
// import './App.css';

/**
 * Render aplikasi menggunakan React StrictMode 
 * untuk membantu mendeteksi potensi masalah pada kode.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
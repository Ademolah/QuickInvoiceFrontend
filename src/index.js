

// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App'
// import './index.css'
// import { CurrencyProvider } from './context/CurrencyContext'

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>

//     <CurrencyProvider>
//       <App />
//     </CurrencyProvider>
    
//   </React.StrictMode>
// )

import React from 'react'
import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { CurrencyProvider } from './context/CurrencyContext'
import { HelmetProvider } from 'react-helmet-async' // ✅ Added for SEO

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider> {/* ✅ Wraps the entire app for SEO management */}
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </HelmetProvider>
  </React.StrictMode>
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { applyTheme } from './lib/applyTheme.js'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'
import App from './App.jsx'

applyTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </HelmetProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarritoProvider } from './contexto/CarritoContexto.jsx';
import { ProductosProvider } from './contexto/ProductosContexto.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductosProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </ProductosProvider>
  </StrictMode>,
)

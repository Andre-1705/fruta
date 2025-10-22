import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarritoProvider } from './contexto/CarritoContexto.jsx';
import { AuthProvider } from './contexto/AuthContexto.jsx';
import { ProductosProvider } from './contexto/ProductosContexto.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductosProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </ProductosProvider>
    </AuthProvider>
  </StrictMode>,
)

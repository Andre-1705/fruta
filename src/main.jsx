import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarritoProvider } from './contexto/CarritoContexto.jsx';
import { AuthProvider } from './contexto/AuthContexto.jsx';
import { ProductosProvider } from './contexto/ProductosContexto.jsx';
import { ClientesProvider } from './contexto/ClientesContexto.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductosProvider>
        <ClientesProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </ClientesProvider>
      </ProductosProvider>
    </AuthProvider>
  </StrictMode>,
)

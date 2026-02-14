import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CarritoProvider } from '../../contexto/CarritoContexto';
import { AuthProvider } from '../../contexto/AuthContexto';
import { ProductosProvider } from '../../contexto/ProductosContexto';
import { PedidosProvider } from '../../contexto/PedidosContexto';
import { ClientesProvider } from '../../contexto/ClientesContexto';

/**
 * Renderiza un componente con todos los providers necesarios
 * @param {React.ReactElement} ui - Componente a renderizar
 * @param {Object} options - Opciones de renderizado
 * @param {boolean} options.withRouter - Incluir BrowserRouter
 * @param {boolean} options.withAuth - Incluir AuthProvider
 * @param {boolean} options.withCarrito - Incluir CarritoProvider
 * @param {boolean} options.withProductos - Incluir ProductosProvider
 * @param {boolean} options.withPedidos - Incluir PedidosProvider
 * @param {boolean} options.withClientes - Incluir ClientesProvider
 * @returns {Object} Objeto con utilidades de testing
 */
export function renderWithProviders(ui, options = {}) {
  const {
    withRouter = true,
    withAuth = true,
    withCarrito = true,
    withProductos = false,
    withPedidos = false,
    withClientes = false,
    ...renderOptions
  } = options;

  let Wrapper = ({ children }) => children;

  if (withRouter) {
    const RouterWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <BrowserRouter>
        <RouterWrapper>{children}</RouterWrapper>
      </BrowserRouter>
    );
  }

  if (withAuth) {
    const AuthWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <AuthProvider>
        <AuthWrapper>{children}</AuthWrapper>
      </AuthProvider>
    );
  }

  if (withProductos) {
    const ProductosWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <ProductosProvider>
        <ProductosWrapper>{children}</ProductosWrapper>
      </ProductosProvider>
    );
  }

  if (withCarrito) {
    const CarritoWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <CarritoProvider>
        <CarritoWrapper>{children}</CarritoWrapper>
      </CarritoProvider>
    );
  }

  if (withPedidos) {
    const PedidosWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <PedidosProvider>
        <PedidosWrapper>{children}</PedidosWrapper>
      </PedidosProvider>
    );
  }

  if (withClientes) {
    const ClientesWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <ClientesProvider>
        <ClientesWrapper>{children}</ClientesWrapper>
      </ClientesProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';

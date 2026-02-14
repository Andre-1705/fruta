import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MisPedidos from '../../pages/MisPedidos';
import { PedidosProvider } from '../../contexto/PedidosContexto';
import { AuthProvider } from '../../contexto/AuthContexto';

describe('MisPedidos', () => {
  it('debe renderizar la página de mis pedidos', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <PedidosProvider>
            <MisPedidos />
          </PedidosProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Mis Pedidos/i)).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkout from '../../pages/Checkout';
import { CarritoProvider } from '../../contexto/CarritoContexto';
import { AuthProvider } from '../../contexto/AuthContexto';
import { PedidosProvider } from '../../contexto/PedidosContexto';

describe('Checkout', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <PedidosProvider>
            <CarritoProvider>
              <Checkout />
            </CarritoProvider>
          </PedidosProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

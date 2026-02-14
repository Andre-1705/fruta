import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PedidoExito from '../../pages/PedidoExito';
import { PedidosProvider } from '../../contexto/PedidosContexto';

describe('PedidoExito', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <PedidosProvider>
          <PedidoExito />
        </PedidosProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

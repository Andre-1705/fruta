import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PedidosAdminPanel from '../../../componentes/adminComponents/PedidosAdminPanel';
import { PedidosProvider } from '../../../contexto/PedidosContexto';
import { AuthProvider } from '../../../contexto/AuthContexto';

describe('PedidosAdminPanel', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <AuthProvider>
        <PedidosProvider>
          <PedidosAdminPanel />
        </PedidosProvider>
      </AuthProvider>
    );
    expect(container).toBeTruthy();
  });
});

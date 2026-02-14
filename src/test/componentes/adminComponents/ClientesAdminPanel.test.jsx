import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClientesAdminPanel from '../../../componentes/adminComponents/ClientesAdminPanel';
import { ClientesProvider } from '../../../contexto/ClientesContexto';
import { AuthProvider } from '../../../contexto/AuthContexto';

describe('ClientesAdminPanel', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <ClientesProvider>
            <ClientesAdminPanel />
          </ClientesProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

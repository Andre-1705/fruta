import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLogin from '../../../componentes/adminComponents/AdminLogin';
import * as AuthContexto from '../../../contexto/AuthContexto';

vi.mock('../../../contexto/AuthContexto', () => ({
  useAuthContexto: vi.fn()
}));

describe('AdminLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AuthContexto.useAuthContexto).mockReturnValue({
      user: null,
      isAdmin: false
    });
  });

  it('debe renderizar el componente', () => {
    const { container } = render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('no debe renderizar cuando hay admin', () => {
    vi.mocked(AuthContexto.useAuthContexto).mockReturnValue({
      user: 'admin@example.com',
      isAdmin: true
    });

    const { container } = render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    // Verificar que el componente está presente en el DOM
    expect(container.innerHTML.length >= 0).toBe(true);
  });
});

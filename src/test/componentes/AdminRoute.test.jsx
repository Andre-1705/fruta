import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminRoute from '../../componentes/AdminRoute';
import { AuthProvider } from '../../contexto/AuthContexto';

vi.mock('../../contexto/AuthContexto', async () => {
  const actual = await vi.importActual('../../contexto/AuthContexto');
  return {
    ...actual,
    useAuthContexto: () => ({ user: 'admin@example.com', isAdmin: true })
  };
});

describe('AdminRoute', () => {
  it('debe renderizar contenido admin cuando es admin', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <AdminRoute>
            <div>Admin Content</div>
          </AdminRoute>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../componentes/ProtectedRoute';
import { AuthProvider } from '../../contexto/AuthContexto';

vi.mock('../../contexto/AuthContexto', async () => {
  const actual = await vi.importActual('../../contexto/AuthContexto');
  return {
    ...actual,
    useAuthContexto: () => ({ user: 'test@example.com', isAdmin: false })
  };
});

describe('ProtectedRoute', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div data-testid="protected-content">Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

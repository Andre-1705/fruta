import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InicioSesion from '../../pages/InicioSesion';
import { AuthProvider } from '../../contexto/AuthContexto';

vi.mock('../../contexto/AuthContexto', async () => {
  const actual = await vi.importActual('../../contexto/AuthContexto');
  return {
    ...actual
  };
});

describe('InicioSesion', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <InicioSesion />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

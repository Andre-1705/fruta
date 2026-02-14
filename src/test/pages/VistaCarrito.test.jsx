import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VistaCarrito from '../../pages/VistaCarrito';
import { CarritoProvider } from '../../contexto/CarritoContexto';
import { AuthProvider } from '../../contexto/AuthContexto';

vi.mock('../../contexto/CarritoContexto', async () => {
  const actual = await vi.importActual('../../contexto/CarritoContexto');
  return {
    ...actual
  };
});

vi.mock('../../contexto/AuthContexto', async () => {
  const actual = await vi.importActual('../../contexto/AuthContexto');
  return {
    ...actual
  };
});

describe('VistaCarrito', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <VistaCarrito />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

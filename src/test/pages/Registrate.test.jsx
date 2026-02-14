import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Registrate from '../../pages/Registrate';
import { AuthProvider } from '../../contexto/AuthContexto';

vi.mock('../../contexto/AuthContexto', async () => {
  const actual = await vi.importActual('../../contexto/AuthContexto');
  return {
    ...actual
  };
});

describe('Registrate', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <Registrate />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

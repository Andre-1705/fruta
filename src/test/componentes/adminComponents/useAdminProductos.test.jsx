import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAdminProductos } from '../../../componentes/adminComponents/useAdminProductos';
import { ProductosProvider } from '../../../contexto/ProductosContexto';

vi.mock('../../../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}));

vi.mock('../../../contexto/ProductosContexto', async () => {
  const actual = await vi.importActual('../../../contexto/ProductosContexto');
  return {
    ...actual
  };
});

describe('useAdminProductos', () => {
  it('debe renderizar correctamente', () => {
    const { result } = renderHook(() => useAdminProductos(), {
      wrapper: ({ children }) => <ProductosProvider>{children}</ProductosProvider>
    });
    expect(result.current).toBeDefined();
  });
});

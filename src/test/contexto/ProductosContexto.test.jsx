import { describe, it, expect } from 'vitest';
import { ProductosContexto } from '../../contexto/ProductosContexto';

describe('ProductosContexto', () => {
  it('debe estar definido', () => {
    expect(ProductosContexto).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import { ClientesContexto } from '../../contexto/ClientesContexto';

describe('ClientesContexto', () => {
  it('debe estar definido', () => {
    expect(ClientesContexto).toBeTruthy();
  });
});

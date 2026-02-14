import { describe, it, expect } from 'vitest';
import { initMercadoPago, crearPreferencia, abrirCheckout } from '../../lib/mercadopago';

describe('mercadopago.js', () => {
  it('debe estar definido initMercadoPago', () => {
    expect(initMercadoPago).toBeTruthy();
  });

  it('debe estar definido crearPreferencia', () => {
    expect(crearPreferencia).toBeTruthy();
  });

  it('debe estar definido abrirCheckout', () => {
    expect(abrirCheckout).toBeTruthy();
  });
});

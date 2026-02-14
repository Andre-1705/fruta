import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Carrito from '../../componentes/Carrito/Carrito';
import { CarritoProvider } from '../../contexto/CarritoContexto';

describe('Carrito', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <CarritoProvider>
        <Carrito />
      </CarritoProvider>
    );
    expect(container).toBeTruthy();
  });
});

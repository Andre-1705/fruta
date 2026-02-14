import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Formulario from '../../componentes/Formulario/Formulario';
import { CarritoProvider } from '../../contexto/CarritoContexto';

describe('Formulario', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <CarritoProvider>
        <Formulario />
      </CarritoProvider>
    );
    expect(container).toBeTruthy();
  });
});

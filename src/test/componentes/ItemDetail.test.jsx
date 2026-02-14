import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemDetail from '../../componentes/ItemDetail/ItemDetail';
import { CarritoProvider } from '../../contexto/CarritoContexto';

const mockProducto = {
  id: 'prod-1',
  nombre: 'Manzana Roja',
  precio: 150
};

describe('ItemDetail', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <CarritoProvider>
          <ItemDetail detail={mockProducto} />
        </CarritoProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

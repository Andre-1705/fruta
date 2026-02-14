import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ItemList } from '../../componentes/ItemList/ItemList';

vi.mock('../../componentes/Item/Item', () => ({
  Item: ({ producto }) => (
    <div data-testid={`item-${producto.id}`}>
      <h3>{producto.nombre}</h3>
    </div>
  )
}));

const mockProductos = [
  {
    id: 1,
    sku: 'MANZ-001',
    nombre: 'Manzana',
    precio: 100,
    img: '/assets/manzana.jpg',
    categoria: 'Cítricos'
  }
];

describe('ItemList', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <ItemList lista={mockProductos} />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

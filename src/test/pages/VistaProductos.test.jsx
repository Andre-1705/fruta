import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VistaProductos from '../../pages/VistaProductos';
import { ProductosProvider } from '../../contexto/ProductosContexto';
import { CarritoProvider } from '../../contexto/CarritoContexto';

vi.mock('../../componentes/ItemListContainer/ItemListContainer', () => ({
  default: () => <div data-testid="item-list-container">Item List Container</div>
}));

describe('VistaProductos', () => {
  it('debe renderizar el contenedor de lista de productos', () => {
    render(
      <BrowserRouter>
        <ProductosProvider>
          <CarritoProvider>
            <VistaProductos />
          </CarritoProvider>
        </ProductosProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('item-list-container')).toBeInTheDocument();
  });
});

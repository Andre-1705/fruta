import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Producto from '../../pages/Producto';
import { ProductosProvider } from '../../contexto/ProductosContexto';
import { CarritoProvider } from '../../contexto/CarritoContexto';

vi.mock('../../componentes/ItemDetailContainer/ItemDetailContainer', () => ({
  default: () => <div data-testid="item-detail-container">Item Detail Container</div>
}));

describe('Producto', () => {
  it('debe renderizar el contenedor de detalle de producto', () => {
    render(
      <BrowserRouter>
        <ProductosProvider>
          <CarritoProvider>
            <Producto />
          </CarritoProvider>
        </ProductosProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('item-detail-container')).toBeInTheDocument();
  });
});

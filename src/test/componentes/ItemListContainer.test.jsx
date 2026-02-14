import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemListContainer from '../../componentes/ItemListContainer/ItemListContainer';
import { ProductosProvider } from '../../contexto/ProductosContexto';

describe('ItemListContainer', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <ProductosProvider>
          <ItemListContainer />
        </ProductosProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

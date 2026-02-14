import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemDetailContainer from '../../componentes/ItemDetailContainer/ItemDetailContainer';
import { ProductosProvider } from '../../contexto/ProductosContexto';

describe('ItemDetailContainer', () => {
  it('debe renderizar', () => {
    const { container } = render(
      <BrowserRouter>
        <ProductosProvider>
          <ItemDetailContainer />
        </ProductosProvider>
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

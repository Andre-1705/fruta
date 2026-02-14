import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ProductoForm from '../../../componentes/adminComponents/ProductoForm';

describe('ProductoForm', () => {
  it('renderiza correctamente', () => {
    const mockOnProductoCreado = vi.fn();
    const mockOnProductoActualizado = vi.fn();
    
    const { container } = render(
      <ProductoForm 
        onProductoCreado={mockOnProductoCreado}
        onProductoActualizado={mockOnProductoActualizado}
      />
    );
    
    expect(container).toBeTruthy();
  });
});

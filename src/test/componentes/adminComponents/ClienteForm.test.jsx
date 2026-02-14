import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ClienteForm from '../../../componentes/adminComponents/ClienteForm';

describe('ClienteForm', () => {
  it('debe renderizar sin errores', () => {
    const mockOnSubmit = vi.fn();
    const { container } = render(
      <ClienteForm onSubmit={mockOnSubmit} />
    );
    expect(container).toBeTruthy();
  });
});

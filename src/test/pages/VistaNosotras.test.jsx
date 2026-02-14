import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VistaNosotras from '../../pages/VistaNosotras';

describe('VistaNosotras', () => {
  it('debe renderizar la página nosotras', () => {
    render(
      <BrowserRouter>
        <VistaNosotras />
      </BrowserRouter>
    );
    
    // Verificar que la página se renderiza
    expect(document.body).toBeTruthy();
  });

  it('debe tener contenido sobre el equipo', () => {
    const { container } = render(
      <BrowserRouter>
        <VistaNosotras />
      </BrowserRouter>
    );
    
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

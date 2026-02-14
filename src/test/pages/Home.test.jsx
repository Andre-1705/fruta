import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';

describe('Home', () => {
  it('debe renderizar la página de inicio', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    // Verificar que la página se renderiza
    expect(document.body).toBeTruthy();
  });

  it('debe tener contenido visible', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

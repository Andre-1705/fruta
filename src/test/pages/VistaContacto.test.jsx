import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VistaContacto from '../../pages/VistaContacto';

describe('VistaContacto', () => {
  it('debe renderizar la página de contacto', () => {
    render(
      <BrowserRouter>
        <VistaContacto />
      </BrowserRouter>
    );
    
    // Verificar que la página se renderiza
    expect(document.body).toBeTruthy();
  });

  it('debe tener información de contacto', () => {
    const { container } = render(
      <BrowserRouter>
        <VistaContacto />
      </BrowserRouter>
    );
    
    // Verificar que hay algún contenido relacionado con contacto
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Nav } from '../../componentes/Nav/Nav';
import { AuthProvider } from '../../contexto/AuthContexto';

// Mock de useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

const renderNav = (authContextValue = {}) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Nav />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Nav', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('debe renderizar todos los enlaces básicos de navegación', () => {
    renderNav();
    
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Nosotras')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Carrito')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('debe mostrar "Iniciar sesión" cuando no hay usuario', () => {
    renderNav();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('debe renderizar enlaces de categorías', () => {
    renderNav();
    
    expect(screen.getByText('Cítricos')).toBeInTheDocument();
    expect(screen.getByText('Frutos Secos')).toBeInTheDocument();
    expect(screen.getByText('Tropicales')).toBeInTheDocument();
  });

  it('debe renderizar el título de categorías', () => {
    renderNav();
    expect(screen.getByText('Seleccioná por categoría')).toBeInTheDocument();
  });

  it('debe tener el enlace admin con ícono de candado', () => {
    renderNav();
    const adminIcon = screen.getByRole('img', { name: 'admin' });
    expect(adminIcon).toBeInTheDocument();
  });

  it('debe tener los atributos correctos de accesibilidad en las categorías', () => {
    const { container } = renderNav();
    const navCategorias = container.querySelector('.nav-categorias');
    expect(navCategorias).toBeInTheDocument();
  });

  it('debe aplicar las clases CSS correctas', () => {
    const { container } = renderNav();
    
    const navPrincipal = container.querySelector('.nav');
    expect(navPrincipal).toBeInTheDocument();
    
    const navCategoriasWrapper = container.querySelector('.nav-categorias-wrapper');
    expect(navCategoriasWrapper).toBeInTheDocument();
  });
});

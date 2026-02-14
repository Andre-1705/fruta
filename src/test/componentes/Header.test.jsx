import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../../componentes/Header/Header';
import { AuthProvider } from '../../contexto/AuthContexto';

// Mock del componente Nav
vi.mock('../../componentes/Nav/Nav', () => ({
  Nav: () => <nav data-testid="nav-mock">Nav Component</nav>
}));

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('debe renderizar el logo', () => {
    renderHeader();
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/logo_fruta.png');
  });

  it('debe renderizar el título principal', () => {
    renderHeader();
    const titulo = screen.getByText('Bienvenidos a Fruta');
    expect(titulo).toBeInTheDocument();
    expect(titulo.tagName).toBe('H1');
  });

  it('debe renderizar el subtítulo', () => {
    renderHeader();
    const subtitulo = screen.getByText('Acá las cosas caen por su propio peso');
    expect(subtitulo).toBeInTheDocument();
    expect(subtitulo.tagName).toBe('H2');
  });

  it('debe renderizar el componente Nav', () => {
    renderHeader();
    const nav = screen.getByTestId('nav-mock');
    expect(nav).toBeInTheDocument();
  });

  it('debe tener la estructura correcta con header y divs', () => {
    const { container } = renderHeader();
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    
    const headerDiv = container.querySelector('.header');
    expect(headerDiv).toBeInTheDocument();
    
    const textosDiv = container.querySelector('.textos');
    expect(textosDiv).toBeInTheDocument();
  });
});

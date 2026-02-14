import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../componentes/Footer/Footer';

describe('Footer', () => {
  it('debe renderizar el footer', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('debe renderizar el enlace de Facebook', () => {
    render(<Footer />);
    const facebookLink = screen.getByText('Facebook');
    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('debe renderizar el enlace de Instagram', () => {
    render(<Footer />);
    const instagramLink = screen.getByText('Instagram');
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com');
    expect(instagramLink).toHaveAttribute('target', '_blank');
  });

  it('debe renderizar el enlace de TikTok', () => {
    render(<Footer />);
    const tiktokLink = screen.getByText('Tik Tok');
    expect(tiktokLink).toBeInTheDocument();
    expect(tiktokLink).toHaveAttribute('href', 'https://tiktok.com');
    expect(tiktokLink).toHaveAttribute('target', '_blank');
  });

  it('debe renderizar el enlace de WhatsApp', () => {
    render(<Footer />);
    const whatsappLink = screen.getByText('Whats Apps');
    expect(whatsappLink).toBeInTheDocument();
    expect(whatsappLink).toHaveAttribute('href', 'https://whatsapp.com');
    expect(whatsappLink).toHaveAttribute('target', '_blank');
  });

  it('debe renderizar el logo de Facebook', () => {
    render(<Footer />);
    const facebookLogo = screen.getByAltText('Logo Facebook');
    expect(facebookLogo).toBeInTheDocument();
    expect(facebookLogo).toHaveAttribute('src', '/assets/icon/logo_face.png');
  });

  it('debe renderizar el logo de Instagram', () => {
    render(<Footer />);
    const instagramLogo = screen.getByAltText('Logo Instagram');
    expect(instagramLogo).toBeInTheDocument();
    expect(instagramLogo).toHaveAttribute('src', '/assets/icon/logo_insta.png');
  });

  it('debe renderizar el logo de TikTok', () => {
    render(<Footer />);
    const tiktokLogo = screen.getByAltText('Logo Tik Tok');
    expect(tiktokLogo).toBeInTheDocument();
    expect(tiktokLogo).toHaveAttribute('src', '/assets/icon/logo_tiktok.png');
  });

  it('debe renderizar el logo de WhatsApp', () => {
    render(<Footer />);
    const whatsappLogo = screen.getByAltText('Logo Whats Apps');
    expect(whatsappLogo).toBeInTheDocument();
    expect(whatsappLogo).toHaveAttribute('src', '/assets/icon/logo_watsapp.png');
  });

  it('debe renderizar el texto de copyright', () => {
    render(<Footer />);
    const copyright = screen.getByText(/Reservamos fruta solo por derecha/);
    expect(copyright).toBeInTheDocument();
    expect(copyright.tagName).toBe('P');
  });

  it('debe tener la clase correcta para los iconos de redes', () => {
    const { container } = render(<Footer />);
    const iconosRedes = container.querySelector('.iconos-redes');
    expect(iconosRedes).toBeInTheDocument();
  });

  it('todos los enlaces externos deben tener rel="noopener noreferrer"', () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll('a[target="_blank"]');
    
    links.forEach(link => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});

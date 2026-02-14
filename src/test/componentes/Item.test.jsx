import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Item } from '../../componentes/Item/Item';
import { CarritoProvider } from '../../contexto/CarritoContexto';

const mockProducto = {
  id: 1,
  sku: 'MANZ-001',
  nombre: 'Manzana',
  precio: 100,
  img: '/assets/manzana.jpg',
  descripcion: 'Manzanas frescas y deliciosas',
  stock: 50
};

const renderItem = (producto = mockProducto) => {
  return render(
    <BrowserRouter>
      <CarritoProvider>
        <Item producto={producto} />
      </CarritoProvider>
    </BrowserRouter>
  );
};

describe('Item', () => {
  it('debe renderizar la información del producto', () => {
    renderItem();
    
    expect(screen.getByText('Manzana')).toBeInTheDocument();
    expect(screen.getByText('Precio: $100')).toBeInTheDocument();
    expect(screen.getByText('SKU: MANZ-001')).toBeInTheDocument();
  });

  it('debe renderizar la imagen del producto', () => {
    renderItem();
    
    const imagen = screen.getByAltText('Manzana');
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute('src', '/assets/manzana.jpg');
  });

  it('debe mostrar el botón "Agregar al carrito" inicialmente', () => {
    renderItem();
    
    const botonAgregar = screen.getByText('Agregar al carrito');
    expect(botonAgregar).toBeInTheDocument();
  });

  it('debe mostrar "Ver producto" button', () => {
    renderItem();
    
    const botonVer = screen.getByText('Ver producto');
    expect(botonVer).toBeInTheDocument();
  });

  it('debe mostrar la descripción al hacer hover', () => {
    const { container } = renderItem();
    
    const tarjeta = container.querySelector('.tarjeta');
    
    // Inicialmente no debe mostrar la descripción
    expect(screen.queryByText('Manzanas frescas y deliciosas')).not.toBeInTheDocument();
    
    // Hacer hover
    fireEvent.mouseEnter(tarjeta);
    
    // Ahora debe mostrar la descripción
    expect(screen.getByText('Manzanas frescas y deliciosas')).toBeInTheDocument();
  });

  it('debe ocultar la descripción al quitar el hover', () => {
    const { container } = renderItem();
    
    const tarjeta = container.querySelector('.tarjeta');
    
    // Hacer hover
    fireEvent.mouseEnter(tarjeta);
    expect(screen.getByText('Manzanas frescas y deliciosas')).toBeInTheDocument();
    
    // Quitar hover
    fireEvent.mouseLeave(tarjeta);
    expect(screen.queryByText('Manzanas frescas y deliciosas')).not.toBeInTheDocument();
  });

  it('debe agregar clase "hovered" al hacer mouseEnter', () => {
    const { container } = renderItem();
    
    const tarjeta = container.querySelector('.tarjeta');
    expect(tarjeta).not.toHaveClass('hovered');
    
    fireEvent.mouseEnter(tarjeta);
    expect(tarjeta).toHaveClass('hovered');
  });

  it('debe quitar clase "hovered" al hacer mouseLeave', () => {
    const { container } = renderItem();
    
    const tarjeta = container.querySelector('.tarjeta');
    
    fireEvent.mouseEnter(tarjeta);
    expect(tarjeta).toHaveClass('hovered');
    
    fireEvent.mouseLeave(tarjeta);
    expect(tarjeta).not.toHaveClass('hovered');
  });

  it('debe agregar producto al carrito al hacer click en "Agregar al carrito"', () => {
    renderItem();
    
    const botonAgregar = screen.getByText('Agregar al carrito');
    fireEvent.click(botonAgregar);
    
    // Después de agregar, el botón debería cambiar a "Quitar del carrito"
    expect(screen.getByText('Quitar del carrito')).toBeInTheDocument();
  });

  it('debe quitar producto del carrito al hacer click en "Quitar del carrito"', () => {
    renderItem();
    
    // Primero agregar al carrito
    const botonAgregar = screen.getByText('Agregar al carrito');
    fireEvent.click(botonAgregar);
    
    // Ahora quitar del carrito
    const botonQuitar = screen.getByText('Quitar del carrito');
    fireEvent.click(botonQuitar);
    
    // Debería volver a mostrar "Agregar al carrito"
    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
  });

  it('debe mostrar "—" cuando no hay SKU', () => {
    const productoSinSKU = { ...mockProducto, sku: null };
    renderItem(productoSinSKU);
    
    expect(screen.getByText('SKU: —')).toBeInTheDocument();
  });

  it('debe tener la clase "tarjeta" en el article', () => {
    const { container } = renderItem();
    const article = container.querySelector('article');
    expect(article).toHaveClass('tarjeta');
  });
});

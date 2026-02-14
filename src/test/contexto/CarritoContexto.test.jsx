import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CarritoProvider, useCarrito } from '../../contexto/CarritoContexto';

const mockProducto1 = {
  id: 'prod-1',
  nombre: 'Manzana',
  precio: 100,
  img: 'manzana.jpg',
  stock: 50
};

const mockProducto2 = {
  id: 'prod-2',
  nombre: 'Banana',
  precio: 80,
  img: 'banana.jpg',
  stock: 30
};

describe('CarritoContexto', () => {
  it('debe inicializar con carrito vacío', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    expect(result.current.carrito).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('debe agregar un producto al carrito', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(mockProducto1);
    });

    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0]).toMatchObject({
      id: 'prod-1',
      nombre: 'Manzana',
      cantidad: 1
    });
  });

  it('debe incrementar cantidad si el producto ya existe', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(mockProducto1);
      result.current.agregarAlCarrito(mockProducto1);
      result.current.agregarAlCarrito(mockProducto1);
    });

    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].cantidad).toBe(3);
  });

  it('debe calcular correctamente el total', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(mockProducto1); // 100
      result.current.agregarAlCarrito(mockProducto1); // 100
      result.current.agregarAlCarrito(mockProducto2); // 80
    });

    // 2 manzanas (200) + 1 banana (80) = 280
    expect(result.current.total).toBe(280);
  });

  it('debe restar cantidad de un producto', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(mockProducto1);
      result.current.agregarAlCarrito(mockProducto1);
      result.current.agregarAlCarrito(mockProducto1);
    });

    expect(result.current.carrito[0].cantidad).toBe(3);

    act(() => {
      result.current.restarDelCarrito('prod-1');
    });

    expect(result.current.carrito[0].cantidad).toBe(2);
  });

  it('debe eliminar producto del carrito si cantidad es 1 y se resta', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(mockProducto1);
    });

    expect(result.current.carrito).toHaveLength(1);

    act(() => {
      result.current.restarDelCarrito('prod-1');
    });

    expect(result.current.carrito).toHaveLength(0);
  });

  it('debe remover un producto completamente del carrito', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(mockProducto1);
      result.current.agregarAlCarrito(mockProducto1);
      result.current.agregarAlCarrito(mockProducto2);
    });

    expect(result.current.carrito).toHaveLength(2);

    act(() => {
      result.current.removerDelCarrito('prod-1');
    });

    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].id).toBe('prod-2');
  });

  it('debe vaciar el carrito completamente', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(mockProducto1);
      result.current.agregarAlCarrito(mockProducto2);
    });

    expect(result.current.carrito).toHaveLength(2);

    act(() => {
      result.current.vaciarCarrito();
    });

    expect(result.current.carrito).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it('debe respetar el límite de stock', () => {
    const productoPocoStock = {
      id: 'prod-3',
      nombre: 'Frutilla',
      precio: 150,
      img: 'frutilla.jpg',
      stock: 2
    };

    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(productoPocoStock);
      result.current.agregarAlCarrito(productoPocoStock);
      result.current.agregarAlCarrito(productoPocoStock); // Esta no debería agregarse
    });

    // Solo debe agregar 2 porque el stock es 2
    expect(result.current.carrito[0].cantidad).toBe(2);
  });

  it('no debe agregar producto sin stock', () => {
    const productoSinStock = {
      id: 'prod-4',
      nombre: 'Uva',
      precio: 200,
      img: 'uva.jpg',
      stock: 0
    };

    const { result } = renderHook(() => useCarrito(), {
      wrapper: CarritoProvider
    });

    act(() => {
      result.current.agregarAlCarrito(productoSinStock);
    });

    expect(result.current.carrito).toHaveLength(0);
  });
});

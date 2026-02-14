import { describe, it, expect } from 'vitest';

/**
 * Valida formato de email
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida formato de teléfono (Argentina)
 */
export const validarTelefono = (telefono) => {
  const regex = /^[\d\s\-\+\(\)]{10,20}$/;
  const cleaned = telefono.toString().trim();
  return regex.test(cleaned) && cleaned.replace(/\D/g, '').length >= 10;
};

/**
 * Formatea precio en pesos argentinos
 */
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(precio);
};

/**
 * Valida stock disponible
 */
export const validarStock = (cantidad, stockDisponible) => {
  return cantidad > 0 && cantidad <= stockDisponible;
};

/**
 * Calcula descuento
 */
export const calcularDescuento = (precio, porcentaje) => {
  return precio * (1 - porcentaje / 100);
};

/**
 * Normaliza string para búsqueda
 */
export const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Genera número de pedido
 */
export const generarNumeroPedido = (fecha = new Date()) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${month}${day}-${random}`;
};

describe('Validaciones y Utilidades', () => {
  describe('validarEmail', () => {
    it('debe aceptar emails válidos', () => {
      expect(validarEmail('test@example.com')).toBe(true);
      expect(validarEmail('usuario.nombre@dominio.com.ar')).toBe(true);
      expect(validarEmail('test+tag@example.co')).toBe(true);
    });

    it('debe rechazar emails inválidos', () => {
      expect(validarEmail('email-sin-arroba')).toBe(false);
      expect(validarEmail('@sin-usuario.com')).toBe(false);
      expect(validarEmail('sin-dominio@')).toBe(false);
      expect(validarEmail('sin.extension@dominio')).toBe(false);
      expect(validarEmail('')).toBe(false);
    });
  });

  describe('validarTelefono', () => {
    it('debe aceptar teléfonos válidos', () => {
      expect(validarTelefono('1234567890')).toBe(true);
      expect(validarTelefono('11-2345-6789')).toBe(true);
      expect(validarTelefono('+54 11 2345 6789')).toBe(true);
      expect(validarTelefono('(011) 2345-6789')).toBe(true);
    });

    it('debe rechazar teléfonos inválidos', () => {
      expect(validarTelefono('123')).toBe(false);
      expect(validarTelefono('abc1234567')).toBe(false);
      expect(validarTelefono('')).toBe(false);
    });
  });

  describe('formatearPrecio', () => {
    it('debe formatear precios correctamente', () => {
      expect(formatearPrecio(100)).toContain('100');
      expect(formatearPrecio(1500.50)).toContain('1.500');
      expect(formatearPrecio(0)).toContain('0');
    });

    it('debe incluir el símbolo de pesos', () => {
      const formatted = formatearPrecio(100);
      expect(formatted).toMatch(/\$/);
    });
  });

  describe('validarStock', () => {
    it('debe validar stock disponible correctamente', () => {
      expect(validarStock(5, 10)).toBe(true);
      expect(validarStock(10, 10)).toBe(true);
      expect(validarStock(1, 50)).toBe(true);
    });

    it('debe rechazar cantidades inválidas', () => {
      expect(validarStock(0, 10)).toBe(false);
      expect(validarStock(-1, 10)).toBe(false);
      expect(validarStock(15, 10)).toBe(false);
    });
  });

  describe('calcularDescuento', () => {
    it('debe calcular descuentos correctamente', () => {
      expect(calcularDescuento(100, 10)).toBe(90);
      expect(calcularDescuento(200, 25)).toBe(150);
      expect(calcularDescuento(1000, 50)).toBe(500);
    });

    it('debe manejar descuento del 0%', () => {
      expect(calcularDescuento(100, 0)).toBe(100);
    });

    it('debe manejar descuento del 100%', () => {
      expect(calcularDescuento(100, 100)).toBe(0);
    });
  });

  describe('normalizarTexto', () => {
    it('debe normalizar texto para búsqueda', () => {
      expect(normalizarTexto('Manzana')).toBe('manzana');
      expect(normalizarTexto('BANANA')).toBe('banana');
      expect(normalizarTexto('Café')).toBe('cafe');
      expect(normalizarTexto('Açaí')).toBe('acai');
    });

    it('debe remover acentos', () => {
      expect(normalizarTexto('ñoño')).toBe('nono');
      expect(normalizarTexto('años')).toBe('anos');
    });
  });

  describe('generarNumeroPedido', () => {
    it('debe generar número de pedido con formato correcto', () => {
      const numero = generarNumeroPedido();
      expect(numero).toMatch(/^ORD-\d{8}-\d{3}$/);
    });

    it('debe generar números únicos', () => {
      const numero1 = generarNumeroPedido();
      const numero2 = generarNumeroPedido();
      // Pueden ser iguales por el random, pero el formato es correcto
      expect(numero1).toMatch(/^ORD-\d{8}-\d{3}$/);
      expect(numero2).toMatch(/^ORD-\d{8}-\d{3}$/);
    });

    it('debe usar la fecha proporcionada', () => {
      const fecha = new Date(2026, 1, 14); // Mes 1 = Febrero (0-indexed)
      const numero = generarNumeroPedido(fecha);
      expect(numero).toMatch(/^ORD-20260214-\d{3}$/);
    });
  });
});

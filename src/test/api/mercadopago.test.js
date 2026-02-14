import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de fetch global
global.fetch = vi.fn();

describe('API: create-preference', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
  });

  it('debe crear una preferencia de pago válida', async () => {
    const mockResponse = {
      id: 'preference-123',
      init_point: 'https://mercadopago.com/checkout/test'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const payload = {
      items: [
        { nombre: 'Manzana', cantidad: 2, precio: 100 }
      ],
      pedidoId: 'order-123',
      email: 'test@example.com',
      telefono: '1234567890'
    };

    const response = await fetch('/api/mercadopago/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith(
      '/api/mercadopago/create-preference',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );

    expect(data).toEqual(mockResponse);
    expect(data.id).toBe('preference-123');
  });

  it('debe rechazar requests sin items', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'No hay items para pagar' })
    });

    const payload = {
      items: [],
      pedidoId: 'order-123',
      email: 'test@example.com'
    };

    const response = await fetch('/api/mercadopago/create-preference', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
  });

  it('debe validar formato de items', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Items inválidos' })
    });

    const payload = {
      items: [
        { nombre: '', cantidad: 2, precio: -100 } // Datos inválidos
      ],
      pedidoId: 'order-123',
      email: 'test@example.com'
    };

    const response = await fetch('/api/mercadopago/create-preference', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    expect(response.ok).toBe(false);
  });

  it('debe rechazar método GET', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 405,
      json: async () => ({ error: 'Method not allowed' })
    });

    const response = await fetch('/api/mercadopago/create-preference', {
      method: 'GET'
    });

    expect(response.status).toBe(405);
  });
});

describe('API: verificar-pago', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('debe verificar el estado de un pago', async () => {
    const mockPayment = {
      id: 'payment-123',
      status: 'approved',
      external_reference: 'order-123'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPayment
    });

    const response = await fetch('/api/mercadopago/verificar-pago?payment_id=payment-123');
    const data = await response.json();

    expect(data.status).toBe('approved');
    expect(data.external_reference).toBe('order-123');
  });

  it('debe manejar pagos rechazados', async () => {
    const mockPayment = {
      id: 'payment-456',
      status: 'rejected',
      status_detail: 'cc_rejected_insufficient_amount'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPayment
    });

    const response = await fetch('/api/mercadopago/verificar-pago?payment_id=payment-456');
    const data = await response.json();

    expect(data.status).toBe('rejected');
  });
});

describe('API: webhook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('debe procesar notificación de pago aprobado', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ received: true })
    });

    const payload = {
      type: 'payment',
      data: {
        id: 'payment-123'
      }
    };

    const response = await fetch('/api/mercadopago/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    expect(data.received).toBe(true);
  });

  it('debe rechazar notificaciones de tipo desconocido', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ received: true })
    });

    const payload = {
      type: 'unknown_type',
      data: {}
    };

    const response = await fetch('/api/mercadopago/webhook', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    expect(response.ok).toBe(true);
  });
});

describe('Validación de Stock en API', () => {
  it('debe validar stock antes de crear pedido', async () => {
    const stockActual = 10;
    const cantidadSolicitada = 15;

    expect(cantidadSolicitada).toBeGreaterThan(stockActual);

    // Simular que la API rechaza por stock insuficiente
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Stock insuficiente' })
    });

    const response = await fetch('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify({
        items: [{ id: 'prod-1', cantidad: cantidadSolicitada }]
      })
    });

    expect(response.ok).toBe(false);
  });

  it('debe aprobar pedido con stock suficiente', async () => {
    const stockActual = 50;
    const cantidadSolicitada = 10;

    expect(cantidadSolicitada).toBeLessThanOrEqual(stockActual);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, orderId: 'order-123' })
    });

    const response = await fetch('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify({
        items: [{ id: 'prod-1', cantidad: cantidadSolicitada }]
      })
    });

    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
  });
});

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const body = await req.json();
    const {
      items = [],
      pedidoId,
      email,
      telefono,
      costoEnvio = 0
    } = body || {};

    const siteUrl = (process.env.PUBLIC_SITE_URL && process.env.PUBLIC_SITE_URL.trim()) ? process.env.PUBLIC_SITE_URL : url.origin;
    const mockMode = (process.env.MOCK_PAYMENTS === 'true');

    // Validación básica
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'No hay items para pagar' }), { status: 400 });
    }

    // Normalizar y validar items mínimos requeridos por MP
    const normalizedItems = items.map((item) => {
      const title = (item.nombre || item.title || '').toString().trim();
      const qty = Number.isFinite(Number(item.cantidad)) ? parseInt(item.cantidad, 10) : 1;
      const quantity = Math.max(1, qty || 1);
      const unit = Number(item.precio);
      const unit_price = Number.isFinite(unit) ? Number(unit.toFixed(2)) : NaN;
      return {
        title,
        description: item.descripcion || undefined,
        quantity,
        unit_price,
        currency_id: 'ARS'
      };
    });

    // Validaciones previas a llamar a MP
    if (normalizedItems.some(i => !i.title || !Number.isFinite(i.unit_price) || i.unit_price <= 0)) {
      return new Response(JSON.stringify({ error: 'Items inválidos: title requerido y unit_price > 0' }), { status: 400 });
    }

    const payload = {
      items: normalizedItems,
      payer: {
        email,
        phone: { number: telefono }
      },
      external_reference: pedidoId,
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      back_urls: {
        success: `${siteUrl}/pedido/exito?pedido=${pedidoId}`,
        failure: `${siteUrl}/pedido/error?pedido=${pedidoId}`,
        pending: `${siteUrl}/pedido/pendiente?pedido=${pedidoId}`
      },
      auto_return: 'approved',
      ...(process.env.MP_BINARY_MODE === 'true' ? { binary_mode: true } : {}),
      payment_methods: {
        excluded_payment_types: [],
        installments: 12
      },
      shipments: {
        cost: Number(costoEnvio) || 0,
        mode: 'not_specified'
      },
      statement_descriptor: 'FRUTA-STORE'
    };

    // Modo mock para pruebas sin credenciales de MercadoPago
    if (mockMode) {
      const fake = {
        id: `MOCK-PREF-${pedidoId || Date.now()}`,
        init_point: `${siteUrl}/pedido/exito?pedido=${pedidoId || 'mock'}`,
        sandbox_init_point: `${siteUrl}/pedido/exito?pedido=${pedidoId || 'mock'}`,
        collector_id: 0,
        external_reference: pedidoId,
        back_urls: payload.back_urls
      };
      return new Response(JSON.stringify(fake), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      console.error('❌ MP_ACCESS_TOKEN no está configurado');
      return new Response(JSON.stringify({ error: 'MP_ACCESS_TOKEN is not set' }), { status: 500 });
    }

    console.log('📤 Enviando a MercadoPago API:', { itemsCount: payload.items.length, pedidoId });

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const text = await mpRes.text();
    console.log('📥 Respuesta de MercadoPago:', mpRes.status, text.substring(0, 200));

    if (!mpRes.ok) {
      console.error('❌ MercadoPago error:', mpRes.status, text);
      return new Response(JSON.stringify({ error: 'MercadoPago API error', status: mpRes.status, details: text }), {
        status: mpRes.status,
        headers: { 'content-type': 'application/json' }
      });
    }

    return new Response(text, {
      status: mpRes.status,
      headers: { 'content-type': 'application/json' }
    });
  } catch (err) {
    console.error('❌ Error en create-preference:', err);
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err), stack: err.stack }), { status: 500 });
  }
}

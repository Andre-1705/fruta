import { MercadoPagoConfig, Preference } from 'mercadopago';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      items = [],
      pedidoId,
      email,
      telefono,
      costoEnvio = 0
    } = req.body || {};

    const siteUrl = process.env.PUBLIC_SITE_URL || `https://${req.headers.host}`;
    const mockMode = (process.env.MOCK_PAYMENTS === 'true');

    // Validación básica
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No hay items para pagar' });
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
      return res.status(400).json({ error: 'Items inválidos: title requerido y unit_price > 0' });
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
      console.log('🧪 MOCK MODE: Returning fake preference');
      return res.status(200).json(fake);
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      console.error('❌ MP_ACCESS_TOKEN no está configurado');
      return res.status(500).json({ error: 'MP_ACCESS_TOKEN is not set' });
    }

    console.log('📤 Creando preferencia con SDK de MercadoPago');

    // Inicializar SDK de MercadoPago
    const client = new MercadoPagoConfig({
      accessToken: token,
      options: { timeout: 5000 }
    });
    const preference = new Preference(client);

    // Crear preferencia usando el SDK oficial
    const result = await preference.create({ body: payload });

    console.log('✅ Preferencia creada:', result.id);

    return res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error en create-preference:', err);
    return res.status(500).json({
      error: 'Internal error',
      details: err.message,
      cause: err.cause?.message
    });
  }
}

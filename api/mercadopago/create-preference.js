export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const {
      items = [],
      pedidoId,
      email,
      telefono,
      costoEnvio = 0
    } = body || {};

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: 'MP_ACCESS_TOKEN is not set' }), { status: 500 });
    }

    const payload = {
      items: items.map((item) => ({
        id: item.id,
        title: item.nombre,
        description: item.descripcion || 'Producto fresco',
        picture_url: item.imagen,
        category_id: 'food',
        quantity: Number(item.cantidad) || 1,
        unit_price: Number(item.precio) || 0,
        currency_id: 'ARS'
      })),
      payer: {
        email,
        phone: { number: telefono }
      },
      external_reference: pedidoId,
      notification_url: `${process.env.PUBLIC_SITE_URL || ''}/api/mercadopago/webhook`,
      back_urls: {
        success: `${process.env.PUBLIC_SITE_URL || ''}/pedido/exito?pedido=${pedidoId}`,
        failure: `${process.env.PUBLIC_SITE_URL || ''}/pedido/error?pedido=${pedidoId}`,
        pending: `${process.env.PUBLIC_SITE_URL || ''}/pedido/pendiente?pedido=${pedidoId}`
      },
      auto_return: 'approved',
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

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const text = await mpRes.text();
    return new Response(text, {
      status: mpRes.status,
      headers: { 'content-type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), { status: 500 });
  }
}

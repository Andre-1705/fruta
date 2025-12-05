import { MercadoPagoConfig, Payment } from 'mercadopago';

export const config = { runtime: 'nodejs' };

// Webhook: recibe notificaciones de MercadoPago y confirma recepción.
// En una próxima iteración podemos consultar el pago y actualizar Supabase
// usando una SERVICE_ROLE key (variable de entorno separada y segura).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  try {
    const body = req.body || {};
    const query = req.query || {};

    // MP envía datos por query (v1), o body (v2). Cubrimos ambos.
    const topic = (query.topic || body.type || '').toLowerCase();
    const paymentId = query.id || body.data?.id || body.resource?.id || body.resource || null;

    console.log('📬 Webhook MP recibido:', { topic, paymentId, query, body });

    // Ejemplo: si el tópico es pago, opcionalmente podemos consultar el estado
    // (requiere MP_ACCESS_TOKEN y permisos; evitar si estamos en MOCK o en pruebas).
    if (process.env.MP_ACCESS_TOKEN && topic === 'payment' && paymentId) {
      try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);
        const info = await payment.get({ id: paymentId });
        console.log('🔎 Estado de pago consultado:', { id: paymentId, status: info.status, status_detail: info.status_detail });
        // TODO: actualizar orders.estado_pago y orders.estado con SERVICE_ROLE
      } catch (e) {
        console.warn('⚠️ No se pudo consultar el pago:', e?.message || e);
      }
    }

    // Respondemos 200 para que MP no reintente indefinidamente
    return res.status(200).json({ received: true, topic, paymentId });
  } catch (err) {
    console.error('❌ Error en webhook MP:', err);
    return res.status(500).json({ error: 'Internal error', details: err.message });
  }
}

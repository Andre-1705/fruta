import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Desactivar body parser para leer body raw (necesario para verificar firma)
export const config = {
  api: { bodyParser: false },
  runtime: 'nodejs'
};

// Leer el body raw de la petición
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// Verificar firma del webhook (#2)
function verifySignature(headers, rawBody) {
  const signatureHeader = headers['x-signature'];
  if (!signatureHeader) return false;

  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('MP_WEBHOOK_SECRET no configurada, saltando verificacion');
    return true;
  }

  // Parsear "ts=1234567890,v1=abc123..."
  const parts = {};
  signatureHeader.split(',').forEach(part => {
    const [key, ...rest] = part.split('=');
    parts[key.trim()] = rest.join('=').trim();
  });

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  // Manifest: timestamp + punto + body raw
  const manifest = `${ts}.${rawBody}`;
  const generated = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generated, 'hex'),
      Buffer.from(v1, 'hex')
    );
  } catch {
    return false;
  }
}

// Enviar email via Resend
async function sendEmail(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY no configurada');
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Fruta Store <onboarding@resend.dev>',
        to: [to],
        subject,
        html
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Error enviando email:', err);
    } else {
      console.log('Email enviado a:', to);
    }
  } catch (e) {
    console.error('Error enviando email:', e.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  try {
    // Leer body raw para firma
    const rawBody = await getRawBody(req);
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({ error: 'JSON invalido' });
    }

    // #2: Verificar firma
    if (!verifySignature(req.headers, rawBody)) {
      console.warn('Webhook: firma invalida');
      return res.status(401).json({ error: 'Firma invalida' });
    }

    const query = req.query || {};
    const topic = (query.topic || body.type || '').toLowerCase();
    const paymentId = query.id || body.data?.id || null;

    console.log('Webhook MP recibido:', { topic, paymentId });

    // Procesar pago
    if (topic === 'payment' && paymentId) {
      const token = process.env.MP_ACCESS_TOKEN;
      if (!token) {
        console.error('MP_ACCESS_TOKEN no configurada');
        return res.status(200).json({ received: true });
      }

      // Consultar estado del pago en MP
      const client = new MercadoPagoConfig({ accessToken: token, options: { timeout: 5000 } });
      const payment = new Payment(client);
      const info = await payment.get({ id: paymentId });

      console.log('Pago consultado:', {
        id: paymentId,
        status: info.status,
        external_ref: info.external_reference
      });

      // #8: Si el pago fue aprobado, actualizar la orden en la BD
      if (info.status === 'approved') {
        const orderId = info.external_reference;
        if (!orderId) {
          console.warn('Pago aprobado pero sin external_reference');
          return res.status(200).json({ received: true });
        }

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);

          const { data, error } = await supabase
            .from('orders')
            .update({
              estado_pago: 'aprobado',
              estado: 'pagado',
              fecha_pago: new Date().toISOString(),
              mp_payment_id: String(paymentId),
              mp_preference_id: info.preference_id || null
            })
            .eq('id', orderId)
            .select();

          if (error) {
            console.error('Error actualizando orden:', error.message);
          } else {
            console.log('Orden actualizada:', data?.[0]?.numero_pedido || orderId);
          }
                  // Enviar email de confirmacion al cliente
          if (data && data[0]) {
            const order = data[0];
            await sendEmail(
              order.email_destinatario,
              `Tu pedido ${order.numero_pedido} fue confirmado`,
              `<h1>Pedido confirmado</h1>
              <p>Hola ${order.nombre_destinatario},</p>
              <p>Tu pedido <strong>${order.numero_pedido}</strong> fue pagado exitosamente.</p>
              <p><strong>Total:</strong> $${Number(order.total).toLocaleString('es-AR')}</p>
              <p>Estado: ${order.estado}</p>
              <p>Gracias por tu compra.</p>`
            );
          }
        } else {
          console.warn('SUPABASE_SERVICE_ROLE_KEY no configurada, no se actualizo la BD');
        }
      }
    }

    return res.status(200).json({ received: true, topic, paymentId });
  } catch (err) {
    console.error('Error en webhook MP:', err);
    return res.status(500).json({ error: 'Internal error', details: err.message });
  }
}

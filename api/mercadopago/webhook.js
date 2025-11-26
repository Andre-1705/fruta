export const config = { runtime: 'edge' };

// Webhook mínimo: responde 200 para que MP no reintente indefinidamente.
// Siguiente paso: consultar el pago y actualizar estado en Supabase con una Service Key.
export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    // TODO: aquí podrías consultar el pago usando process.env.MP_ACCESS_TOKEN
    // y actualizar tu tabla 'orders' en Supabase con una SERVICE_ROLE key
    // (evitamos hacerlo ahora para no pedirte más variables sensibles).
    return new Response(JSON.stringify({ received: true, body }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), { status: 500 });
  }
}

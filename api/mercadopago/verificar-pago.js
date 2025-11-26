export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('payment_id');
    if (!paymentId) {
      return new Response(JSON.stringify({ error: 'payment_id is required' }), { status: 400 });
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: 'MP_ACCESS_TOKEN is not set' }), { status: 500 });
    }

    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'content-type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), { status: 500 });
  }
}

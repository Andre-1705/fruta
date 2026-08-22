// ============================================
// CONFIGURACIÓN DE MERCADOPAGO
// ============================================
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

export const initMercadoPago = () => {
  if (typeof window !== 'undefined' && window.MercadoPago) {
    return new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'es-AR' });
  }
  return null;
};

export const crearPreferencia = async (datosCompra) => {
  const { items, pedidoId, email, telefono } = datosCompra;

  if (import.meta.env.DEV) {
    return {
      id: `MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      init_point: `/pedido/exito?pedido=${pedidoId}`,
      sandbox_init_point: `/pedido/exito?pedido=${pedidoId}`,
    };
  }

  const response = await fetch(`/api/mercadopago/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, pedidoId, email, telefono, costoEnvio: datosCompra.costoEnvio || 0 })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error del backend de pago:', errorText);
    throw new Error('No se pudo procesar el pago. Intentá de nuevo en unos minutos.');
  }

  return await response.json();
};

export const abrirCheckout = (preferenceId, initPoint) => {
  if (initPoint) {
    window.location.href = initPoint;
  } else {
    const mp = initMercadoPago();
    if (mp) mp.checkout({ preference: { id: preferenceId }, autoOpen: true });
  }
};

export const validarConfiguracion = () => {
  if (!MP_PUBLIC_KEY) { console.error('VITE_MP_PUBLIC_KEY no configurada'); return false; }
  return true;
};

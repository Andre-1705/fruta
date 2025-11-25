// ============================================
// CONFIGURACIÓN DE MERCADOPAGO
// ============================================

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;
const MP_ACCESS_TOKEN = import.meta.env.VITE_MP_ACCESS_TOKEN;

// Inicializar SDK de MercadoPago (frontend)
export const initMercadoPago = () => {
  if (typeof window !== 'undefined' && window.MercadoPago) {
    const mp = new window.MercadoPago(MP_PUBLIC_KEY, {
      locale: 'es-AR'
    });
    return mp;
  }
  return null;
};

// Crear preferencia de pago (esto debe hacerse desde el backend en producción)
// Por ahora lo hacemos desde el frontend pero DEBE moverse a una función serverless
export const crearPreferencia = async (datosCompra) => {
  try {
    const { items, pedidoId, email, telefono } = datosCompra;

    // IMPORTANTE: En producción, esto debe ser una llamada a tu backend/API
    // Nunca exponer el ACCESS_TOKEN en el frontend
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: items.map(item => ({
          id: item.id,
          title: item.nombre,
          description: item.descripcion || 'Producto fresco',
          picture_url: item.imagen,
          category_id: 'food',
          quantity: item.cantidad,
          unit_price: Number(item.precio),
          currency_id: 'ARS'
        })),
        payer: {
          email: email,
          phone: {
            number: telefono
          }
        },
        external_reference: pedidoId, // ID del pedido en tu sistema
        notification_url: `${import.meta.env.VITE_PUBLIC_SITE_URL}/api/mercadopago/webhook`, // URL del webhook
        back_urls: {
          success: `${import.meta.env.VITE_PUBLIC_SITE_URL}/pedido/exito?pedido=${pedidoId}`,
          failure: `${import.meta.env.VITE_PUBLIC_SITE_URL}/pedido/error?pedido=${pedidoId}`,
          pending: `${import.meta.env.VITE_PUBLIC_SITE_URL}/pedido/pendiente?pedido=${pedidoId}`
        },
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_types: [],
          installments: 12 // Hasta 12 cuotas
        },
        shipments: {
          cost: datosCompra.costoEnvio || 0,
          mode: 'not_specified'
        },
        statement_descriptor: 'FRUTA-STORE'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear preferencia de pago');
    }

    const preferencia = await response.json();
    return preferencia;
  } catch (error) {
    console.error('Error en crearPreferencia:', error);
    throw error;
  }
};

// Abrir checkout de MercadoPago
export const abrirCheckout = (preferenceId) => {
  const mp = initMercadoPago();
  if (!mp) {
    console.error('MercadoPago SDK no está cargado');
    return;
  }

  mp.checkout({
    preference: {
      id: preferenceId
    },
    autoOpen: true
  });
};

// Verificar estado de pago (consultar desde backend idealmente)
export const verificarPago = async (paymentId) => {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al verificar pago');
    }

    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error('Error en verificarPago:', error);
    throw error;
  }
};

// Mapear estados de MercadoPago a nuestro sistema
export const mapearEstadoPago = (mpStatus) => {
  const mapaEstados = {
    'approved': 'aprobado',
    'pending': 'pendiente',
    'in_process': 'pendiente',
    'rejected': 'rechazado',
    'cancelled': 'rechazado',
    'refunded': 'reembolsado',
    'charged_back': 'reembolsado'
  };

  return mapaEstados[mpStatus] || 'pendiente';
};

// Helper: Validar configuración
export const validarConfiguracion = () => {
  if (!MP_PUBLIC_KEY) {
    console.error('⚠️ VITE_MP_PUBLIC_KEY no está configurada');
    return false;
  }
  if (!MP_ACCESS_TOKEN) {
    console.error('⚠️ VITE_MP_ACCESS_TOKEN no está configurada (necesaria para backend)');
    return false;
  }
  return true;
};

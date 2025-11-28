// ============================================
// CONFIGURACIÓN DE MERCADOPAGO
// ============================================

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

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

    console.log('📤 Enviando datos a create-preference:', { items, pedidoId, email, telefono });

    // Llamar a nuestra API serverless en Vercel (token seguro en el backend)
    const response = await fetch(`/api/mercadopago/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, pedidoId, email, telefono, costoEnvio: datosCompra.costoEnvio || 0 })
    });

    console.log('📥 Respuesta create-preference:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response body:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${errorText}`);
    }

    const preferencia = await response.json();
    console.log('✅ Preferencia creada:', preferencia);
    return preferencia;
  } catch (error) {
    console.error('❌ Error en crearPreferencia:', error);
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
    const response = await fetch(`/api/mercadopago/verificar-pago?payment_id=${encodeURIComponent(paymentId)}`);

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
  return true;
};

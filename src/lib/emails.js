// ============================================
// SERVICIO DE EMAILS TRANSACCIONALES
// Usando Resend (alternativa: SendGrid, AWS SES)
// ============================================

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || 'pedidos@fruta-ecommerce.com';

// Enviar email de confirmación de pedido
export const enviarEmailConfirmacion = async (pedido, items) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: pedido.email_destinatario,
        subject: `Pedido confirmado #${pedido.numero_pedido}`,
        html: generarHTMLConfirmacion(pedido, items)
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar email');
    }

    const data = await response.json();
    console.log('Email de confirmación enviado:', data.id);
    return data;
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error);
    // No lanzar error para no bloquear el proceso de compra
  }
};

// Enviar email de actualización de estado
export const enviarEmailActualizacionEstado = async (pedido, nuevoEstado) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: pedido.email_destinatario,
        subject: `Actualización de pedido #${pedido.numero_pedido}`,
        html: generarHTMLActualizacion(pedido, nuevoEstado)
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar email');
    }

    const data = await response.json();
    console.log('Email de actualización enviado:', data.id);
    return data;
  } catch (error) {
    console.error('Error al enviar email de actualización:', error);
  }
};

// Enviar email de pago aprobado
export const enviarEmailPagoAprobado = async (pedido, items) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: pedido.email_destinatario,
        subject: `¡Pago aprobado! Pedido #${pedido.numero_pedido}`,
        html: generarHTMLPagoAprobado(pedido, items)
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar email');
    }

    const data = await response.json();
    console.log('Email de pago aprobado enviado:', data.id);
    return data;
  } catch (error) {
    console.error('Error al enviar email de pago aprobado:', error);
  }
};

// ============================================
// TEMPLATES HTML
// ============================================

const generarHTMLConfirmacion = (pedido, items) => {
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.imagen_producto}" alt="${item.nombre_producto}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.nombre_producto}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.precio_unitario.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${item.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="background-color: #157347; padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">¡Pedido Recibido!</h1>
                </td>
              </tr>

              <!-- Contenido -->
              <tr>
                <td style="padding: 30px;">
                  <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
                    Hola <strong>${pedido.nombre_destinatario}</strong>,
                  </p>
                  <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
                    Hemos recibido tu pedido <strong>#${pedido.numero_pedido}</strong> correctamente.
                  </p>
                  <p style="font-size: 14px; color: #666; margin: 0 0 30px 0;">
                    Una vez que confirmemos tu pago, comenzaremos a preparar tu pedido.
                  </p>

                  <!-- Resumen del pedido -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td colspan="5" style="background-color: #f8f9fa; padding: 15px; font-weight: bold; border-bottom: 2px solid #157347;">
                        Detalle del Pedido
                      </td>
                    </tr>
                    <tr style="background-color: #f8f9fa; font-weight: bold; font-size: 12px;">
                      <td style="padding: 10px;">Imagen</td>
                      <td style="padding: 10px;">Producto</td>
                      <td style="padding: 10px; text-align: center;">Cant.</td>
                      <td style="padding: 10px; text-align: right;">Precio</td>
                      <td style="padding: 10px; text-align: right;">Subtotal</td>
                    </tr>
                    ${itemsHTML}
                    <tr>
                      <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                      <td style="padding: 10px; text-align: right;">$${pedido.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Envío:</td>
                      <td style="padding: 10px; text-align: right;">${pedido.costo_envio > 0 ? '$' + pedido.costo_envio.toFixed(2) : 'GRATIS'}</td>
                    </tr>
                    <tr style="background-color: #f8f9fa;">
                      <td colspan="4" style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #157347;">TOTAL:</td>
                      <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #157347;">$${pedido.total.toFixed(2)}</td>
                    </tr>
                  </table>

                  <!-- Datos de envío -->
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #157347;">Datos de Envío</h3>
                    <p style="margin: 5px 0; color: #333;"><strong>Nombre:</strong> ${pedido.nombre_destinatario}</p>
                    <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${pedido.email_destinatario}</p>
                    <p style="margin: 5px 0; color: #333;"><strong>Teléfono:</strong> ${pedido.telefono_destinatario || 'No proporcionado'}</p>
                    <p style="margin: 5px 0; color: #333;"><strong>Dirección:</strong> ${pedido.direccion_envio}</p>
                    ${pedido.ciudad ? `<p style="margin: 5px 0; color: #333;"><strong>Ciudad:</strong> ${pedido.ciudad}, ${pedido.provincia || ''}</p>` : ''}
                    ${pedido.codigo_postal ? `<p style="margin: 5px 0; color: #333;"><strong>Código Postal:</strong> ${pedido.codigo_postal}</p>` : ''}
                  </div>

                  <p style="font-size: 14px; color: #666; margin: 30px 0 0 0;">
                    Te enviaremos otro email cuando tu pedido sea enviado.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    Fruta E-commerce | Frutas y verduras frescas a domicilio
                  </p>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                    Este es un email automático, por favor no respondas.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const generarHTMLPagoAprobado = (pedido, items) => {
  return generarHTMLConfirmacion(pedido, items).replace(
    'Hemos recibido tu pedido',
    '¡Tu pago ha sido aprobado! Estamos preparando tu pedido'
  ).replace(
    'Una vez que confirmemos tu pago',
    'Tu pedido será enviado en las próximas 24-48 horas'
  );
};

const generarHTMLActualizacion = (pedido, nuevoEstado) => {
  const mensajes = {
    'pagado': 'Tu pago ha sido confirmado. Comenzaremos a preparar tu pedido.',
    'procesando': 'Estamos preparando tu pedido con mucho cariño.',
    'enviado': '¡Tu pedido está en camino! Pronto llegará a tu domicilio.',
    'entregado': '¡Tu pedido ha sido entregado! Esperamos que lo disfrutes.',
    'cancelado': 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.'
  };

  const emojis = {
    'pagado': '✅',
    'procesando': '📦',
    'enviado': '🚚',
    'entregado': '🎉',
    'cancelado': '❌'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Actualización de Pedido</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background-color: #157347; padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 32px;">${emojis[nuevoEstado] || '📝'}</h1>
                  <h2 style="color: white; margin: 10px 0 0 0;">Actualización de Pedido</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <p style="font-size: 16px; color: #333; margin: 0 0 10px 0;">
                    Hola <strong>${pedido.nombre_destinatario}</strong>,
                  </p>
                  <p style="font-size: 18px; color: #157347; font-weight: bold; margin: 20px 0;">
                    ${mensajes[nuevoEstado] || 'Tu pedido ha sido actualizado.'}
                  </p>
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <p style="margin: 5px 0; color: #666;">Número de pedido:</p>
                    <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #157347;">#${pedido.numero_pedido}</p>
                  </div>
                  ${nuevoEstado === 'enviado' ? `
                    <p style="font-size: 14px; color: #666;">
                      Tiempo estimado de entrega: 2-3 días hábiles
                    </p>
                  ` : ''}
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    Fruta E-commerce | Gracias por tu compra
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Validar configuración
export const validarConfiguracionEmails = () => {
  if (!RESEND_API_KEY) {
    console.warn('⚠️ VITE_RESEND_API_KEY no está configurada. Los emails no se enviarán.');
    return false;
  }
  return true;
};

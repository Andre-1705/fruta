# 📧 TICKET SOPORTE MERCADOPAGO

**Fecha de envío:** 30 de noviembre de 2025  
**Estado:** ⏳ Pendiente respuesta  
**Cuenta:** mariaandreacastilloarregui@gmail.com  
**Aplicación:** app_fruta

---

## Asunto del ticket

**Error 403 PolicyAgent al crear preferencia de pago con SDK oficial (credenciales TEST)**

---

## Mensaje completo

Hola equipo de MercadoPago,

Estoy integrando Checkout Pro en mi aplicación web usando el SDK oficial de Node.js y credenciales de ambiente TEST. Al intentar crear una preferencia de pago, recibo el siguiente error:

```json
{
  "error": "Internal error",
  "details": "At least one policy returned UNAUTHORIZED."
}
```

### DATOS DE LA CUENTA
- **Email:** mariaandreacastilloarregui@gmail.com
- **Aplicación:** app_fruta
- **Dominio:** https://fruta-fawn.vercel.app
- **País/Site ID:** MLA para Argentina

### DATOS TÉCNICOS
- **Timestamp del error:** 30 de noviembre de 2025, ~19:00 UTC-3
- **Endpoint:** POST /checkout/preferences (via SDK `mercadopago` npm, método `Preference.create()`)
- **Runtime:** Node.js en Vercel serverless functions
- **Token usado:** TEST credentials (credenciales de prueba)
- **Public Key:** TEST credentials

### PAYLOAD ENVIADO (ejemplo)
```json
{
  "items": [
    {
      "title": "Mora",
      "quantity": 3,
      "unit_price": 100,
      "currency_id": "ARS"
    }
  ],
  "back_urls": {
    "success": "https://fruta-fawn.vercel.app/pedido/exito",
    "failure": "https://fruta-fawn.vercel.app/checkout",
    "pending": "https://fruta-fawn.vercel.app/checkout"
  },
  "notification_url": "https://fruta-fawn.vercel.app/api/mercadopago/webhook",
  "auto_return": "approved"
}
```

### ACCIONES REALIZADAS
- ✅ SDK actualizado a última versión
- ✅ Configuración de MercadoPagoConfig con access token TEST
- ✅ Runtime migrado de edge a Node.js
- ✅ Webhook configurado y accesible públicamente
- ✅ Dominio en producción (Vercel): https://fruta-fawn.vercel.app
- ✅ Verificado formato de credenciales (sin espacios ni caracteres ocultos)

### SOLICITUD
Necesito orientación sobre:

1. **¿Qué política específica está bloqueando la creación de preferencias?**
2. **¿Requiere mi cuenta/aplicación alguna habilitación o verificación adicional para usar Checkout Pro en ambiente TEST?**
3. **¿Hay algún proceso de activación pendiente para poder crear preferencias?**

La integración técnica está completa y funcionando con modo simulado. Solo necesito habilitar el flujo real con MercadoPago.

**Adjuntos que incluyo:**
- Captura del error 403 en Network tab (Headers + Response)
- Captura de configuración de credenciales en panel de desarrolladores
- Captura del estado de la aplicación

Quedo atento a su respuesta. Muchas gracias.

---

## Dónde enviar el ticket

### Opción 1: Centro de ayuda (recomendado)
🔗 https://www.mercadopago.com.ar/ayuda
- Ir a "Soporte" → "Contactar"
- Categoría: "Integraciones y API"
- Subcategoría: "Checkout Pro"
- Copiar y pegar el mensaje de arriba

### Opción 2: Panel de desarrolladores
🔗 https://www.mercadopago.com.ar/developers/panel/support
- Login con tu cuenta
- "Crear ticket" → pegar mensaje

### Opción 3: Email directo (según región)
📧 developers@mercadopago.com
- Asunto: mismo que arriba
- Cuerpo: copiar mensaje completo

---

## Adjuntos necesarios

### 1. Captura del error 403
- Abrir DevTools (F12) → Network tab
- Filtrar por "create-preference"
- Click en el request fallido
- Screenshot de:
  - Headers tab (completo)
  - Response tab (JSON del error)

### 2. Captura de credenciales
- Panel MP → Tus integraciones → app_fruta → Credenciales
- Screenshot mostrando:
  - Public Key TEST (puedes ocultar parte del token)
  - Access Token TEST (puedes ocultar parte)
  - Estado de la aplicación (activa/inactiva)

### 3. Captura del estado de cuenta
- Panel MP → Inicio
- Screenshot de cualquier alerta o aviso

---

## Estado actual (workaround)

Mientras esperamos respuesta de soporte:

✅ **Mock payments activo** (`MOCK_PAYMENTS=true` en Vercel)
- Checkout funciona con preferencias simuladas
- Pedidos se guardan correctamente en Supabase
- Experiencia de usuario completa (excepto pago real)
- Webhook configurado y listo para activarse

🔄 **Cuando soporte habilite la cuenta:**
1. Cambiar `MOCK_PAYMENTS=false` en Vercel
2. Redeploy
3. Probar con tarjetas de prueba MP
4. Verificar que webhook recibe notificaciones

---

## Respuesta esperada de soporte

Posibles resoluciones:
- Habilitar Checkout Pro en la cuenta TEST
- Indicar verificación KYC pendiente
- Confirmar configuración correcta de la aplicación
- Sugerir crear nueva aplicación si hay problema con la actual

**Tiempo estimado de respuesta:** 24-72 horas hábiles

---

**Creado:** 30 noviembre 2025  
**Última actualización:** 30 noviembre 2025

# 🚀 Guía de Implementación - Sistema de Pedidos y Pagos

## ✅ Archivos Creados

### 📊 Base de Datos (Supabase)
- `supabase-pedidos-schema.sql` - Tablas orders, order_items, order_status_history
- `supabase-productos-stock.sql` - Gestión de stock en productos

### 🔧 Contextos y Lógica
- `src/contexto/PedidosContexto.jsx` - CRUD de pedidos
- `src/lib/mercadopago.js` - Integración con MercadoPago
- `src/lib/emails.js` - Sistema de emails transaccionales (Resend)

### 🎨 Componentes UI
- `src/componentes/adminComponents/PedidosAdminPanel.jsx` - Panel admin de pedidos
- `src/componentes/adminComponents/PedidosAdminPanel.css` - Estilos del panel
- `src/pages/Checkout.jsx` - Página de checkout
- `src/pages/Checkout.css` - Estilos del checkout

### ⚙️ Configuración
- `.env.example` - Template de variables de entorno

---

## 📋 PASOS PARA IMPLEMENTAR

### 1️⃣ Ejecutar Scripts SQL en Supabase

**Paso 1.1:** Ve a tu proyecto en Supabase → SQL Editor

**Paso 1.2:** Ejecuta los scripts en este orden:

```sql
-- Primero: Actualizar productos con stock
-- Copia y pega el contenido de: supabase-productos-stock.sql

-- Segundo: Crear tablas de pedidos
-- Copia y pega el contenido de: supabase-pedidos-schema.sql
```

**Paso 1.3:** Verifica que las tablas se crearon correctamente:
- `products` (debe tener nuevas columnas: stock, stock_minimo, disponible)
- `orders`
- `order_items`
- `order_status_history`

**Paso 1.4:** Actualiza el stock de tus productos existentes:
```sql
UPDATE products 
SET stock = 100, stock_minimo = 10, disponible = true
WHERE stock IS NULL;
```

---

### 2️⃣ Configurar Variables de Entorno

**Paso 2.1:** Copia `.env.example` a `.env`:
```bash
copy .env.example .env
```

**Paso 2.2:** Configura MercadoPago:
1. Ve a https://www.mercadopago.com.ar/developers
2. Crea una aplicación
3. Obtén tus credenciales de TEST:
   - Public Key → `VITE_MP_PUBLIC_KEY`
   - Access Token → `VITE_MP_ACCESS_TOKEN`

**Paso 2.3:** Configura Resend (emails):
1. Crea cuenta en https://resend.com
2. Verifica tu dominio (o usa el dominio de prueba)
3. Obtén tu API Key → `VITE_RESEND_API_KEY`
4. Configura `VITE_FROM_EMAIL` (ej: pedidos@tudominio.com)

**Paso 2.4:** Actualiza `VITE_PUBLIC_SITE_URL` con tu URL de Vercel

**Ejemplo de .env completo:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_ADMIN_EMAIL=admin@fruta.com

VITE_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

VITE_RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
VITE_FROM_EMAIL=pedidos@tudominio.com

VITE_PUBLIC_SITE_URL=https://tu-app.vercel.app
```

---

### 3️⃣ Configurar Variables en Vercel

**Paso 3.1:** Ve a tu proyecto en Vercel → Settings → Environment Variables

**Paso 3.2:** Agrega TODAS las variables de .env

**Paso 3.3:** Redeploy desde Vercel Dashboard o:
```bash
git push origin master
```

---

### 4️⃣ Instalar Dependencias (si es necesario)

```bash
npm install
```

No se requieren nuevas dependencias, todo usa fetch nativo.

---

### 5️⃣ Probar Localmente

```bash
npm run dev
```

**Flujo de prueba:**
1. Agrega productos al carrito
2. Ve a `/checkout`
3. Completa el formulario
4. Click en "Pagar con MercadoPago"
5. Se abre el checkout de MercadoPago (modo TEST)
6. Usa tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

**Tarjetas de prueba:**
- ✅ APROBADA: 5031 7557 3453 0604 | CVV: 123 | Venc: 11/25
- ❌ RECHAZADA: 5031 4332 1540 6351 | CVV: 123 | Venc: 11/25

---

## 🔐 SEGURIDAD - MUY IMPORTANTE

### ⚠️ NUNCA hacer en producción:

1. **Crear preferencias desde el frontend**
   - El archivo `mercadopago.js` tiene una función `crearPreferencia()`
   - Esto DEBE moverse a un backend/API
   - Actualmente expone el `ACCESS_TOKEN` en el frontend (solo para desarrollo)

### ✅ Solución para producción:

**Opción 1: Vercel Serverless Functions**

Crear `api/mercadopago/create-preference.js`:
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, pedidoId, email, telefono, costoEnvio } = req.body;

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` // Sin VITE_
    },
    body: JSON.stringify({
      items: items.map(item => ({
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: item.precio,
        currency_id: 'ARS'
      })),
      external_reference: pedidoId,
      // ... resto de la config
    })
  });

  const data = await response.json();
  return res.status(200).json(data);
}
```

**Opción 2: Netlify Functions**
- Similar a Vercel, crear función serverless

**Opción 3: Backend separado (Node.js/Express)**
- Más robusto para escalar

---

## 🔔 Webhook de MercadoPago

Para recibir notificaciones de pagos, debes crear un endpoint:

**Ejemplo: `api/mercadopago/webhook.js`**
```javascript
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data } = req.body;

  if (type === 'payment') {
    const paymentId = data.id;
    
    // Consultar el pago en MercadoPago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    });
    
    const payment = await mpResponse.json();
    const pedidoId = payment.external_reference;
    const estado = payment.status; // approved, rejected, pending

    // Actualizar pedido en Supabase
    await supabase
      .from('orders')
      .update({
        estado_pago: estado === 'approved' ? 'aprobado' : 'rechazado',
        mp_payment_id: paymentId,
        fecha_pago: estado === 'approved' ? new Date().toISOString() : null
      })
      .eq('id', pedidoId);

    // Enviar email si fue aprobado
    if (estado === 'approved') {
      // Llamar a función de email
    }
  }

  return res.status(200).json({ received: true });
}
```

Luego configura la URL del webhook en MercadoPago:
```
https://tu-sitio.vercel.app/api/mercadopago/webhook
```

---

## 📧 Configurar Emails

### Con Resend (Recomendado)

1. Verifica tu dominio en Resend
2. Si no tienes dominio, usa el dominio de prueba: `onboarding@resend.dev`
3. Los emails se envían automáticamente cuando:
   - Se crea un pedido (confirmación)
   - Se aprueba el pago
   - Se cambia el estado del pedido

### Alternativa: SendGrid

Si prefieres SendGrid, cambia en `src/lib/emails.js`:
```javascript
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SENDGRID_API_KEY}`
  },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: pedido.email_destinatario }],
      subject: `Pedido confirmado #${pedido.numero_pedido}`
    }],
    from: { email: FROM_EMAIL },
    content: [{ type: 'text/html', value: htmlContent }]
  })
});
```

---

## 🧪 Testing

### Flujo completo de prueba:

1. **Crear pedido:**
   - Agrega productos
   - Ve a checkout
   - Completa formulario
   - Click "Pagar"

2. **Verificar en Supabase:**
   - Tabla `orders` debe tener el pedido con estado "pendiente"
   - Tabla `order_items` debe tener los productos

3. **Simular pago:**
   - En el checkout de MercadoPago (TEST)
   - Usa tarjeta de prueba aprobada
   - Completa el pago

4. **Webhook actualiza pedido:**
   - Estado cambia a "pagado"
   - Stock se descuenta automáticamente
   - Se envía email de confirmación

5. **Admin gestiona pedido:**
   - Ve a `/admin/pedidos`
   - Cambia estado a "enviado"
   - Cliente recibe email de actualización

---

## 🎯 Rutas Nuevas

- `/checkout` - Página de finalizar compra
- `/admin/pedidos` - Panel admin de gestión de pedidos

---

## 📊 Validación de Stock

El sistema valida automáticamente:
- ✅ Stock disponible antes de crear pedido
- ✅ Descuenta stock al aprobar pago
- ✅ Restaura stock si se cancela pedido
- ✅ Bloquea compra si stock insuficiente
- ✅ Marca producto como no disponible si stock = 0

---

## 🆘 Troubleshooting

### Error: "MercadoPago SDK no está cargado"
- Verifica que el script esté en `index.html`
- Recarga la página

### Error: "Access Token inválido"
- Verifica que el token sea de TEST (empieza con TEST-)
- No uses el token de producción aún

### Error al crear pedido: "Stock insuficiente"
- Actualiza el stock en Supabase:
```sql
UPDATE products SET stock = 100 WHERE id = 'uuid-del-producto';
```

### Emails no se envían
- Verifica que `VITE_RESEND_API_KEY` esté configurada
- Chequea en Resend Dashboard los logs de emails
- En desarrollo, los errores de email no bloquean el proceso

### Webhook no funciona
- Debe estar en HTTPS (Vercel lo provee automáticamente)
- Verifica la URL en MercadoPago Dashboard
- Chequea los logs en Vercel Functions

---

## 🚀 Próximos Pasos

1. ✅ Implementar todo lo anterior
2. 🔜 Crear función serverless para preferencias
3. 🔜 Configurar webhook correctamente
4. 🔜 Mover ACCESS_TOKEN a variables de servidor (sin VITE_)
5. 🔜 Testing exhaustivo con tarjetas de prueba
6. 🔜 Pasar a credenciales de PRODUCCIÓN de MercadoPago
7. 🔜 Implementar resto de features (envíos, analytics, etc.)

---

## 📞 Soporte

Si tienes problemas:
1. Chequea la consola del navegador
2. Chequea los logs de Vercel
3. Verifica las tablas en Supabase
4. Revisa el Dashboard de MercadoPago

---

¡Todo listo para empezar a vender! 🎉

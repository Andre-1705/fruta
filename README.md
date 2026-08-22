# Fruta E-commerce

Tienda online de frutas frescas con pagos via MercadoPago, gestión de stock y panel de administración.

## Stack

React 19 + Vite | Supabase | MercadoPago | Resend | Cloudinary | Vercel

## Inicio rápido

```bash
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

> Variables de entorno

|         Variable            |          Descripción             |
|-----------------------------|----------------------------------|
|VITE_SUPABASE_URL            | URL del proyecto Supabase        |
|VITE_SUPABASE_ANON_KEY       | Clave pública de Supabase        |
|SUPABASE_SERVICE_ROLE_KEY    | Clave de servicio (solo backend) |
|MP_ACCESS_TOKEN              | Token de MercadoPago             |
|MP_WEBHOOK_SECRET            | Secret del webhook de MercadoPago|
|RESEND_API_KEY               | Clave de API de Resend           |
|PUBLIC_SITE_URL              | URL del sitio en producción      |
|VITE_CLOUDINARY_FOLDER       | Carpeta de Cloudinary            |
|VITE_CLOUDINARY_UPLOAD_PRESET| Preset de subida Cloudinary      |

> Tarjetas de prueba MercadoPago

Aprobada: 5031 7557 3453 0604  | CVV: 123 | Venc: 11/25
Rechazada: 5031 4332 1540 6351 | CVV: 123 | Venc: 11/25

# 🍎 Fruta E-commerce - Sistema Completo

E-commerce de frutas frescas con pedidos, pagos (MercadoPago), stock automático y emails.

## ✨ Nuevo: Sistema de Pedidos

- ✅ Checkout completo con validación
- ✅ Pago con MercadoPago (hasta 12 cuotas)
- ✅ Gestión de stock automática
- ✅ Panel admin de pedidos
- ✅ Emails transaccionales (Resend)

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

## 📖 Documentación Completa

**👉 Lee [IMPLEMENTACION.md](IMPLEMENTACION.md)** para:
- Configurar base de datos (Supabase)
- Obtener credenciales de MercadoPago
- Configurar emails (Resend)
- Testing con tarjetas de prueba
- Deploy a producción

## 🧪 Testing Rápido

Tarjetas de prueba MercadoPago:
- ✅ **Aprobada:** `5031 7557 3453 0604` | CVV: 123 | Venc: 11/25
- ❌ **Rechazada:** `5031 4332 1540 6351` | CVV: 123 | Venc: 11/25

## 🛠️ Stack

React 19 + Vite | Supabase | MercadoPago | Resend | Cloudinary | Vercel

---

**Autor:** [@Andre-1705](https://github.com/Andre-1705)

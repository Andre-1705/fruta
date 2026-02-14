# 🍎 Fruta E-commerce - Sistema Completo

E-commerce de frutas frescas con pedidos, pagos (MercadoPago), stock automático y emails.

## ✨ Nuevo: Sistema de Pedidos

- ✅ Checkout completo con validación
- ✅ Pago con MercadoPago (hasta 12 cuotas)
- ✅ Gestión de stock automática
- ✅ Panel admin de pedidos
- ✅ Emails transaccionales (Resend)
- ✅ **Suite completa de tests (Vitest + RTL)**

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ver tests en el navegador
npm run test:ui
```

**Cobertura completa:**
- ✅ Contextos (Carrito, Auth, Pedidos)
- ✅ Componentes críticos (Checkout, Carrito, Formularios)
- ✅ Validaciones y utilidades
- ✅ APIs serverless
- ✅ CI/CD con GitHub Actions

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ver tests en el navegador
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

**👉 Lee [TESTING.md](TESTING.md)** para más detalles sobre testing.

## 📖 Documentación Completa

**👉 Lee [IMPLEMENTACION.md](IMPLEMENTACION.md)** para:
- Configurar base de datos (Supabase)
- Obtener credenciales de MercadoPago
- Configurar emails (Resend)
- Testing con tarjetas de prueba
- Deploy a producción

**🧪 Lee [TESTING.md](TESTING.md)** para:
- Ejecutar tests unitarios y de integración
- Ver cobertura de código
- Escribir nuevos tests
- Debugging de tests

**👉 Lee [TESTING.md](TESTING.md)** para:
- Ejecutar tests
- Escribir nuevos tests
- Ver cobertura de código
- CI/CD con GitHub Actions

## 🧪 Testing Rápido

Tarjetas de prueba MercadoPago: | **Vitest + RTL**
- ✅ **Aprobada:** `5031 7557 3453 0604` | CVV: 123 | Venc: 11/25
- ❌ **Rechazada:** `5031 4332 1540 6351` | CVV: 123 | Venc: 11/25

## 🛠️ Stack

React 19 + Vite | Supabase | MercadoPago | Resend | Cloudinary | Vercel

---

**Autor:** [@Andre-1705](https://github.com/Andre-1705)

# 🧪 Guía de Testing

## Configuración

Este proyecto usa **Vitest** como framework de testing, junto con **React Testing Library** para componentes.

### Dependencias instaladas:
- ✅ Vitest - Framework de testing ultrarrápido
- ✅ @testing-library/react - Testing de componentes React
- ✅ @testing-library/jest-dom - Matchers adicionales
- ✅ @testing-library/user-event - Simulación de interacciones de usuario
- ✅ jsdom - Simulación del DOM
- ✅ @vitest/ui - Interfaz web para tests
- ✅ @vitest/coverage-v8 - Reportes de cobertura

## Scripts disponibles

```bash
# Ejecutar tests en modo watch (desarrollo)
npm test

# Ejecutar tests una vez (CI/CD)
npm run test:run

# Ejecutar tests con interfaz web
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

## Estructura de tests

```
src/test/
├── setup.js                    # Configuración global de tests
├── helpers/
│   └── renderWithProviders.jsx # Helper para renderizar con contextos
├── mocks/
│   └── supabase.js             # Mocks de Supabase
├── contexto/
│   ├── CarritoContexto.test.jsx
│   ├── AuthContexto.test.jsx
│   └── PedidosContexto.test.jsx
├── componentes/
│   ├── Carrito.test.jsx
│   ├── ItemDetail.test.jsx
│   └── Formulario.test.jsx
├── pages/
│   └── Checkout.test.jsx
├── utils/
│   └── validaciones.test.js
└── api/
    └── mercadopago.test.js
```

## Cobertura de testing

### ✅ Contextos (100%)
- **CarritoContexto** - Gestión del carrito de compras
  - Agregar/eliminar productos
  - Calcular totales
  - Persistencia en localStorage
  - Validación de stock

- **AuthContexto** - Autenticación de usuarios
  - Login/logout
  - Registro
  - Detección de admin
  - Manejo de errores

- **PedidosContexto** - Gestión de pedidos
  - Crear pedidos
  - Actualizar estados
  - Obtener historial

### ✅ Componentes críticos
- **Checkout** - Proceso de finalización de compra
  - Validación de formulario
  - Integración con MercadoPago
  - Cálculo de totales

- **Carrito** - Widget del carrito
  - Mostrar productos
  - Actualizar cantidades
  - Navegación a checkout

- **ItemDetail** - Detalle de producto
  - Mostrar información
  - Agregar al carrito
  - Validación de stock

- **Formulario** - Formulario de contacto
  - Validación de campos
  - Envío de datos

### ✅ Validaciones y utilidades
- Validación de email
- Validación de teléfono
- Formateo de precios
- Cálculos de descuentos
- Normalización de texto
- Generación de números de pedido

### ✅ APIs serverless
- **create-preference** - Creación de preferencias de pago
- **verificar-pago** - Verificación de estado de pago
- **webhook** - Procesamiento de notificaciones

## Ejemplos de uso

### Test básico de componente

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MiComponente from './MiComponente';

describe('MiComponente', () => {
  it('debe renderizar correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument();
  });
});
```

### Test con contextos

```javascript
import { renderWithProviders } from '../test/helpers/renderWithProviders';

it('debe usar el carrito', () => {
  renderWithProviders(<MiComponente />, { 
    withCarrito: true,
    withAuth: true 
  });
  // ... assertions
});
```

### Test de interacción de usuario

```javascript
import userEvent from '@testing-library/user-event';

it('debe permitir escribir en un input', async () => {
  const user = userEvent.setup();
  render(<Formulario />);
  
  const input = screen.getByLabelText(/nombre/i);
  await user.type(input, 'Juan Pérez');
  
  expect(input).toHaveValue('Juan Pérez');
});
```

### Test con mocks

```javascript
import { vi } from 'vitest';

const mockFn = vi.fn();

it('debe llamar a la función mock', () => {
  mockFn('test');
  expect(mockFn).toHaveBeenCalledWith('test');
});
```

## Convenciones

1. **Nombres de archivos**: `*.test.js` o `*.test.jsx`
2. **Ubicación**: Mismo directorio que el archivo original o en `src/test/`
3. **Estructura**: `describe` > `it` > `expect`
4. **Mocks**: Usar `vi.mock()` para módulos externos
5. **Cleanup**: Automático con `afterEach(cleanup)`

## Debugging tests

```bash
# Ver tests en el navegador
npm run test:ui

# Ejecutar un solo test
npm test -- nombre-del-test

# Ver solo tests que fallaron
npm test -- --reporter=verbose --run
```

## CI/CD

Los tests se ejecutan automáticamente en cada push/PR mediante GitHub Actions:
- ✅ Ejecuta todos los tests
- ✅ Genera reporte de cobertura
- ✅ Valida el build
- ✅ Audita seguridad

## Reporte de cobertura

Después de ejecutar `npm run test:coverage`, abre:
```
coverage/index.html
```

## Próximos tests a agregar

- [ ] Tests E2E con Playwright
- [ ] Tests de performance
- [ ] Tests de accesibilidad (a11y)
- [ ] Visual regression testing

## Recursos

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

**Última actualización:** Febrero 2026

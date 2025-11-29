# Diagnóstico MercadoPago 403 PolicyAgent

## Error actual
```json
{
  "error": "MercadoPago API error",
  "status": 403,
  "details": {
    "code": "PA_UNAUTHORIZED_RESULT_FROM_POLICIES",
    "status": 403,
    "blocked_by": "PolicyAgent",
    "message": "At least one policy returned UNAUTHORIZED."
  }
}
```

## Credenciales configuradas
- `MP_ACCESS_TOKEN`: TEST-... (credenciales de prueba)
- `VITE_MP_PUBLIC_KEY`: TEST-... (credenciales de prueba)

## Causas posibles del 403 PolicyAgent

### 1. Cuenta en revisión/bloqueada
El PolicyAgent de MercadoPago bloquea cuentas que están:
- En proceso de verificación
- Marcadas como sospechosas
- Sin completar datos de cuenta

**Solución:** Ir a https://www.mercadopago.com.ar/developers/panel → revisar si hay alertas o cuenta suspendida.

### 2. Aplicación sin configurar correctamente
- Falta agregar URL de redirección en el panel de desarrolladores
- Aplicación no tiene permisos para crear preferencias
- Aplicación está en modo "no productiva" sin credenciales TEST válidas

**Solución:** 
1. Panel de desarrolladores → Tus aplicaciones
2. Editar aplicación → URLs de redireccionamiento
3. Agregar: `https://fruta-fawn.vercel.app/pedido/exito`

### 3. País/IP restringida
MercadoPago puede bloquear requests desde IPs fuera de Argentina o regiones restringidas.

**Solución:** Verificar que la cuenta sea de Argentina y que Vercel use región compatible.

### 4. Credenciales TEST mal copiadas
Espacios, saltos de línea o caracteres ocultos en las credenciales.

**Solución:** 
1. Ir a https://www.mercadopago.com.ar/developers/panel/credentials
2. Copiar nuevamente las credenciales TEST
3. Eliminar y recrear variables en Vercel (no editar, eliminar y crear nuevas)

### 5. Falta activar cuenta de prueba
Las credenciales TEST necesitan que se cree una cuenta de usuario de prueba para comprador/vendedor.

**Solución:**
1. Panel → Cuentas de prueba
2. Crear usuario vendedor (seller) y comprador (buyer)
3. Usar Access Token del usuario vendedor

## Pasos de diagnóstico recomendados

### Paso 1: Verificar estado de cuenta
```
1. Ir a: https://www.mercadopago.com.ar/developers/panel
2. Verificar si hay alertas rojas o amarillas
3. Revisar sección "Mis aplicaciones" → estado
```

### Paso 2: Probar credenciales con curl
```bash
curl -X POST \
  https://api.mercadopago.com/checkout/preferences \
  -H 'Authorization: Bearer TEST-TU-TOKEN-AQUI' \
  -H 'Content-Type: application/json' \
  -d '{
    "items": [
      {
        "title": "Test",
        "quantity": 1,
        "unit_price": 100
      }
    ]
  }'
```

Si da 403 → problema con la cuenta/credenciales
Si da 200 → problema con la configuración de Vercel

### Paso 3: Crear nueva aplicación
```
1. Panel → Tus aplicaciones → Crear aplicación
2. Nombre: "Fruta Store Test"
3. Modelo de negocio: E-commerce
4. Copiar NUEVAS credenciales TEST
5. Configurar en Vercel
```

### Paso 4: Contactar soporte
Si nada funciona, ticket a soporte con:
- User ID de la cuenta
- Application ID
- Timestamp del error (ver logs Vercel)
- Screenshot del error 403
- Confirmación que son credenciales TEST

## Solución temporal (actual)
✅ Usar `MOCK_PAYMENTS=true` para demo/desarrollo sin MercadoPago real.

## Para seguimiento
- Fecha inicio problema: 29/11/2025
- Cuenta MP: [TU EMAIL MP]
- Application ID: [ID de la app]

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Entorno y APIs (MockAPI + imgbb)

La app puede cargar productos desde una API remota (MockAPI) y subir imágenes a imgbb. Configura el archivo `.env` (variables de Vite deben empezar con `VITE_`):

```dotenv
VITE_MOCKAPI_BASE=https://tu-subdominio.mockapi.io/api/v1
VITE_IMGBB_API_KEY=tu_api_key_de_imgbb
```

- `VITE_MOCKAPI_BASE`: base de tu API. El contexto consulta `${VITE_MOCKAPI_BASE}/productos`.
- `VITE_IMGBB_API_KEY`: clave para subir imágenes a imgbb.

Si `VITE_MOCKAPI_BASE` no está definido, la app hace fallback al JSON local en `public/data/productosArray.json` sólo para lectura.

### Flujo de administración

- Inicia sesión como admin y entra al panel de productos.
- Al crear/editar puedes:
  - Pegar una URL de imagen (campo `img`), o
  - Subir un archivo: se sube a imgbb y se guarda la URL devuelta en el producto.

Los cambios de productos (crear/editar/eliminar) se realizan contra MockAPI cuando está configurado.

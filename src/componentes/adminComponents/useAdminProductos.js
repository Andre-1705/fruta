import { useContext, useState } from 'react';
import { ProductosContexto } from '../../contexto/ProductosContexto.jsx';

// Hook para CRUD de productos con upload de imágenes a Cloudinary (unsigned preset)
// Cloudinary ofrece transformaciones automáticas (resize, crop, format) y mejor CDN que imgbb

export function useAdminProductos() {
  const { agregarProducto, actualizarProducto, eliminarProducto, usarApiRemota } = useContext(ProductosContexto);
  const [subiendo, setSubiendo] = useState(false);

  const uploadToCloudinary = async (file) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER;

    if (!CLOUD_NAME) {
      throw new Error('Falta VITE_CLOUDINARY_CLOUD_NAME en el entorno');
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    if (FOLDER) formData.append('folder', FOLDER);

    try {
      console.debug('[Cloudinary] Subiendo imagen', {
        cloud: CLOUD_NAME,
        preset: UPLOAD_PRESET,
        folder: FOLDER || '(sin carpeta)',
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size,
      });
    } catch { /* no-op for environments without console */ }

    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) {
      let detalle = '';
      try {
        const errJson = await res.json();
        detalle = errJson?.error?.message || JSON.stringify(errJson).substring(0,140);
      } catch {
        try { detalle = (await res.text()).substring(0,140); } catch { /* noop */ }
      }
      throw new Error(`Error subiendo imagen a Cloudinary (HTTP ${res.status}) ${detalle}`);
    }
    const data = await res.json();
    try {
      console.debug('[Cloudinary] Respuesta OK', { secure_url: data?.secure_url, public_id: data?.public_id });
    } catch { /* noop */ }
    const imageUrl = data?.secure_url;
    if (!imageUrl) throw new Error('Respuesta inválida de Cloudinary');
    return imageUrl;
  };

  const crearProducto = async (producto, file) => {
    if (!usarApiRemota) throw new Error('API remota no configurada');
    let payload = { ...producto };
    if (file) {
      setSubiendo(true);
      try {
        const url = await uploadToCloudinary(file);
        payload.img = url;
      } finally {
        setSubiendo(false);
      }
    }
    return agregarProducto(payload);
  };

  const editarProducto = async (id, producto, file) => {
    if (!usarApiRemota) throw new Error('API remota no configurada');
    let payload = { ...producto };
    try {
      console.debug('[AdminProductos] Editar producto', {
        id,
        conArchivo: Boolean(file),
        keys: Object.keys(payload || {}),
      });
    } catch { /* noop */ }
    if (file) {
      setSubiendo(true);
      try {
        const url = await uploadToCloudinary(file);
        payload.img = url;
      } finally {
        setSubiendo(false);
      }
    }
    const res = await actualizarProducto(id, payload);
    try { console.debug('[AdminProductos] Producto actualizado', { id, img: res?.img }); } catch { /* noop */ }
    return res;
  };

  return {
    crearProducto,
    editarProducto,
    eliminarProducto,
    subirImagenEnProgreso: subiendo,
    usarApiRemota,
  };
}

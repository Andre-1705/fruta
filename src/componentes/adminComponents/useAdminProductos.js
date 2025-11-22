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

    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Error subiendo imagen a Cloudinary');
    const data = await res.json();
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
    if (file) {
      setSubiendo(true);
      try {
        const url = await uploadToCloudinary(file);
        payload.img = url;
      } finally {
        setSubiendo(false);
      }
    }
    return actualizarProducto(id, payload);
  };

  return {
    crearProducto,
    editarProducto,
    eliminarProducto,
    subirImagenEnProgreso: subiendo,
    usarApiRemota,
  };
}

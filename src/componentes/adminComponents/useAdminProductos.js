import { useContext, useState } from 'react';
import { ProductosContexto } from '../../contexto/ProductosContexto.jsx';


//Obtiene la API key desde las variables de entorno.
//Crea un FormData con la imagen.
//Hace un POST a imgbb para subir la imagen.
//Devuelve la URL de la imagen subida.
//Si no hay API key o la respuesta es inválida, lanza errores claros.
//payload objeto que se enviará a la api al crear o editar un producto




export function useAdminProductos() {
  const { agregarProducto, actualizarProducto, eliminarProducto, usarApiRemota } = useContext(ProductosContexto);
  const [subiendo, setSubiendo] = useState(false);

  const uploadToImgbb = async (file) => {
    const API_KEY = import.meta?.env?.VITE_IMGBB_API_KEY;
    if (!API_KEY) throw new Error('Falta VITE_IMGBB_API_KEY en el entorno');
    const url = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Error subiendo imagen a imgbb');
    const data = await res.json();
    const imageUrl = data?.data?.url;
    if (!imageUrl) throw new Error('Respuesta inválida de imgbb');
    return imageUrl;
  };

  const crearProducto = async (producto, file) => {
    if (!usarApiRemota) throw new Error('API remota no configurada');
    let payload = { ...producto };
    if (file) {
      setSubiendo(true);
      try {
        const url = await uploadToImgbb(file);
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
        const url = await uploadToImgbb(file);
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

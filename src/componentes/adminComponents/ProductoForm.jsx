import React, { useState, useEffect } from 'react';

// Formulario reutilizable para crear / editar productos
// Props:
// initialData: objeto producto inicial para edición
// onSubmit: callback(producto)
// loading: boolean mientras guarda
// onCancel: callback opcional

export default function ProductoForm({ initialData = null, onSubmit, loading = false, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    img: '', // URL imgbb
    stock: '',
    descripcion: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        categoria: initialData.categoria || '',
        precio: String(initialData.precio || ''),
        img: initialData.img || '',
        stock: String(initialData.stock || ''),
        descripcion: initialData.descripcion || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones básicas
    if (!formData.nombre.trim()) return;
    if (!formData.precio || isNaN(Number(formData.precio))) return;
    onSubmit({
      ...initialData,
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock || 0),
    }, file);
  };

  return (
    <form onSubmit={handleSubmit} className="producto-form">
      <h3>{initialData ? 'Editar Producto' : 'Nuevo Producto'}</h3>
      <label>Nombre
        <input name="nombre" value={formData.nombre} onChange={handleChange} required />
      </label>
      <label>Categoría
        <input name="categoria" value={formData.categoria} onChange={handleChange} required />
      </label>
      <label>Precio
        <input name="precio" value={formData.precio} onChange={handleChange} required />
      </label>
      <label>Stock
        <input name="stock" value={formData.stock} onChange={handleChange} />
      </label>
      <label>Imagen (URL imgbb)
        <input name="img" value={formData.img} onChange={handleChange} />
      </label>
      <label>O subir archivo (se sube a imgbb)
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>
      <label>Descripción
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />
      </label>
      <div className="form-actions">
        <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancelar">Cancelar</button>
        )}
      </div>
    </form>
  );
}

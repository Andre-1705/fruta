import React, { useState, useEffect } from 'react';
import './ProductoForm.css';

// Formulario reutilizable para crear / editar productos
// Props:
// initialData: objeto producto inicial para edición
// onSubmit: callback(producto)
// loading: boolean mientras guarda
// onCancel: callback opcional

export default function ProductoForm({ initialData = null, onSubmit, loading = false, onCancel, onDelete, onResetToNew }) {
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

  const handleReset = () => {
    // Si estamos editando y existe callback para volver a modo nuevo, usarlo.
    if (initialData && onResetToNew) {
      onResetToNew();
      return;
    }
    setFormData({ nombre: '', categoria: '', precio: '', img: '', stock: '', descripcion: '' });
    setFile(null);
  };

  return (
    <div className="producto-form-wrapper">
      <form onSubmit={handleSubmit} className="producto-form-grid">
        <h3 className="form-titulo">{initialData ? 'Editar Producto' : 'Nuevo Producto'}</h3>
        <label className="campo">
          <span>Nombre</span>
          <input name="nombre" value={formData.nombre} onChange={handleChange} required />
        </label>
        <label className="campo">
          <span>Categoría</span>
          <input name="categoria" value={formData.categoria} onChange={handleChange} required />
        </label>
        <label className="campo">
          <span>Precio</span>
          <input name="precio" value={formData.precio} onChange={handleChange} required />
        </label>
        <label className="campo">
          <span>Stock</span>
          <input name="stock" value={formData.stock} onChange={handleChange} />
        </label>
        <div className="campo campo-imagen">
          <label className="subcampo">
            <span>Imagen (URL imgbb)</span>
            <input name="img" value={formData.img} onChange={handleChange} />
          </label>
          <label className="subcampo">
            <span>Subir archivo</span>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <label className="campo campo-descripcion">
          <span>Descripción</span>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />
        </label>

        <div className="acciones">
          <button type="submit" className="btn btn-guardar" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          {initialData && onDelete && (
            <button type="button" className="btn btn-eliminar" onClick={() => onDelete(initialData.id)}>Eliminar</button>
          )}
          <button type="button" className="btn btn-limpiar" onClick={handleReset}>{initialData ? 'Nuevo' : 'Limpiar'}</button>
          {onCancel && (
            <button type="button" className="btn btn-cancelar" onClick={onCancel}>Cancelar</button>
          )}
        </div>
      </form>
    </div>
  );
}

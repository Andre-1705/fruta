import React, { useState, useEffect } from 'react';
import './ClienteForm.css';

// Formulario reutilizable para crear / editar clientes
// Props:
// initialData: objeto cliente inicial para edición
// onSubmit: callback(cliente)
// loading: boolean mientras guarda
// onCancel: callback opcional
// onDelete: callback opcional para eliminar
// onResetToNew: callback opcional para volver a modo "crear"

export default function ClienteForm({
  initialData = null,
  onSubmit,
  loading = false,
  onCancel,
  onDelete,
  onResetToNew
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    notas: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        email: initialData.email || '',
        telefono: initialData.telefono || '',
        direccion: initialData.direccion || '',
        notas: initialData.notas || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    onSubmit({
      ...initialData,
      ...formData,
      nombre: formData.nombre.trim(),
      email: formData.email.trim() || null,
      telefono: formData.telefono.trim() || null,
      direccion: formData.direccion.trim() || null,
      notas: formData.notas.trim() || null,
    });
  };

  const handleReset = () => {
    if (initialData && onResetToNew) {
      onResetToNew();
      return;
    }
    setFormData({ nombre: '', email: '', telefono: '', direccion: '', notas: '' });
    setErrors({});
  };

  return (
    <div className="cliente-form-wrapper">
      <form onSubmit={handleSubmit} className="cliente-form-grid">
        <h3 className="form-titulo">{initialData ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>

        <label className="campo">
          <span>Nombre completo *</span>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Juan Pérez"
            maxLength={100}
          />
          {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
        </label>

        <label className="campo">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@mail.com"
            maxLength={100}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </label>

        <label className="campo">
          <span>Teléfono</span>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ej: +54 11 1234-5678"
            maxLength={30}
          />
        </label>

        <label className="campo campo-direccion">
          <span>Dirección</span>
          <textarea
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Calle, número, piso, localidad..."
            rows={2}
            maxLength={250}
          />
        </label>

        <label className="campo campo-notas">
          <span>Notas adicionales</span>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            placeholder="Información extra, preferencias, observaciones..."
            rows={3}
            maxLength={500}
          />
        </label>

        <div className="acciones">
          <button type="submit" className="btn btn-guardar" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          {initialData && onDelete && (
            <button
              type="button"
              className="btn btn-eliminar"
              onClick={() => onDelete(initialData.id)}
            >
              Eliminar
            </button>
          )}
          <button type="button" className="btn btn-limpiar" onClick={handleReset}>
            {initialData ? 'Nuevo' : 'Limpiar'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-cancelar" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Formulario.css';

// Manejo del formulario con estado local.
// Trabajamos con un solo estado que contiene un objeto con todos los campos del formulario
// y un función genérica para manejar los cambios con onChange en cada input
// y el manejo del envío de formularo con onSubmit en el form
// con preventDefault controlamos el envío del formulario a impedir que la página se recargue automáticamente al enviar el formulario

const Formulario = () => {
  const [user, setUser] = useState({ nombre: '', email: '', mensaje: '' });
  const [estado, setEstado] = useState({ loading: false, exito: '', error: '' });
  const formRef = useRef(null);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    // Honeypot anti bots
    const honey = formRef.current?.querySelector('input[name="website"]');
    if (honey && honey.value) {
      setEstado({ loading: false, exito: '', error: 'Detección bot.' });
      return;
    }

    // Validación simple adicional
    if (user.mensaje.length > 1000) {
      setEstado({ loading: false, exito: '', error: 'Mensaje demasiado largo (máx 1000 caracteres).' });
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setEstado({ loading: false, exito: '', error: 'EmailJS no configurado correctamente.' });
      return;
    }

    try {
      setEstado({ loading: true, exito: '', error: '' });
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY
      });
      setEstado({ loading: false, exito: 'Mensaje enviado. ¡Gracias por escribir!', error: '' });
      setUser({ nombre: '', email: '', mensaje: '' });
      if (formRef.current) formRef.current.reset();
    } catch {
      setEstado({ loading: false, exito: '', error: 'Error al enviar. Intenta nuevamente.' });
    }
  };

// Función para manejar el cambio en los inputs básicamente mejora la experiencia de usuario
// El usuario al ir escribiendo en los inpus va viendo lo que escribe name es el nombre
// del campo que se está modificando y value es el valor que se está escribiendo


  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setUser(previoUser => ({
      ...previoUser, [name]: value
    }));
  };

  return (
    <section id="formulario" className="formulario-seccion">
      <h2>Contactanos</h2>
      <p>Mandá fruta, te responderemos a la brevedad.</p>

      <form ref={formRef} className="seccion-formulario" onSubmit={manejarEnvio}>
        {/* Honeypot invisible */}
        <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        <div className="formulario-grupo">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={user.nombre}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="formulario-grupo">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={manejarCambio}
            required
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          />
        </div>

        <div className="formulario-grupo">
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={user.mensaje}
            onChange={manejarCambio}
            required
            maxLength={1000}
          ></textarea>
          <small style={{ display: 'block', marginTop: '4px' }}>{user.mensaje.length}/1000</small>
        </div>

        <button type="submit" disabled={estado.loading}>{estado.loading ? 'Enviando...' : 'Enviar'}</button>
        {estado.exito && <p style={{ color: 'green', marginTop: '0.5rem' }}>{estado.exito}</p>}
        {estado.error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{estado.error}</p>}
      </form>
    </section>
  );
};

export default Formulario;

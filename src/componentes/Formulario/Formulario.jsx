import React, { useState } from 'react';
import './Formulario.css';

// Manejo del formulario con estado local.
// Trabajamos con un solo estado que contiene un objeto con todos los campos del formulario
// y un función genérica para manejar los cambios con onChange en cada input
// y el manejo del envío de formularo con onSubmit en el form
// con preventDefault controlamos el envío del formulario a impedir que la página se recargue automáticamente al enviar el formulario

const Formulario = () => {
  const [user, setUser] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    alert(`Gracias ${user.nombre}, mandaste fruta de forma exitosa`);

    // Seteamos el estado a vacío después de enviar el formulario
    setUser({
      nombre: '',
      email: '',
      mensaje: ''
    });
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

      <form className="seccion-formulario" onSubmit={manejarEnvio}>
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
          ></textarea>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </section>
  );
};

export default Formulario;

import React, { useState } from 'react';
import './Formulario.css';

//Al usar constante más arrow function , garantizás que  no se pueda reasignar

const Formulario = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

// Definición del estado con useState paranombre, email y mensaje 
// Las constantes con sus useState inicializadas en cadena vacías 
// La constante que realizará el manejo de envío del formulario 
// Le paso el evento e como parámetro y accedo a preventdefault para evitar que se refresque la página 
// Muestro por pantalla mensaje de envío y el alerta por experiencia de usuario 

// Manejo del nombre con id, value, etc y manejo de la actualización del valor con onChange  
// Con target.value accedo al valor actualizado del imput mejorando la experiencia de usuario 



const manejarEnvio = (evento) => {
    evento.preventDefault();
    alert(`Gracias ${nombre}, mandaste fruta de forma exitosa`);

    // Se puede agregar lógica para enviar los datos al backend
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
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            required
          />
        </div>

      {/* Idem a nombre pero para email*/}

        <div className="formulario-grupo">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            required
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          />
        </div>

      {/*Idem a email pero para mensaje */}

        <div className="formulario-grupo">
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={mensaje}
            onChange={(evento) => setMensaje(evento.target.value)}
            required
          ></textarea>
        </div>

        {/* Botón de envío */}

        <button type="submit">Enviar</button>
      </form>
    </section>
  );
};
export default Formulario;
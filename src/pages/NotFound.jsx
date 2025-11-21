import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <section className="notfound">
      <div className="notfound-card">
        <h1>404</h1>
        <p>No encontramos la página que buscás.</p>
        <Link to="/" className="btn-volver">Volver al inicio</Link>
      </div>
    </section>
  );
};

export default NotFound;

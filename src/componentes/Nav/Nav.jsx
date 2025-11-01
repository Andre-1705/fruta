import './Nav.css';
import { Link } from 'react-router-dom';

//Este componente renderiza la barra de navegación
export const Nav = () => {
    return (
        <>
        {/* En nav, está pensado solo para secciones básicas de navegación */}
        <nav className="nav">
          <Link to="/">Inicio</Link>
          <Link to="/VistaNosotras">Nosotras</Link>
          <Link to="/VistaProductos">Productos</Link>
          <Link to="/VistaCarrito">Carrito</Link>
          <Link to="/VistaContacto">Contacto</Link>
          <Link to="/Registrate">Registrate</Link>
        </nav>
        
        {/* Nav secundario para categorías */}
        <nav className="nav-categorias-wrapper">
          <h2 className="categorias-titulo">Seleccioná por categoría</h2>
          <div className="nav-categorias">
            <Link to="/categoria/Cítricos">Cítricos</Link>
            <Link to="/categoria/Seco">Frutos Secos</Link>
            <Link to="/categoria/Tropicales">Tropicales</Link>
          </div>
        </nav>
        </>
    );
};

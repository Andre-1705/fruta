import './Nav.css';
import { Link } from 'react-router-dom';

// Definición del componente Nav. Este componente renderiza la barra de navegación
export const Nav = () => {
    return (

// En nav, está pensado solo para secciones básicas de navegación
        <nav className="nav">

                    <Link to="/VistaNosotras">Nosotras</Link>
                    <Link to= "/VistaProductos">Productos</Link>
                    <Link to="/VistaCarrito">Carrito</Link>
                    <Link to="/VistaContacto">Contacto</Link>

        </nav>
    );
};

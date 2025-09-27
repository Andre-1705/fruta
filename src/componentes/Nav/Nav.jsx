import './Nav.css';

// Definición del componente Nav. Este componente renderiza la barra de navegación
export const Nav = () => {
    return (

        // En nav está pensado secciones básicas de navegación 
        <nav className="nav">
            
                    <a href="#nosotros">Nosotros</a>
                    <a href="#productos">Productos</a>
                    <a href="#carrito">Carrito</a>
                    <a href="#formulario">Contacto</a> 

        </nav>
    );
};
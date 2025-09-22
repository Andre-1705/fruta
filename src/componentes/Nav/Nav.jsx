

// Definición del componente Nav. Este componente renderiza la barra de navegación
export const Nav = () => {
    return (

        // El elemento <nav> representa una sección de una página que enlaza a otras partes dentro de la página
        <nav>
            {/* Lista no ordenada que contiene los elementos de navegación */}
            <ul>
                {/* Elemento de la lista */}
                <li>
                    {/* Enlace a la sección "Nosotros". En principio colocaré formulario */}
                    <a href="#">Contacto</a>
                </li>
                <li>
                    {/* Enlace a la sección "Productos" todavía no sé para qué lo voy a usar */}
                    <a href="#">Productos</a>
                </li>
            </ul>
        </nav>
    );
};
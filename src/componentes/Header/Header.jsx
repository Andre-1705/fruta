// Importación del componente Nav desde Nav
import { Nav } from "../Nav/Nav"
import './Header.css';

// Definición del componente Header. Este componente renderiza el encabezado de la aplicación
export const Header = () => {
    return (
  
        // El elemento <header> representa el encabezado de una sección o de la página entera
        <header>
            {/* Título principal de la aplicación */}
            <h1 className="titulo">Fruta</h1>
            {/* Renderiza el componente de navegación (Nav) */}
            <Nav />
        </header>
    );
};

// Importación del componente Nav desde Nav
import { Nav } from "../Nav/Nav"
import './Header.css';

// Definición del componente Header. Este componente renderiza el encabezado de la aplicación
export const Header = () => {
    return (
  
        // El header manejará titulo, logo y barra de navegación?
        <header>
            {/* Título principal de la aplicación */}
            <div className="header">
            
            <img className= "logo" src="/assets/logo_fruta.png" alt="logo"></img>
            <h1 className="titulo">Fruta</h1>
           
            </div>
            {/* Renderiza el componente de navegación (Nav) */}
            <Nav />
        </header>
    );
};

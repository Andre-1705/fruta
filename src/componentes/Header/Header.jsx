// Importación del componente Nav desde Nav
import { Nav } from "../Nav/Nav"
import './Header.css';


// Ver logo tiene atrás luz
// Definición del componente Header. Este componente renderiza el encabezado de la aplicación
export const Header = () => {
    return (

        // El header manejará titulo, logo y subtitulo
        <header>
            {/* Título principal de la aplicación */}
            <div className="header">
                <img className= "logo" src="/assets/logo_fruta.png" alt="logo"></img>
                <div className="textos">
                    <h1 className="titulo">Bienvenidos a Fruta</h1>
                    <h2 className="subtitulo">Acá las cosas caen por su propio peso</h2>
                </div>
            </div>
            {/* Renderiza el componente de navegación (Nav) */}
            <Nav />
        </header>
    );
};

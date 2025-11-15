import './Nav.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContexto } from '../../contexto/AuthContexto.jsx';

//Este componente renderiza la barra de navegación
export const Nav = () => {
    const { user, role, logout } = useAuthContexto();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return (
        <>
        {/* En nav, está pensado solo para secciones básicas de navegación */}
        <nav className="nav">
          <Link to="/">Inicio</Link>
          <Link to="/VistaNosotras">Nosotras</Link>
          <Link to="/VistaProductos">Productos</Link>
          <Link to="/VistaCarrito">Carrito</Link>
          <Link to="/VistaContacto">Contacto</Link>
          {!user ? (
            <Link to="/login">Iniciar sesión</Link>
          ) : (
            <>
              <span style={{fontSize:'0.9rem',color:'#555'}}>
                {role === 'admin' ? '👤 Admin' : `👤 ${user}`}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding:'0.4rem 0.8rem',
                  background:'#dc3545',
                  color:'#fff',
                  border:'none',
                  borderRadius:'4px',
                  cursor:'pointer',
                  fontSize:'0.85rem'
                }}
              >
                Cerrar sesión
              </button>
            </>
          )}
          <Link to="/admin/productos" title="Administración de productos" style={{fontSize:'1.2em'}}>
            <span role="img" aria-label="admin">🔒</span>
          </Link>
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

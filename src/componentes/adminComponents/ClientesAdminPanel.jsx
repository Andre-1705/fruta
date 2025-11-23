import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientesContexto } from '../../contexto/ClientesContexto.jsx';
import { AuthContexto } from '../../contexto/AuthContexto.jsx';
import ClienteForm from './ClienteForm.jsx';
import './ClientesAdminPanel.css';

export default function ClientesAdminPanel() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useContext(AuthContexto);
  const {
    clientesArray,
    cargando,
    error,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    usarSupabase
  } = useContext(ClientesContexto);

  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Filtrar clientes por búsqueda (nombre, email, teléfono)
  const clientesFiltrados = busqueda.trim()
    ? clientesArray.filter(c =>
        c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.telefono?.includes(busqueda)
      )
    : clientesArray;

  const manejarGuardar = async (cliente) => {
    setGuardando(true);
    setMensajeExito('');
    setMensajeError('');
    try {
      if (editando) {
        await actualizarCliente(editando.id, cliente);
        setMensajeExito('Cliente actualizado correctamente');
      } else {
        await agregarCliente(cliente);
        setMensajeExito('Cliente creado correctamente');
      }
      setEditando(null);
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      setMensajeError(err.message || 'Error al guardar el cliente');
      setTimeout(() => setMensajeError(''), 5000);
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
    setMensajeExito('');
    setMensajeError('');
    try {
      await eliminarCliente(id);
      setMensajeExito('Cliente eliminado correctamente');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      setMensajeError(err.message || 'Error al eliminar el cliente');
      setTimeout(() => setMensajeError(''), 5000);
    }
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate('/admin/login');
  };

  if (!usarSupabase) {
    return (
      <div style={{padding:'2rem', textAlign:'center'}}>
        <h2>Gestión de Clientes</h2>
        <p style={{color:'#d32f2f', marginTop:'1rem'}}>
          La gestión de clientes requiere Supabase configurado.
          Verifica tu archivo .env y Vercel.
        </p>
        <button onClick={() => navigate('/admin')} style={{marginTop:'1rem'}}>
          Volver al panel
        </button>
      </div>
    );
  }

  return (
    <div className="clientes-admin-panel">
      <header className="panel-header">
        <div>
          <h1>Gestión de Clientes</h1>
          <p className="usuario-info">
            Administrador: <strong>{usuario?.email}</strong>
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/admin')} className="btn-secundario">
            Panel Principal
          </button>
          <button onClick={manejarCerrarSesion} className="btn-cerrar-sesion">
            Cerrar sesión
          </button>
        </div>
      </header>

      {mensajeExito && (
        <div className="mensaje-exito">
          ✓ {mensajeExito}
        </div>
      )}

      {mensajeError && (
        <div className="mensaje-error">
          ✗ {mensajeError}
        </div>
      )}

      {cargando && <p className="cargando">Cargando clientes...</p>}
      {error && <p className="error-carga">{error}</p>}

      {!cargando && !error && (
        <>
          {/* Formulario de crear/editar */}
          <div className="seccion-formulario">
            <ClienteForm
              initialData={editando}
              onSubmit={manejarGuardar}
              loading={guardando}
              onResetToNew={() => setEditando(null)}
              onDelete={(id) => { manejarEliminar(id); setEditando(null); }}
            />
          </div>

          {/* Buscador */}
          <div className="seccion-busqueda">
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-busqueda"
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="btn-limpiar-busqueda">
                Limpiar
              </button>
            )}
            <span className="contador-resultados">
              {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Tabla de clientes */}
          <div className="seccion-tabla">
            <table className="tabla-clientes">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map(c => (
                    <tr key={c.id}>
                      <td className="nombre-cell">{c.nombre}</td>
                      <td>{c.email || '—'}</td>
                      <td>{c.telefono || '—'}</td>
                      <td className="direccion-cell">{c.direccion || '—'}</td>
                      <td className="notas-cell" title={c.notas}>
                        {c.notas ? c.notas.substring(0, 40) + (c.notas.length > 40 ? '...' : '') : '—'}
                      </td>
                      <td className="acciones-cell">
                        <button onClick={() => setEditando(c)} className="btn-editar">
                          Editar
                        </button>
                        <button onClick={() => manejarEliminar(c.id)} className="btn-eliminar">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{textAlign:'center', padding:'2rem', color:'#757575'}}>
                      {busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

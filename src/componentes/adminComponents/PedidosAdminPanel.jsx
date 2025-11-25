import { useState, useEffect } from 'react';
import { usePedidos } from '../../contexto/PedidosContexto';
import { useAuthContexto } from '../../contexto/AuthContexto';
import './PedidosAdminPanel.css';

const PedidosAdminPanel = () => {
  const { pedidos, loading, cargarPedidos, actualizarEstadoPedido } = usePedidos();
  const { user, isAdmin } = useAuthContexto();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [notasAdmin, setNotasAdmin] = useState('');

  useEffect(() => {
    if (isAdmin) {
      cargarPedidos(); // Admin ve todos los pedidos
    }
  }, [isAdmin]);

  const pedidosFiltrados = pedidos.filter(pedido => {
    const coincideBusqueda =
      pedido.numero_pedido.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.nombre_destinatario.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.email_destinatario.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado = filtroEstado === 'todos' || pedido.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    if (window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) {
      try {
        await actualizarEstadoPedido(pedidoId, nuevoEstado, notasAdmin || null);
        setNotasAdmin('');
        alert('Estado actualizado correctamente');
      } catch (error) {
        alert('Error al actualizar estado: ' + error.message);
      }
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2d',
      month: '2d',
      year: 'numeric',
      hour: '2d',
      minute: '2d'
    });
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'pendiente': '#ffc107',
      'pagado': '#28a745',
      'procesando': '#17a2b8',
      'enviado': '#007bff',
      'entregado': '#157347',
      'cancelado': '#dc3545'
    };
    return colores[estado] || '#6c757d';
  };

  if (!isAdmin) {
    return (
      <div className="acceso-denegado">
        <h2>⛔ Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="pedidos-admin-panel">
      <div className="panel-header">
        <h1>📦 Gestión de Pedidos</h1>
        <p className="subtitle">Total de pedidos: {pedidos.length}</p>
      </div>

      {/* Filtros */}
      <div className="filtros-pedidos">
        <input
          type="text"
          placeholder="🔍 Buscar por número, cliente o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="select-filtro"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">⏳ Pendiente</option>
          <option value="pagado">💳 Pagado</option>
          <option value="procesando">📦 Procesando</option>
          <option value="enviado">🚚 Enviado</option>
          <option value="entregado">✅ Entregado</option>
          <option value="cancelado">❌ Cancelado</option>
        </select>
      </div>

      {/* Tabla de pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="no-pedidos">
          <p>No hay pedidos que mostrar</p>
        </div>
      ) : (
        <div className="tabla-wrapper">
          <table className="tabla-pedidos">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map(pedido => (
                <tr key={pedido.id}>
                  <td className="numero-pedido">
                    <strong>{pedido.numero_pedido}</strong>
                  </td>
                  <td>{formatearFecha(pedido.fecha_pedido)}</td>
                  <td>
                    <div className="cliente-info">
                      <strong>{pedido.nombre_destinatario}</strong>
                      <small>{pedido.email_destinatario}</small>
                    </div>
                  </td>
                  <td className="total-pedido">
                    <strong>${pedido.total.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span
                      className="badge-estado"
                      style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge-pago"
                      style={{
                        backgroundColor: pedido.estado_pago === 'aprobado' ? '#28a745' : '#ffc107',
                        color: 'white'
                      }}
                    >
                      {pedido.estado_pago}
                    </span>
                  </td>
                  <td className="acciones">
                    <button
                      onClick={() => setPedidoSeleccionado(pedido)}
                      className="btn-ver-detalle"
                      title="Ver detalle"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalle */}
      {pedidoSeleccionado && (
        <div className="modal-overlay" onClick={() => setPedidoSeleccionado(null)}>
          <div className="modal-detalle-pedido" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-cerrar-modal"
              onClick={() => setPedidoSeleccionado(null)}
            >
              ✕
            </button>

            <h2>Detalle del Pedido #{pedidoSeleccionado.numero_pedido}</h2>

            {/* Info general */}
            <div className="info-section">
              <h3>📋 Información General</h3>
              <div className="info-grid">
                <div>
                  <strong>Estado:</strong>
                  <span
                    className="badge-estado"
                    style={{ backgroundColor: getEstadoColor(pedidoSeleccionado.estado) }}
                  >
                    {pedidoSeleccionado.estado}
                  </span>
                </div>
                <div>
                  <strong>Estado de pago:</strong>
                  <span className="badge-pago">{pedidoSeleccionado.estado_pago}</span>
                </div>
                <div>
                  <strong>Fecha pedido:</strong> {formatearFecha(pedidoSeleccionado.fecha_pedido)}
                </div>
                <div>
                  <strong>Fecha pago:</strong> {formatearFecha(pedidoSeleccionado.fecha_pago)}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="info-section">
              <h3>🛒 Productos</h3>
              <table className="tabla-items">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoSeleccionado.order_items?.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="item-info">
                          {item.imagen_producto && (
                            <img src={item.imagen_producto} alt={item.nombre_producto} />
                          )}
                          <span>{item.nombre_producto}</span>
                        </div>
                      </td>
                      <td>{item.cantidad}</td>
                      <td>${item.precio_unitario.toFixed(2)}</td>
                      <td><strong>${item.subtotal.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="totales">
                <div>
                  <span>Subtotal:</span>
                  <strong>${pedidoSeleccionado.subtotal.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Envío:</span>
                  <strong>${pedidoSeleccionado.costo_envio.toFixed(2)}</strong>
                </div>
                <div className="total-final">
                  <span>TOTAL:</span>
                  <strong>${pedidoSeleccionado.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Datos de envío */}
            <div className="info-section">
              <h3>🚚 Datos de Envío</h3>
              <div className="info-grid">
                <div><strong>Nombre:</strong> {pedidoSeleccionado.nombre_destinatario}</div>
                <div><strong>Email:</strong> {pedidoSeleccionado.email_destinatario}</div>
                <div><strong>Teléfono:</strong> {pedidoSeleccionado.telefono_destinatario || '-'}</div>
                <div><strong>Dirección:</strong> {pedidoSeleccionado.direccion_envio}</div>
                <div><strong>Ciudad:</strong> {pedidoSeleccionado.ciudad || '-'}</div>
                <div><strong>Provincia:</strong> {pedidoSeleccionado.provincia || '-'}</div>
              </div>
            </div>

            {/* Cambiar estado */}
            <div className="info-section">
              <h3>⚙️ Cambiar Estado</h3>
              <div className="cambiar-estado-form">
                <select
                  className="select-nuevo-estado"
                  defaultValue={pedidoSeleccionado.estado}
                  onChange={(e) => {
                    if (e.target.value !== pedidoSeleccionado.estado) {
                      handleCambiarEstado(pedidoSeleccionado.id, e.target.value);
                    }
                  }}
                >
                  <option value="pendiente">⏳ Pendiente</option>
                  <option value="pagado">💳 Pagado</option>
                  <option value="procesando">📦 Procesando</option>
                  <option value="enviado">🚚 Enviado</option>
                  <option value="entregado">✅ Entregado</option>
                  <option value="cancelado">❌ Cancelado</option>
                </select>
                <textarea
                  placeholder="Notas del administrador (opcional)..."
                  value={notasAdmin}
                  onChange={(e) => setNotasAdmin(e.target.value)}
                  className="textarea-notas"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosAdminPanel;

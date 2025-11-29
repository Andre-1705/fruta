import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePedidos } from '../contexto/PedidosContexto';
import { useAuthContexto } from '../contexto/AuthContexto';
import './MisPedidos.css';

export default function MisPedidos() {
  const { pedidos, loading, cargarPedidos } = usePedidos();
  const { user } = useAuthContexto();
  const [filteredPedidos, setFilteredPedidos] = useState([]);

  useEffect(() => {
    if (user?.id) {
      cargarPedidos(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    // Filtrar solo pedidos del usuario actual
    if (user?.id) {
      setFilteredPedidos(pedidos.filter(p => p.user_id === user.id));
    }
  }, [pedidos, user?.id]);

  if (loading) {
    return (
      <div className="mis-pedidos-container">
        <h1>Mis Pedidos</h1>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mis-pedidos-container">
        <h1>Mis Pedidos</h1>
        <p>Debes iniciar sesión para ver tus pedidos.</p>
        <Link to="/login" className="btn-primary">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (filteredPedidos.length === 0) {
    return (
      <div className="mis-pedidos-container">
        <h1>Mis Pedidos</h1>
        <div className="sin-pedidos">
          <p>Aún no has realizado ningún pedido.</p>
          <Link to="/VistaProductos" className="btn-primary">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-pedidos-container">
      <h1>Mis Pedidos</h1>
      <div className="pedidos-list">
        {filteredPedidos.map(pedido => (
          <div key={pedido.id} className="pedido-card">
            <div className="pedido-header">
              <div>
                <h3>{pedido.numero_pedido}</h3>
                <p className="fecha">{new Date(pedido.fecha_pedido).toLocaleDateString('es-AR')}</p>
              </div>
              <div className="pedido-estados">
                <span className={`badge estado-${pedido.estado}`}>
                  {pedido.estado}
                </span>
                <span className={`badge pago-${pedido.estado_pago}`}>
                  {pedido.estado_pago}
                </span>
              </div>
            </div>
            <div className="pedido-body">
              <div className="info-row">
                <span className="label">Total:</span>
                <span className="valor">${pedido.total?.toFixed(2)}</span>
              </div>
              <div className="info-row">
                <span className="label">Dirección:</span>
                <span className="valor">{pedido.direccion_envio}</span>
              </div>
              <div className="info-row">
                <span className="label">Ciudad:</span>
                <span className="valor">{pedido.ciudad}, {pedido.provincia}</span>
              </div>
            </div>
            <div className="pedido-footer">
              <Link to={`/pedido/detalle/${pedido.id}`} className="btn-ver-detalle">
                Ver detalle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

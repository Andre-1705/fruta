import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePedidos } from '../contexto/PedidosContexto';
import { supabase } from '../lib/supabaseClient';
import './PedidoExito.css';

export default function PedidoExito() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedido');
  const { obtenerPedido } = usePedidos();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedido = async () => {
      if (!pedidoId) {
        setLoading(false);
        return;
      }
      try {
        let data = null;
        if (typeof obtenerPedido === 'function') {
          data = await obtenerPedido(pedidoId);
        } else {
          // Fallback directo a Supabase si el contexto no expone el método
          const { data: d, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                id,
                product_id,
                nombre_producto,
                imagen_producto,
                precio_unitario,
                cantidad,
                subtotal
              )
            `)
            .eq('id', pedidoId)
            .single();
          if (error) throw error;
          data = d;
        }
        setPedido(data);
      } catch (error) {
        console.error('Error al cargar pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPedido();
  }, [pedidoId]);

  if (loading) {
    return (
      <div className="pedido-exito-container">
        <div className="pedido-exito-card">
          <p>Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (!pedidoId || !pedido) {
    return (
      <div className="pedido-exito-container">
        <div className="pedido-exito-card">
          <div className="icon-error">❌</div>
          <h1>Pedido no encontrado</h1>
          <p>No se pudo encontrar la información del pedido.</p>
          <Link to="/productos" className="btn-volver">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pedido-exito-container">
      <div className="pedido-exito-card">
        <div className="icon-success">✅</div>
        <h1>¡Pedido realizado con éxito!</h1>
        <p className="mensaje-principal">
          Gracias por tu compra. Hemos recibido tu pedido correctamente.
        </p>

        <div className="info-pedido">
          <div className="info-item">
            <span className="label">Número de pedido:</span>
            <span className="valor">{pedido.numero_pedido}</span>
          </div>
          <div className="info-item">
            <span className="label">Total:</span>
            <span className="valor">${pedido.total?.toFixed(2)}</span>
          </div>
          <div className="info-item">
            <span className="label">Estado:</span>
            <span className="valor estado">{pedido.estado}</span>
          </div>
        </div>

        <div className="info-envio">
          <h3>Información de envío</h3>
          <p>{pedido.nombre_destinatario}</p>
          <p>{pedido.direccion_envio}</p>
          <p>{pedido.ciudad}, {pedido.provincia} - {pedido.codigo_postal}</p>
          <p>Email: {pedido.email_destinatario}</p>
          <p>Teléfono: {pedido.telefono_destinatario}</p>
        </div>

        <div className="acciones">
          <Link to="/productos" className="btn-primary">
            Seguir comprando
          </Link>
          <Link to="/mis-pedidos" className="btn-secondary">
            Ver mis pedidos
          </Link>
        </div>

        <p className="nota">
          Te enviamos un email de confirmación a <strong>{pedido.email_destinatario}</strong>
        </p>
      </div>
    </div>
  );
}

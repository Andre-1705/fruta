import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { usePedidos } from '../contexto/PedidosContexto';
import { supabase } from '../lib/supabaseClient';
import './PedidoExito.css';

export default function PedidoExito() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedido') || searchParams.get('ref');
  const paymentId = searchParams.get('payment_id');
  const { obtenerPedido } = usePedidos();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    const procesar = async () => {
      // Si viene de MercadoPago con payment_id, crear el pedido desde localStorage
      if (paymentId || !pedidoId?.includes('-')) {
        await crearPedidoDesdePago();
        return;
      }

      // Si tiene pedidoId, intentar cargarlo
      if (pedidoId) {
        try {
          let data = null;
          if (typeof obtenerPedido === 'function') {
            data = await obtenerPedido(pedidoId);
          } else {
            const { data: d, error } = await supabase
              .from('orders')
              .select(`*, order_items (id, product_id, nombre_producto, imagen_producto, precio_unitario, cantidad, subtotal)`)
              .eq('id', pedidoId)
              .single();
            if (error) throw error;
            data = d;
          }
          setPedido(data);
        } catch (error) {
          console.error('Error al cargar pedido:', error);
        }
      }

      setLoading(false);
    };

    procesar();
  }, [pedidoId, paymentId]);

  const crearPedidoDesdePago = async () => {
    setCreando(true);
    try {
      const pending = localStorage.getItem('pending_payment');
      if (!pending) {
        console.warn('No hay datos de pago pendiente');
        setLoading(false);
        setCreando(false);
        return;
      }

      const { items, envio, userId, costoEnvio, ref } = JSON.parse(pending);

      // Verificar si ya se creó el pedido (por el webhook)
      const { data: existente } = await supabase
        .from('orders')
        .select('id')
        .eq('mp_payment_id', String(paymentId || ''))
        .limit(1)
        .single();

      if (existente) {
        const data = await obtenerPedido?.(existente.id) || existente;
        setPedido(data);
        vaciarCarrito();
        setLoading(false);
        setCreando(false);
        return;
      }

      // Crear el pedido
      const result = await fetch('/api/mercadopago/crear-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, envio, userId, costoEnvio, paymentId, ref })
      });

      if (result.ok) {
        const { orderId } = await result.json();
        const data = await obtenerPedido?.(orderId);
        setPedido(data);
      }

      vaciarCarrito();
    } catch (e) {
      console.error('Error creando pedido post-pago:', e);
    } finally {
      localStorage.removeItem('pending_payment');
      setLoading(false);
      setCreando(false);
    }
  };

  const vaciarCarrito = () => {
    try {
      // El carrito se limpia desde el contexto si está disponible
      const event = new CustomEvent('vaciar-carrito');
      window.dispatchEvent(event);
    } catch {}
  };

  if (loading || creando) {
    return (
      <div className="pedido-exito-container">
        <div className="pedido-exito-card">
          <p>{creando ? 'Registrando tu pedido...' : 'Cargando información del pedido...'}</p>
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
          <Link to="/VistaProductos" className="btn-volver">
            Ver Productos
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
          <Link to="/VistaProductos" className="btn-primary">
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

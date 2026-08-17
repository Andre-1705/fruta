import { Link, useSearchParams } from 'react-router-dom';

export default function PedidoPendiente() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedido');

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 20, textAlign: 'center' }}>
      <h2>Pago pendiente</h2>
      <p>Tu pago esta siendo procesado. Te enviaremos un email cuando se confirme.</p>
      {pedidoId && <p style={{ color: '#888', fontSize: 14 }}>Referencia: {pedidoId}</p>}
      <Link to="/mis-pedidos" style={{
        display: 'inline-block', marginTop: 20, padding: '12px 24px',
        background: '#f39c12', color: '#fff', textDecoration: 'none', borderRadius: 8
      }}>
        Ver mis pedidos
      </Link>
      <br />
      <Link to="/" style={{
        display: 'inline-block', marginTop: 10, color: '#666', textDecoration: 'none'
      }}>
        Ir al inicio
      </Link>
    </div>
  );
}

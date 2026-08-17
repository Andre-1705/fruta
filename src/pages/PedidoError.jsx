import { Link, useSearchParams } from 'react-router-dom';

export default function PedidoError() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedido');

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 20, textAlign: 'center' }}>
      <h2>Error en el pago</h2>
      <p>No pudimos procesar tu pago. Intenta nuevamente.</p>
      {pedidoId && <p style={{ color: '#888', fontSize: 14 }}>Referencia: {pedidoId}</p>}
      <Link to="/VistaCarrito" style={{
        display: 'inline-block', marginTop: 20, padding: '12px 24px',
        background: '#e74c3c', color: '#fff', textDecoration: 'none', borderRadius: 8
      }}>
        Volver al carrito
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

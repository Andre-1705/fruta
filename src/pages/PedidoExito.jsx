import { Link } from 'react-router-dom';
import './PedidoExito.css';

export default function PedidoExito() {
  return (
    <div className="pedido-exito-container">
      <div className="pedido-exito-card">
        <div className="icon-success">✅</div>
        <h1>¡Compra realizada con éxito!</h1>
        <p className="mensaje-principal">
          Gracias por tu compra. Recibimos tu pago correctamente.
        </p>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Te enviaremos la confirmación por email.
        </p>
        <Link to="/VistaProductos" className="btn-primary">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

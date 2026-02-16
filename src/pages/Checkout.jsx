import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexto/CarritoContexto';
import { usePedidos } from '../contexto/PedidosContexto';
import { useAuthContexto } from '../contexto/AuthContexto';
import { crearPreferencia, abrirCheckout, validarConfiguracion } from '../lib/mercadopago';
import './Checkout.css';

const Checkout = () => {
  const { carrito, vaciarCarrito, total } = useCarrito();
  const { crearPedido, validarStockCarrito } = usePedidos();
  const { user } = useAuthContexto();
  const navigate = useNavigate();

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    email: user?.email || '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    notas: ''
  });

  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [errorStock, setErrorStock] = useState(null);

  const costoEnvio = total > 5000 ? 0 : 500;
  const totalFinal = total + costoEnvio;

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosEnvio.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!datosEnvio.email.trim()) nuevosErrores.email = 'El email es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosEnvio.email)) {
      nuevosErrores.email = 'Email inválido';
    }
    if (!datosEnvio.telefono.trim()) nuevosErrores.telefono = 'El teléfono es obligatorio';
    if (!datosEnvio.direccion.trim()) nuevosErrores.direccion = 'La dirección es obligatoria';
    if (!datosEnvio.ciudad.trim()) nuevosErrores.ciudad = 'La ciudad es obligatoria';
    if (!datosEnvio.provincia.trim()) nuevosErrores.provincia = 'La provincia es obligatoria';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosEnvio(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!validarConfiguracion()) {
      alert('MercadoPago no está configurado correctamente. Contacta al administrador.');
      return;
    }

    try {
      setProcesando(true);
      setErrorStock(null);

      // 1. VALIDAR STOCK antes de hacer nada
      const validacionStock = await validarStockCarrito(carrito);

      if (!validacionStock.valido) {
        // Hay problemas de stock
        const detalles = validacionStock.problemasStock
          .map(item => `${item.producto_id}: disponible ${item.stock_disponible}, solicitado ${item.cantidad_solicitada}`)
          .join('\n');

        setErrorStock(`❌ Stock insuficiente:\n${detalles}\n\nPor favor, ajusta las cantidades en tu carrito.`);
        setProcesando(false);
        window.scrollTo(0, 0);
        return;
      }

      // 2. Crear el pedido en la base de datos
      const pedido = await crearPedido(carrito, datosEnvio, user?.id);

      // 3. Crear preferencia de pago en MercadoPago
      const preferencia = await crearPreferencia({
        items: carrito,
        pedidoId: pedido.id,
        email: datosEnvio.email,
        telefono: datosEnvio.telefono,
        costoEnvio: costoEnvio
      });

      // 4. Guardar preference_id en el pedido
      // (esto debería hacerse desde el backend idealmente)

      // 5. Vaciar carrito
      vaciarCarrito();

      // 6. Si es mock, redirigir directamente; si no, abrir SDK de MercadoPago
      if (preferencia.id && preferencia.id.startsWith('MOCK-')) {
        // Modo mock: redirigir a éxito sin abrir SDK
        navigate(`/pedido/exito?pedido=${pedido.id}`);
      } else {
        // Modo real: abrir checkout de MercadoPago
        abrirCheckout(preferencia.id);
      }

    } catch (error) {
      console.error('Error al procesar checkout:', error);
      const mensajeError = error?.message || 'Error desconocido';

      // Detectar si es un error sobre stock insuficiente
      if (mensajeError.toLowerCase().includes('stock')) {
        setErrorStock(`❌ ${mensajeError}`);
        window.scrollTo(0, 0);
      } else {
        alert('Error al procesar el pedido: ' + mensajeError);
      }
    } finally {
      setProcesando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="checkout-container">
        <div className="carrito-vacio">
          <h2>🛒 Carrito Vacío</h2>
          <p>No tienes productos en tu carrito</p>
          <button onClick={() => navigate('/VistaProductos')} className="btn-ir-productos">
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        {/* PANEL DE DEBUG */}
        {procesando && (
          <div style={{
            backgroundColor: '#e0f2fe',
            border: '2px solid #0284c7',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            color: '#075985',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <strong>🔄 Procesando pedido...</strong>
            <div style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify({
                usuario: user?.id || 'invitado',
                items_carrito: carrito.length,
                total: totalFinal.toFixed(2),
                estado: 'creando_pedido'
              }, null, 2)}
            </div>
          </div>
        )}

        {errorStock && (
          <div className="alert-error-stock" style={{
            backgroundColor: '#fee2e2',
            border: '2px solid #dc2626',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            color: '#991b1b',
            whiteSpace: 'pre-wrap',
            fontWeight: '500'
          }}>
            {errorStock}
          </div>
        )}

        <div className="checkout-left">
          <h1>📋 Finalizar Compra</h1>

          <form onSubmit={handleSubmit} className="form-checkout">
            <div className="form-section">
              <h3>👤 Datos Personales</h3>
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={datosEnvio.nombre}
                  onChange={handleInputChange}
                  className={errores.nombre ? 'input-error' : ''}
                />
                {errores.nombre && <span className="error-msg">{errores.nombre}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={datosEnvio.email}
                    onChange={handleInputChange}
                    className={errores.email ? 'input-error' : ''}
                  />
                  {errores.email && <span className="error-msg">{errores.email}</span>}
                </div>

                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={datosEnvio.telefono}
                    onChange={handleInputChange}
                    className={errores.telefono ? 'input-error' : ''}
                  />
                  {errores.telefono && <span className="error-msg">{errores.telefono}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>🚚 Dirección de Envío</h3>
              <div className="form-group">
                <label>Dirección completa *</label>
                <input
                  type="text"
                  name="direccion"
                  value={datosEnvio.direccion}
                  onChange={handleInputChange}
                  placeholder="Calle, número, piso, depto"
                  className={errores.direccion ? 'input-error' : ''}
                />
                {errores.direccion && <span className="error-msg">{errores.direccion}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={datosEnvio.ciudad}
                    onChange={handleInputChange}
                    className={errores.ciudad ? 'input-error' : ''}
                  />
                  {errores.ciudad && <span className="error-msg">{errores.ciudad}</span>}
                </div>

                <div className="form-group">
                  <label>Provincia *</label>
                  <input
                    type="text"
                    name="provincia"
                    value={datosEnvio.provincia}
                    onChange={handleInputChange}
                    className={errores.provincia ? 'input-error' : ''}
                  />
                  {errores.provincia && <span className="error-msg">{errores.provincia}</span>}
                </div>

                <div className="form-group">
                  <label>Código Postal</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={datosEnvio.codigoPostal}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>📝 Notas adicionales (opcional)</h3>
              <div className="form-group">
                <textarea
                  name="notas"
                  value={datosEnvio.notas}
                  onChange={handleInputChange}
                  placeholder="Instrucciones especiales de entrega, horarios preferidos, etc."
                  rows="4"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-finalizar-compra"
              disabled={procesando}
            >
              {procesando ? '⏳ Procesando...' : '💳 Pagar con MercadoPago'}
            </button>
          </form>
        </div>

        <div className="checkout-right">
          <div className="resumen-pedido">
            <h3>📦 Resumen del Pedido</h3>

            <div className="items-resumen">
              {carrito.map(item => (
                <div key={item.id} className="item-resumen">
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="item-info">
                    <strong>{item.nombre}</strong>
                    <span>x{item.cantidad}</span>
                  </div>
                  <span className="item-precio">${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="totales-resumen">
              <div className="linea-total">
                <span>Subtotal:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div className="linea-total">
                <span>Envío:</span>
                <strong>{costoEnvio === 0 ? 'GRATIS' : `$${costoEnvio.toFixed(2)}`}</strong>
              </div>
              {costoEnvio === 0 && (
                <div className="mensaje-envio-gratis">
                  🎉 ¡Envío gratis en compras mayores a $5000!
                </div>
              )}
              <div className="linea-total total-final">
                <span>TOTAL:</span>
                <strong>${totalFinal.toFixed(2)}</strong>
              </div>
            </div>

            <div className="info-mercadopago">
              <img
                src="https://http2.mlstatic.com/storage/logos-api-admin/51b446b0-571c-11e8-9a2d-4b2bd7b1bf77-m.svg"
                alt="MercadoPago"
                style={{ width: '120px', marginBottom: '10px' }}
              />
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                🔒 Pago seguro con MercadoPago<br />
                Hasta 12 cuotas sin interés
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

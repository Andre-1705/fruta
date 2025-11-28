/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuthContexto } from './AuthContexto.jsx';

const PedidosContexto = createContext();

export const usePedidos = () => {
  const context = useContext(PedidosContexto);
  if (!context) {
    throw new Error('usePedidos debe usarse dentro de un PedidosProvider');
  }
  return context;
};

export const PedidosProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useAuthContexto() || {};

  // Cargar pedidos (admin ve todos, usuario solo los suyos)
  const cargarPedidos = async (userId = null) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('orders')
        .select('*')
        .order('fecha_pedido', { ascending: false });

      // Si se proporciona userId, filtrar por usuario
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setPedidos(data || []);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError(err.message);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo pedido
  const crearPedido = async (datosCarrito, datosEnvio, userId = null) => {
    try {
      setError(null);

      // 1. Buscar o crear cliente SOLO si el usuario está autenticado.
      // Para checkout invitado, no tocamos la tabla clientes (RLS lo bloquearía).
      const email = datosEnvio.email.trim().toLowerCase();
      let clienteId = null;
      if (userId) {
        // Buscar cliente existente por email
        const { data: clienteExistente, error: buscarError } = await supabase
          .from('clientes')
          .select('id')
          .ilike('email', email)
          .limit(1)
          .single();

        if (buscarError && buscarError.code !== 'PGRST116') {
          // PGRST116 = no rows found, cualquier otro error es problema real
          throw buscarError;
        }

        if (clienteExistente) {
          clienteId = clienteExistente.id;
        } else {
          // Crear nuevo cliente
          const { data: nuevoCliente, error: crearError } = await supabase
            .from('clientes')
            .insert({
              nombre: datosEnvio.nombre,
              email: email,
              telefono: datosEnvio.telefono,
              direccion: datosEnvio.direccion
            })
            .select('id')
            .single();

          if (crearError) throw crearError;
          clienteId = nuevoCliente.id;
        }
      }

      // 2. Verificar stock disponible
      const itemsParaVerificar = datosCarrito.map(item => ({
        product_id: item.id,
        cantidad: item.cantidad
      }));

      const { data: stockData, error: stockError } = await supabase
        .rpc('verificar_stock_disponible', {
          p_items: itemsParaVerificar
        });

      if (stockError) throw stockError;

      // Verificar si hay productos sin stock suficiente
      const sinStock = stockData.filter(item => !item.suficiente);
      if (sinStock.length > 0) {
        const mensajes = sinStock.map(item =>
          `Producto insuficiente (disponible: ${item.stock_disponible}, solicitado: ${item.stock_solicitado})`
        );
        throw new Error(`Stock insuficiente:\n${mensajes.join('\n')}`);
      }

      // 3. Calcular totales
      const subtotal = datosCarrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      const costoEnvio = subtotal > 5000 ? 0 : 500; // Envío gratis >$5000
      const total = subtotal + costoEnvio;

      // 4. Crear el pedido usando un id generado en cliente para evitar SELECT posterior
      const pedidoId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const { error: pedidoError } = await supabase
        .from('orders')
        .insert({
          id: pedidoId,
          cliente_id: clienteId,
          user_id: userId, // Puede ser null si no está autenticado
          subtotal,
          costo_envio: costoEnvio,
          total,
          nombre_destinatario: datosEnvio.nombre,
          email_destinatario: datosEnvio.email,
          telefono_destinatario: datosEnvio.telefono,
          direccion_envio: datosEnvio.direccion,
          ciudad: datosEnvio.ciudad,
          provincia: datosEnvio.provincia,
          codigo_postal: datosEnvio.codigoPostal,
          notas_cliente: datosEnvio.notas,
          estado: 'pendiente',
          estado_pago: 'pendiente'
        });

      if (pedidoError) throw pedidoError;

      // 4. Crear los items del pedido
      const items = datosCarrito.map(item => ({
        order_id: pedidoId,
        product_id: item.id,
        nombre_producto: item.nombre,
        imagen_producto: item.imagen,
        precio_unitario: item.precio,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items);

      if (itemsError) throw itemsError;

      // 5. Recargar pedidos solo si hay usuario autenticado
      if (userId) {
        await cargarPedidos(userId);
      }

      return { id: pedidoId };
    } catch (err) {
      console.error('Error al crear pedido:', err);
      setError(err.message);
      throw err;
    }
  };

  // Actualizar estado del pedido
  const actualizarEstadoPedido = async (pedidoId, nuevoEstado, notasAdmin = null) => {
    try {
      setError(null);

      const updateData = {
        estado: nuevoEstado
      };

      // Actualizar fechas según el estado
      if (nuevoEstado === 'enviado') {
        updateData.fecha_envio = new Date().toISOString();
      } else if (nuevoEstado === 'entregado') {
        updateData.fecha_entrega = new Date().toISOString();
      }

      if (notasAdmin) {
        updateData.notas_admin = notasAdmin;
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', pedidoId);

      if (updateError) throw updateError;

      // Recargar pedidos
      await cargarPedidos();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setError(err.message);
      throw err;
    }
  };

  // Actualizar estado de pago (lo hace el webhook de MercadoPago)
  const actualizarEstadoPago = async (pedidoId, estadoPago, paymentId = null) => {
    try {
      setError(null);

      const updateData = {
        estado_pago: estadoPago,
        mp_payment_id: paymentId
      };

      if (estadoPago === 'aprobado') {
        updateData.fecha_pago = new Date().toISOString();
        updateData.estado = 'pagado'; // Cambiar también el estado del pedido
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', pedidoId);

      if (updateError) throw updateError;

      await cargarPedidos();
    } catch (err) {
      console.error('Error al actualizar estado de pago:', err);
      setError(err.message);
      throw err;
    }
  };

  // Obtener historial de estados de un pedido
  const obtenerHistorialEstados = async (pedidoId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', pedidoId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      return data || [];
    } catch (err) {
      console.error('Error al obtener historial:', err);
      return [];
    }
  };

  // Obtener un pedido por ID
  const obtenerPedido = async (pedidoId) => {
    try {
      const { data, error: fetchError } = await supabase
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

      if (fetchError) throw fetchError;

      return data;
    } catch (err) {
      console.error('Error al obtener pedido:', err);
      throw err;
    }
  };

  useEffect(() => {
    // Admin carga todos los pedidos; usuario autenticado carga los suyos; invitado no carga
    if (isAdmin) {
      cargarPedidos();
    } else if (user?.id) {
      cargarPedidos(user.id);
    } else {
      setPedidos([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, user?.id]);

  const valor = {
    pedidos,
    loading,
    error,
    cargarPedidos,
    crearPedido,
    actualizarEstadoPedido,
    actualizarEstadoPago,
    obtenerHistorialEstados,
    obtenerPedido
  };

  return (
    <PedidosContexto.Provider value={valor}>
      {children}
    </PedidosContexto.Provider>
  );
};

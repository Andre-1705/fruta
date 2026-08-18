import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const cargarPedidos = useCallback(async (userId = null) => {
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
  }, []);

  // Crear nuevo pedido (ATÓMICO con verificación de stock)
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
              user_id: userId,
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

      // 2. Calcular totales
      const subtotal = datosCarrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      const costoEnvio = subtotal > 5000 ? 0 : 500; // Envío gratis >$5000
      const total = subtotal + costoEnvio;

      // 3. FUNCIÓN TRANSACCIONAL: Verifica stock Y crea pedido de forma ATÓMICA
      // Esto evita race conditions completamente
      const { data: resultadoPedido, error: pedidoError } = await supabase.rpc(
        'crear_pedido_con_stock',
        {
          p_cliente_id: clienteId,
          p_user_id: userId,
          p_items: datosCarrito.map(item => ({
            product_id: item.id,
            nombre_producto: item.nombre,
            imagen_producto: item.imagen,
            precio: item.precio,
            cantidad: item.cantidad
          })),
          p_subtotal: subtotal,
          p_costo_envio: costoEnvio,
          p_total: total,
          p_nombre_destinatario: datosEnvio.nombre,
          p_email_destinatario: datosEnvio.email,
          p_telefono_destinatario: datosEnvio.telefono,
          p_direccion_envio: datosEnvio.direccion,
          p_ciudad: datosEnvio.ciudad,
          p_provincia: datosEnvio.provincia,
          p_codigo_postal: datosEnvio.codigoPostal,
          p_notas_cliente: datosEnvio.notas
        }
      );

      if (pedidoError) {
        console.error('Error RPC:', pedidoError);
        throw new Error(pedidoError.message || 'Error al crear el pedido');
      }

      // Verificar respuesta de la función (ahora retorna un JSONB directo)
      console.log('Respuesta de crear_pedido_con_stock:', resultadoPedido);

      if (!resultadoPedido) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const { order_id, success, mensaje } = resultadoPedido;

      console.log(`Pedido ${success ? '✅ CREADO' : '❌ ERROR'}: ${mensaje}`);

      if (!success) {
        // La función retornó un error específico
        throw new Error(mensaje || 'Error desconocido al crear el pedido');
      }

      console.log('Order ID generado:', order_id);

      // El stock ya fue descontado en la BD de forma atómica
      // Solo actualizamos el carrito local
      if (userId) {
        await cargarPedidos(userId);
      }

      return { id: order_id };
    } catch (err) {
      console.error('Error al crear pedido:', err);
      const mensajeError = err.message || 'No se pudo crear el pedido. Intenta de nuevo.';
      setError(mensajeError);
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

  // Validar stock sin crear pedido (para mostrar avisos en frontend)
  const validarStockCarrito = async (carrito) => {
    try {
      if (!carrito || carrito.length === 0) {
        return { valido: true, detalles: [] };
      }

      const { data: validacionData, error: validacionError } = await supabase.rpc(
        'validar_stock_items',
        {
          p_items: carrito.map(item => ({
            product_id: item.id,
            cantidad: item.cantidad
          }))
        }
      );

      if (validacionError) {
        console.error('Error validando stock:', validacionError);
        return { valido: false, detalles: [], error: validacionError.message };
      }

      // Verificar si algún item no tiene stock
      const conProblema = validacionData.filter(item => !item.tiene_stock);
      const valido = conProblema.length === 0;

      return {
        valido,
        detalles: validacionData,
        problemasStock: conProblema
      };
    } catch (err) {
      console.error('Error al validar stock:', err);
      return { valido: false, detalles: [], error: err.message };
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
  }, [cargarPedidos, isAdmin, user?.id]);

  const valor = {
    pedidos,
    loading,
    error,
    cargarPedidos,
    crearPedido,
    actualizarEstadoPedido,
    actualizarEstadoPago,
    obtenerHistorialEstados,
    obtenerPedido,
    validarStockCarrito
  };

  return (
    <PedidosContexto.Provider value={valor}>
      {children}
    </PedidosContexto.Provider>
  );
};

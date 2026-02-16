-- ============================================
-- CREAR FUNCIÓN: crear_pedido_con_stock
-- ============================================
-- Ejecuta en Supabase SQL Editor

-- Primero, elimina la función si existe
DROP FUNCTION IF EXISTS public.crear_pedido_con_stock(uuid, uuid, jsonb, numeric, numeric, numeric, text, text, text, text, text, text, text, text) CASCADE;

-- Crea la función
CREATE FUNCTION public.crear_pedido_con_stock(
  p_cliente_id uuid,
  p_user_id uuid,
  p_items jsonb,
  p_subtotal numeric,
  p_costo_envio numeric,
  p_total numeric,
  p_nombre_destinatario text,
  p_email_destinatario text,
  p_telefono_destinatario text,
  p_direccion_envio text,
  p_ciudad text,
  p_provincia text,
  p_codigo_postal text,
  p_notas_cliente text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pedido_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_cantidad integer;
  v_precio numeric;
  v_stock_disponible integer;
BEGIN
  -- Generar ID del pedido
  v_pedido_id := gen_random_uuid();

  -- Validar stock de TODOS los items ANTES de crear nada
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_cantidad := (v_item->>'cantidad')::integer;
    v_precio := (v_item->>'precio')::numeric;

    -- Obtener stock actual con LOCK para evitar cambios
    SELECT stock INTO v_stock_disponible
    FROM public.products
    WHERE id = v_product_id
    FOR UPDATE;

    -- Validar stock
    IF v_stock_disponible IS NULL THEN
      RETURN jsonb_build_object(
        'order_id', NULL,
        'success', false,
        'mensaje', 'Producto no existe'
      );
    END IF;

    IF v_stock_disponible < v_cantidad THEN
      RETURN jsonb_build_object(
        'order_id', NULL,
        'success', false,
        'mensaje', 'Stock insuficiente. Disponible: ' || v_stock_disponible || ', Solicitado: ' || v_cantidad
      );
    END IF;
  END LOOP;

  -- Crear el pedido
  INSERT INTO public.orders (
    id,
    cliente_id,
    user_id,
    subtotal,
    costo_envio,
    total,
    nombre_destinatario,
    email_destinatario,
    telefono_destinatario,
    direccion_envio,
    ciudad,
    provincia,
    codigo_postal,
    notas_cliente,
    estado,
    estado_pago,
    fecha_pedido
  ) VALUES (
    v_pedido_id,
    p_cliente_id,
    p_user_id,
    p_subtotal,
    p_costo_envio,
    p_total,
    p_nombre_destinatario,
    p_email_destinatario,
    p_telefono_destinatario,
    p_direccion_envio,
    p_ciudad,
    p_provincia,
    p_codigo_postal,
    p_notas_cliente,
    'pendiente',
    'pendiente',
    NOW()
  );

  -- Crear order_items Y descontar stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_cantidad := (v_item->>'cantidad')::integer;
    v_precio := (v_item->>'precio')::numeric;

    -- Insertar item del pedido
    INSERT INTO public.order_items (
      order_id,
      product_id,
      nombre_producto,
      imagen_producto,
      precio_unitario,
      cantidad,
      subtotal
    ) VALUES (
      v_pedido_id,
      v_product_id,
      v_item->>'nombre_producto',
      v_item->>'imagen_producto',
      v_precio,
      v_cantidad,
      v_precio * v_cantidad
    );

    -- Descontar stock
    UPDATE public.products
    SET stock = stock - v_cantidad,
        disponible = (stock - v_cantidad > 0)
    WHERE id = v_product_id;
  END LOOP;

  -- Retornar éxito
  RETURN jsonb_build_object(
    'order_id', v_pedido_id,
    'success', true,
    'mensaje', 'Pedido creado correctamente. El stock ha sido reservado.'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'order_id', NULL,
    'success', false,
    'mensaje', SQLERRM
  );
END;
$$;

-- Dar permisos para ejecutar
GRANT EXECUTE ON FUNCTION public.crear_pedido_con_stock TO anon, authenticated;

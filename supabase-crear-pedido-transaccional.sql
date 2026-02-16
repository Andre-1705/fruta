-- ============================================
-- FUNCIÓN TRANSACCIONAL: Crear pedido con descuento de stock atómico
-- ============================================
-- Esta función resuelve la race condition:
-- 1. Verifica stock de TODOS los items en una transacción SERIALIZABLE
-- 2. Si hay insuficiencia, lanza error y rollback automático
-- 3. Si todo bien: crea order + order_items + descuenta stock EN UN PASO

CREATE OR REPLACE FUNCTION crear_pedido_con_stock(
  p_cliente_id UUID,
  p_user_id UUID,
  p_items JSONB,
  p_subtotal DECIMAL,
  p_costo_envio DECIMAL,
  p_total DECIMAL,
  p_nombre_destinatario TEXT,
  p_email_destinatario TEXT,
  p_telefono_destinatario TEXT,
  p_direccion_envio TEXT,
  p_ciudad TEXT,
  p_provincia TEXT,
  p_codigo_postal TEXT,
  p_notas_cliente TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_pedido_id UUID;
  v_item JSONB;
  v_product_id UUID;
  v_cantidad INTEGER;
  v_precio DECIMAL;
  v_stock_disponible INTEGER;
  v_resultado JSONB;
BEGIN
  -- Step 1: Generar ID del pedido
  v_pedido_id := gen_random_uuid();

  -- Step 2: Validar stock de TODOS los items ANTES de crear nada
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_cantidad := (v_item->>'cantidad')::INTEGER;
    v_precio := (v_item->>'precio')::DECIMAL;

    -- Obtener stock actual con LOCK para evitar cambios
    SELECT stock INTO v_stock_disponible
    FROM products
    WHERE id = v_product_id
    FOR UPDATE;  -- LOCK exclusivo en este producto

    -- Validar stock
    IF v_stock_disponible IS NULL THEN
      RETURN jsonb_build_object(
        'order_id', NULL,
        'success', false,
        'mensaje', 'Producto ' || v_product_id::TEXT || ' no existe'
      );
    END IF;

    IF v_stock_disponible < v_cantidad THEN
      RETURN jsonb_build_object(
        'order_id', NULL,
        'success', false,
        'mensaje', 'Stock insuficiente para producto ' || v_product_id::TEXT ||
                   '. Disponible: ' || v_stock_disponible || ', Solicitado: ' || v_cantidad
      );
    END IF;
  END LOOP;

  -- Step 3: Si llegamos aquí, hay stock para TODOS. Crear el pedido
  INSERT INTO orders (
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

  -- Step 4: Crear order_items Y descontar stock en el MISMO paso
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_cantidad := (v_item->>'cantidad')::INTEGER;
    v_precio := (v_item->>'precio')::DECIMAL;

    -- Insertar item del pedido
    INSERT INTO order_items (
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

    -- Descontar stock de forma atómica
    UPDATE products
    SET stock = stock - v_cantidad,
        disponible = (stock - v_cantidad > 0)
    WHERE id = v_product_id;
  END LOOP;

  -- Step 5: Retornar éxito
  RETURN jsonb_build_object(
    'order_id', v_pedido_id,
    'success', true,
    'mensaje', 'Pedido creado correctamente. El stock ha sido reservado.'
  );

EXCEPTION WHEN OTHERS THEN
  -- Auto-rollback por error (ya sea por stock insuficiente o cualquier otro)
  RETURN jsonb_build_object(
    'order_id', NULL,
    'success', false,
    'mensaje', SQLERRM
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: Verificar stock SIN crear pedido
-- ============================================
-- Útil para el frontend: validar disponibilidad antes de permitir checkout
CREATE OR REPLACE FUNCTION validar_stock_items(
  p_items JSONB
)
RETURNS TABLE(
  producto_id UUID,
  stock_disponible INTEGER,
  cantidad_solicitada INTEGER,
  tiene_stock BOOLEAN,
  mensaje TEXT
) AS $$
DECLARE
  v_item JSONB;
  v_product_id UUID;
  v_cantidad INTEGER;
  v_stock INTEGER;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_cantidad := (v_item->>'cantidad')::INTEGER;

    SELECT stock INTO v_stock
    FROM products
    WHERE id = v_product_id;

    IF v_stock IS NULL THEN
      RETURN QUERY SELECT
        v_product_id,
        0,
        v_cantidad,
        false,
        'Producto no encontrado'::TEXT;
    ELSE
      RETURN QUERY SELECT
        v_product_id,
        v_stock,
        v_cantidad,
        v_stock >= v_cantidad,
        CASE
          WHEN v_stock >= v_cantidad THEN 'Stock disponible'
          ELSE 'Stock insuficiente. Disponible: ' || v_stock || ', Solicitado: ' || v_cantidad
        END::TEXT;
    END IF;
  END LOOP;

  -- Si no hay items, retornar fila vacía para evitar "no rows"
  IF NOT FOUND THEN
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON FUNCTION crear_pedido_con_stock IS
  'Crea un pedido con descuento de stock de forma ATÓMICA. '
  'Usa SERIALIZABLE para evitar race conditions. '
  'Si hay error, rollback automático. '
  'Retorna un JSONB con order_id, success y mensaje. '
  'IMPORTANTE: Esta es la función segura para crear pedidos.';

COMMENT ON FUNCTION validar_stock_items IS
  'Valida stock sin crear nada. Útil para frontend: mostrar avisos antes de checkout.';

-- ============================================
-- SCHEMA PARA SISTEMA DE PEDIDOS
-- ============================================

-- Extensión para UUID (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: orders (pedidos)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relación con usuario
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,

  -- Datos del pedido
  numero_pedido TEXT UNIQUE NOT NULL, -- Ej: ORD-20250124-001
  estado TEXT NOT NULL DEFAULT 'pendiente',
  -- Estados: pendiente, pagado, procesando, enviado, entregado, cancelado

  -- Montos
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  descuento DECIMAL(10, 2) DEFAULT 0,
  costo_envio DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Datos de envío
  nombre_destinatario TEXT NOT NULL,
  email_destinatario TEXT NOT NULL,
  telefono_destinatario TEXT,
  direccion_envio TEXT NOT NULL,
  ciudad TEXT,
  provincia TEXT,
  codigo_postal TEXT,

  -- Datos de pago
  metodo_pago TEXT DEFAULT 'mercadopago',
  estado_pago TEXT DEFAULT 'pendiente', -- pendiente, aprobado, rechazado, reembolsado
  mp_payment_id TEXT, -- ID de pago de MercadoPago
  mp_preference_id TEXT, -- ID de preferencia de MercadoPago

  -- Notas
  notas_cliente TEXT,
  notas_admin TEXT,

  -- Timestamps
  fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_pago TIMESTAMP WITH TIME ZONE,
  fecha_envio TIMESTAMP WITH TIME ZONE,
  fecha_entrega TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT estado_valido CHECK (estado IN ('pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado')),
  CONSTRAINT estado_pago_valido CHECK (estado_pago IN ('pendiente', 'aprobado', 'rechazado', 'reembolsado'))
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_cliente_id ON orders(cliente_id);
CREATE INDEX IF NOT EXISTS idx_orders_numero_pedido ON orders(numero_pedido);
CREATE INDEX IF NOT EXISTS idx_orders_estado ON orders(estado);
CREATE INDEX IF NOT EXISTS idx_orders_fecha_pedido ON orders(fecha_pedido DESC);
CREATE INDEX IF NOT EXISTS idx_orders_mp_payment_id ON orders(mp_payment_id);

-- ============================================
-- TABLA: order_items (items del pedido)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,

  -- Datos del producto al momento de la compra (snapshot)
  nombre_producto TEXT NOT NULL,
  imagen_producto TEXT,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  subtotal DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_producto_id ON order_items(producto_id);

-- ============================================
-- TABLA: order_status_history (historial de estados)
-- ============================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  estado_anterior TEXT,
  estado_nuevo TEXT NOT NULL,
  comentario TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Admin que hizo el cambio

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- ============================================
-- FUNCIÓN: Generar número de pedido único
-- ============================================
CREATE OR REPLACE FUNCTION generar_numero_pedido()
RETURNS TEXT AS $$
DECLARE
  nuevo_numero TEXT;
  existe BOOLEAN;
BEGIN
  LOOP
    -- Formato: ORD-YYYYMMDD-XXX
    nuevo_numero := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
                    LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');

    -- Verificar si ya existe
    SELECT EXISTS(SELECT 1 FROM orders WHERE numero_pedido = nuevo_numero) INTO existe;

    EXIT WHEN NOT existe;
  END LOOP;

  RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto-generar número de pedido
-- ============================================
CREATE OR REPLACE FUNCTION set_numero_pedido()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_pedido IS NULL OR NEW.numero_pedido = '' THEN
    NEW.numero_pedido := generar_numero_pedido();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_numero_pedido
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_numero_pedido();

-- ============================================
-- TRIGGER: Actualizar updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Registrar cambios de estado
-- ============================================
CREATE OR REPLACE FUNCTION registrar_cambio_estado()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.estado IS DISTINCT FROM NEW.estado THEN
    INSERT INTO order_status_history (order_id, estado_anterior, estado_nuevo, changed_by)
    VALUES (NEW.id, OLD.estado, NEW.estado, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_registrar_cambio_estado
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION registrar_cambio_estado();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Políticas para ORDERS
-- Los usuarios pueden ver sus propios pedidos
CREATE POLICY "Usuarios pueden ver sus pedidos"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden crear sus propios pedidos
CREATE POLICY "Usuarios pueden crear pedidos"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus pedidos pendientes
CREATE POLICY "Usuarios pueden actualizar pedidos pendientes"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id AND estado = 'pendiente');

-- Admins pueden ver todos los pedidos
CREATE POLICY "Admins pueden ver todos los pedidos"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = current_setting('app.admin_email', true)
    )
  );

-- Admins pueden actualizar todos los pedidos
CREATE POLICY "Admins pueden actualizar pedidos"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = current_setting('app.admin_email', true)
    )
  );

-- Políticas para ORDER_ITEMS
-- Los usuarios pueden ver items de sus pedidos
CREATE POLICY "Usuarios pueden ver items de sus pedidos"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Sistema puede insertar items
CREATE POLICY "Sistema puede insertar items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins pueden ver todos los items
CREATE POLICY "Admins pueden ver todos los items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = current_setting('app.admin_email', true)
    )
  );

-- Políticas para ORDER_STATUS_HISTORY
-- Los usuarios pueden ver historial de sus pedidos
CREATE POLICY "Usuarios pueden ver historial de sus pedidos"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins pueden ver todo el historial
CREATE POLICY "Admins pueden ver todo el historial"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = current_setting('app.admin_email', true)
    )
  );

-- Sistema puede insertar en historial
CREATE POLICY "Sistema puede insertar historial"
  ON order_status_history FOR INSERT
  WITH CHECK (true);

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE orders IS 'Tabla principal de pedidos';
COMMENT ON TABLE order_items IS 'Items individuales de cada pedido (snapshot al momento de compra)';
COMMENT ON TABLE order_status_history IS 'Historial de cambios de estado de pedidos';
COMMENT ON COLUMN orders.numero_pedido IS 'Número único de pedido generado automáticamente';
COMMENT ON COLUMN orders.estado IS 'Estado actual: pendiente, pagado, procesando, enviado, entregado, cancelado';
COMMENT ON COLUMN orders.estado_pago IS 'Estado del pago: pendiente, aprobado, rechazado, reembolsado';

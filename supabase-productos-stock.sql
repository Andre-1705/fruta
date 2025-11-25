-- ============================================
-- AGREGAR CAMPO STOCK A PRODUCTOS
-- ============================================

-- Agregar columnas de stock
ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0 CHECK (stock >= 0),
ADD COLUMN IF NOT EXISTS stock_minimo INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS disponible BOOLEAN DEFAULT true;

-- Índice para búsquedas por disponibilidad
CREATE INDEX IF NOT EXISTS idx_products_disponible ON products(disponible);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- ============================================
-- VISTA: Productos con bajo stock
-- ============================================
CREATE OR REPLACE VIEW productos_bajo_stock AS
SELECT
  id,
  name as nombre,
  stock,
  stock_minimo,
  disponible,
  (stock_minimo - stock) as unidades_necesarias
FROM products
WHERE stock <= stock_minimo
ORDER BY stock ASC;

-- ============================================
-- FUNCIÓN: Verificar stock disponible antes de crear pedido
-- ============================================
CREATE OR REPLACE FUNCTION verificar_stock_disponible(
  p_items JSONB
)
RETURNS TABLE(producto_id UUID, stock_disponible INTEGER, stock_solicitado INTEGER, suficiente BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (item->>'producto_id')::UUID as producto_id,
    p.stock as stock_disponible,
    (item->>'cantidad')::INTEGER as stock_solicitado,
    p.stock >= (item->>'cantidad')::INTEGER as suficiente
  FROM jsonb_array_elements(p_items) as item
  JOIN products p ON p.id = (item->>'producto_id')::UUID;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON COLUMN products.stock IS 'Cantidad disponible en inventario';
COMMENT ON COLUMN products.stock_minimo IS 'Umbral para alertas de stock bajo';
COMMENT ON COLUMN products.disponible IS 'Si el producto está disponible para venta';
COMMENT ON VIEW productos_bajo_stock IS 'Vista de productos que necesitan reposición';

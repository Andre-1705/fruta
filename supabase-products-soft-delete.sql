-- ============================================
-- SOFT DELETE PARA PRODUCTS
-- ============================================

-- Agrega columna 'activo' para soft delete, por defecto true
ALTER TABLE products
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Asegura que todos los existentes queden activos
UPDATE products SET activo = true WHERE activo IS NULL;

-- Índice para filtrar por activos
CREATE INDEX IF NOT EXISTS idx_products_activo ON products(activo);

-- Comentarios
COMMENT ON COLUMN products.activo IS 'Indica si el producto está activo (soft delete)';

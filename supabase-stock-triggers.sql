-- ============================================
-- TRIGGERS DE STOCK (ejecutar DESPUÉS de crear orders)
-- ============================================

-- ============================================
-- FUNCIÓN: Descontar stock cuando se aprueba pago
-- ============================================
CREATE OR REPLACE FUNCTION trigger_descontar_stock()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
BEGIN
  -- Solo descontar stock cuando pasa de otro estado a "aprobado"
  IF NEW.estado_pago = 'aprobado' AND (OLD.estado_pago IS NULL OR OLD.estado_pago != 'aprobado') THEN
    FOR item IN
      SELECT producto_id, cantidad
      FROM order_items
      WHERE order_id = NEW.id
    LOOP
      UPDATE products
      SET stock = GREATEST(stock - item.cantidad, 0),
          disponible = (stock - item.cantidad > 0)
      WHERE id = item.producto_id;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_descontar_stock_al_pagar ON orders;
CREATE TRIGGER trigger_descontar_stock_al_pagar
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_descontar_stock();

-- ============================================
-- FUNCIÓN: Restaurar stock si se cancela pedido
-- ============================================
CREATE OR REPLACE FUNCTION restaurar_stock_pedido()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
BEGIN
  -- Solo restaurar si el pedido ya había sido pagado
  IF OLD.estado_pago = 'aprobado' AND NEW.estado = 'cancelado' THEN
    FOR item IN
      SELECT producto_id, cantidad
      FROM order_items
      WHERE order_id = NEW.id
    LOOP
      UPDATE products
      SET stock = stock + item.cantidad,
          disponible = true
      WHERE id = item.producto_id;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_restaurar_stock_cancelacion ON orders;
CREATE TRIGGER trigger_restaurar_stock_cancelacion
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION restaurar_stock_pedido();

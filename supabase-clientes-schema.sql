-- Tabla de clientes para Supabase
-- Ejecutar en: Panel Supabase → SQL Editor → New Query → pegar y Run

-- Crear tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text,
  telefono text,
  direccion text,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_created_at ON clientes(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden leer clientes
CREATE POLICY "Usuarios autenticados pueden leer clientes"
  ON clientes
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo usuarios autenticados pueden insertar clientes
CREATE POLICY "Usuarios autenticados pueden crear clientes"
  ON clientes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar clientes
CREATE POLICY "Usuarios autenticados pueden actualizar clientes"
  ON clientes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar clientes
CREATE POLICY "Usuarios autenticados pueden eliminar clientes"
  ON clientes
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentarios para documentación
COMMENT ON TABLE clientes IS 'Tabla de clientes del sistema';
COMMENT ON COLUMN clientes.id IS 'UUID único del cliente';
COMMENT ON COLUMN clientes.nombre IS 'Nombre completo del cliente';
COMMENT ON COLUMN clientes.email IS 'Email del cliente (opcional)';
COMMENT ON COLUMN clientes.telefono IS 'Teléfono de contacto (opcional)';
COMMENT ON COLUMN clientes.direccion IS 'Dirección de envío o facturación (opcional)';
COMMENT ON COLUMN clientes.notas IS 'Notas adicionales sobre el cliente (opcional)';

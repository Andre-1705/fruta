import { vi } from 'vitest';

// Mock de datos de prueba
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  user_metadata: {
    nombre: 'Usuario Test'
  }
};

export const mockProducts = [
  {
    id: 'prod-1',
    nombre: 'Manzana',
    precio: 100,
    categoria: 'frutas',
    stock: 50,
    disponible: true,
    img: 'https://example.com/manzana.jpg',
    descripcion: 'Manzana fresca'
  },
  {
    id: 'prod-2',
    nombre: 'Banana',
    precio: 80,
    categoria: 'frutas',
    stock: 30,
    disponible: true,
    img: 'https://example.com/banana.jpg',
    descripcion: 'Banana madura'
  }
];

export const mockCliente = {
  id: 'cliente-1',
  email: 'cliente@test.com',
  nombre: 'Juan Pérez',
  telefono: '1234567890',
  direccion: 'Calle Falsa 123'
};

export const mockOrder = {
  id: 'order-1',
  numero_pedido: 'ORD-20260214-001',
  estado: 'pendiente',
  total: 500,
  created_at: new Date().toISOString(),
  email_destinatario: 'test@example.com'
};

// Mock del cliente de Supabase
export const createMockSupabaseClient = () => {
  const mockClient = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token-123' } },
        error: null
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token-123' } },
        error: null
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn((callback) => {
        // Simular cambio de estado
        return {
          data: { subscription: { unsubscribe: vi.fn() } }
        };
      })
    },
    from: vi.fn((table) => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      then: vi.fn((callback) => {
        // Mock de respuesta según la tabla
        if (table === 'products') {
          return Promise.resolve(callback({ data: mockProducts, error: null }));
        }
        if (table === 'clientes') {
          return Promise.resolve(callback({ data: [mockCliente], error: null }));
        }
        if (table === 'orders') {
          return Promise.resolve(callback({ data: [mockOrder], error: null }));
        }
        return Promise.resolve(callback({ data: [], error: null }));
      })
    }))
  };

  return mockClient;
};

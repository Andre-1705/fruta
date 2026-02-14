import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.MercadoPago
global.MercadoPago = vi.fn(() => ({
  checkout: vi.fn()
}));

// Mock de import.meta.env
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
      VITE_MP_PUBLIC_KEY: 'TEST-mp-public-key',
      VITE_ADMIN_EMAIL: 'admin@test.com',
      VITE_RESEND_API_KEY: 'test-resend-key',
      VITE_FROM_EMAIL: 'test@test.com'
    }
  }
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
  debug: vi.fn(),
};

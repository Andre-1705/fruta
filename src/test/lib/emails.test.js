import { describe, it, expect } from 'vitest';
import { enviarEmailConfirmacion, enviarEmailActualizacionEstado } from '../../lib/emails';

describe('emails.js', () => {
  it('debe estar definido enviarEmailConfirmacion', () => {
    expect(enviarEmailConfirmacion).toBeTruthy();
  });

  it('debe estar definido enviarEmailActualizacionEstado', () => {
    expect(enviarEmailActualizacionEstado).toBeTruthy();
  });
});

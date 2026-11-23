import { crearTokenAccesoLectura, tokenAccesoLecturaValido, crearTokenRecuperacion, tokenRecuperacionValido } from './password-reset.util';

describe('enlace de acceso de la cuenta solo carta', () => {
  it('vale con el hash de la cuenta y se puede usar más de una vez', () => {
    const t = crearTokenAccesoLectura('u1', 'hash-a');
    expect(tokenAccesoLecturaValido(t, 'hash-a')).toBe(true);
    expect(tokenAccesoLecturaValido(t, 'hash-a')).toBe(true);
  });
  it('muere si cambia la contraseña de la cuenta', () => {
    expect(tokenAccesoLecturaValido(crearTokenAccesoLectura('u1', 'hash-a'), 'hash-b')).toBe(false);
  });
  it('caducado no vale', () => {
    expect(tokenAccesoLecturaValido(crearTokenAccesoLectura('u1', 'hash-a', -1000), 'hash-a')).toBe(false);
  });
  it('un token de recuperación no sirve para entrar, ni al revés', () => {
    expect(tokenAccesoLecturaValido(crearTokenRecuperacion('u1', 'hash-a'), 'hash-a')).toBe(false);
    expect(tokenRecuperacionValido(crearTokenAccesoLectura('u1', 'hash-a'), 'hash-a')).toBe(false);
  });
});

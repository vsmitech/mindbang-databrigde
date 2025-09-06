import { authService } from '../services/authService';

describe('authService', () => {
  it('debería iniciar sesión correctamente', async () => {
    const data = await authService.login('test@email.com', '123456');
    expect(data.token).toBeDefined();
  });

  it('debería retornar token actual', () => {
    const token = authService.getToken();
    expect(typeof token).toBe('string');
  });

  it('debería indicar si está autenticado', () => {
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('debería cerrar sesión correctamente', () => {
    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
  });
});

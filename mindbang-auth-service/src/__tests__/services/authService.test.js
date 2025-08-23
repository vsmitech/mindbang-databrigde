const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authService = require('../../services/authService');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('authService - autenticación y gestión de usuarios', () => {
  const mockUserData = {
    username: 'felipe',
    email: 'felipe@vsmitech.com',
    password: 'secure123',
    clientId: new mongoose.Types.ObjectId()
  };

  it('debe registrar un nuevo usuario', async () => {
    const user = await authService.register(mockUserData);
    expect(user.email).toBe(mockUserData.email);
    expect(user.username).toBe(mockUserData.username);
    expect(user.password).not.toBe(mockUserData.password);
  });

  it('no debe permitir registro con email duplicado', async () => {
    await authService.register(mockUserData);
    await expect(authService.register(mockUserData)).rejects.toThrow('El correo ya está registrado');
  });

  it('debe iniciar sesión y retornar un token válido', async () => {
    await authService.register(mockUserData);
    const token = await authService.login(mockUserData.email, mockUserData.password);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
  });

  it('debe fallar login con contraseña incorrecta', async () => {
    await authService.register(mockUserData);
    await expect(authService.login(mockUserData.email, 'wrongpass')).rejects.toThrow('Contraseña incorrecta');
  });

  it('debe obtener el perfil del usuario sin contraseña', async () => {
    const user = await authService.register(mockUserData);
    const profile = await authService.getProfile(user._id);
    expect(profile.email).toBe(mockUserData.email);
    expect(profile.password).toBeUndefined();
  });

  it('debe cambiar la contraseña correctamente', async () => {
    const user = await authService.register(mockUserData);
    await authService.changePassword(user._id, mockUserData.password, 'newpass123');
    const updatedUser = await User.findById(user._id);
    const isValid = await updatedUser.isValidPassword('newpass123');
    expect(isValid).toBe(true);
  });

  it('debe validar el token JWT correctamente', async () => {
    const user = await authService.register(mockUserData);
    const token = await authService.login(mockUserData.email, mockUserData.password);
    const isValid = await authService.validateToken(token);
    expect(isValid).toBe(true);
  });

  it('debe listar todos los usuarios', async () => {
    await authService.register(mockUserData);
    const users = await authService.listUsers();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe(mockUserData.email);
  });
});

describe('authService - recuperación y verificación de cuenta', () => {
  const mockUserData = {
    username: 'felipe',
    email: 'felipe@vsmitech.com',
    password: 'secure123',
    clientId: new mongoose.Types.ObjectId()
  };

  it('debe enviar email de recuperación y resetear contraseña', async () => {
    const user = await authService.register(mockUserData);
    const sent = await authService.sendRecoveryEmail(user.email);
    expect(sent).toBe(true);

    const recoveryToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'defaultsecret', {
      expiresIn: '15m'
    });

    const result = await authService.resetPassword(recoveryToken, 'newSecure456');
    expect(result).toBe(true);

    const updatedUser = await User.findById(user._id);
    const isValid = await updatedUser.isValidPassword('newSecure456');
    expect(isValid).toBe(true);
  });

  it('debe verificar el email con token', async () => {
    const user = await authService.register(mockUserData);
    const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'defaultsecret', {
      expiresIn: '15m'
    });

    const verified = await authService.verifyEmail(verificationToken);
    expect(verified).toBe(true);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.verified).toBe(true);
  });

  it('debe reenviar el email de verificación', async () => {
    const user = await authService.register(mockUserData);
    const result = await authService.resendVerification(user.email);
    expect(result).toBe(true);
  });
});

const authService = require('../services/authService');
// Registro de usuario
exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};
// Login de usuario
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
};

// Logout de usuario
exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.user);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

// Refrescar token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const newToken = await authService.refreshToken(refreshToken);
    res.status(200).json({ message: 'Token refreshed', token: newToken });
  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario actual
exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Recuperación y cambio de contraseña
exports.forgotPassword = async (req, res, next) => {
  try {
    await authService.sendRecoveryEmail(req.body.email);
    res.status(200).json({ message: 'Recovery email sent' });
  } catch (error) {
    next(error);
  }
};

// Resetear contraseña
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// Cambiar contraseña (usuario autenticado)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// Verificación de email
exports.verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.body.token);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

// Reenviar email de verificación
exports.resendVerification = async (req, res, next) => {
  try {
    await authService.resendVerification(req.body.email);
    res.status(200).json({ message: 'Verification email resent' });
  } catch (error) {
    next(error);
  }
};

// Validar token
exports.validateToken = async (req, res, next) => {
  try {
    const isValid = await authService.validateToken(req.body.token);
    res.status(200).json({ valid: isValid });
  } catch (error) {
    next(error);
  }
};

// Obtener roles del usuario
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await authService.getRoles(req.user.id);
    res.status(200).json({ roles });
  } catch (error) {
    next(error);
  }
};

// Listar todos los usuarios (solo admin)
exports.listUsers = async (req, res, next) => {
  try {
    const users = await authService.listUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario por ID (solo admin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Actualizar usuario (solo admin)
exports.updateUser = async (req, res, next) => {
  try {
    const updated = await authService.updateUser(req.params.id, req.body);
    res.status(200).json({ message: 'User updated', user: updated });
  } catch (error) {
    next(error);
  }
};

// Eliminar usuario (solo admin)
exports.deleteUser = async (req, res, next) => {
  try {
    await authService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
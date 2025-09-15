const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model
const Role = require('../models/Role'); // Role model
const App = require('../models/App'); // App model

const SALT_ROUNDS = 10; // Nivel de complejidad para bcrypt
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'; // Clave secreta para JWT
const JWT_EXPIRES_IN = '1h'; // Tiempo de expiración del token

//Registro de usuario
exports.registerUser = async ({ username, email, password, clientId,roles}) => {

    // Verificacion de existencia del usuario
    console.log("Registering user with email:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log("User already exists :", existingUser);
        throw new Error('El correo ya está registrado');
    }

    // Hashing de la contraseña
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // Creación del nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword, clientId, roles: roles || ['user'] });

    try {
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        throw new Error('Error registrando usuario: ' + error.message);
    }
};

//Login de usuario
exports.login = async (email, password, appSlug) => {

    // 1. Verificar la existencia del usuario y poblar sus roles
    // La clave es el .populate('roles')
    const user = await User.findOne({ email }).populate('roles');
    if (!user) {
        throw new Error('Usuario no encontrado');
    }    
    console.log("App slug provided:", appSlug);
    console.log("Validating access to app slug:", appSlug); 
    const app =  await App.findOne({slug:appSlug});
    console.log("App found:", app);
    if(!app) {
        console.log("App not found for slug:", appSlug);
        throw new Error("Aplicación no encontrada");        
    }

    // 2. Comparar la contraseña correctamente (bcrypt se encarga del hasheo)
    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
    if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
    }

    // 3. Crear un array con los nombres de los roles    
    const roleNames = user.roles.map(role => role.role);
    
    // 4. Generar el token JWT con los nombres de los roles
    const token = jwt.sign(
        {
            _id: user._id,
            email: user.email,
            roles: roleNames // <--- ¡Ahora se incluyen los nombres de los roles!
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
    return token;
};

exports.logout = async (token) => {
    // En un sistema sin estado (stateless) como JWT, el logout se maneja en el cliente eliminando el token.
    // Si se desea invalidar tokens, se puede implementar una lista de revocación (blacklist) en la base de datos.
    return true;
}
// Refresh token (simulado)
exports.refreshToken = async (refreshToken) => {
  // Aquí deberías validar el refreshToken y emitir uno nuevo
  const payload = jwt.verify(refreshToken, JWT_SECRET); // solo si usas el mismo secreto
  const newToken = jwt.sign({ _id: payload._id, email: payload.email,roles:payload.roles }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  return newToken;
};

// Perfil del usuario autenticado
exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('Usuario no encontrado');
  return user;
};

// Envío de email de recuperación (simulado)
exports.sendRecoveryEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Usuario no encontrado');

  // Aquí generarías un token temporal y lo enviarías por email
  const recoveryToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
  console.log(`📧 Token de recuperación para ${email}: ${recoveryToken}`);
  return true;
};

// Reset de contraseña con token
exports.resetPassword = async (token, newPassword) => {
  const payload = jwt.verify(token, JWT_SECRET);
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await User.findByIdAndUpdate(payload.userId, { password: hashedPassword });
  return true;
};

// Cambio de contraseña autenticado
exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new Error('Contraseña actual incorrecta');

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.password = hashedPassword;
  await user.save();
  return true;
};

// Verificación de email (simulado)
exports.verifyEmail = async (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
  await User.findByIdAndUpdate(payload.userId, { verified: true });
  return true;
};

// Reenvío de verificación (simulado)
exports.resendVerification = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Usuario no encontrado');

  const verificationToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
  console.log(`📧 Token de verificación para ${email}: ${verificationToken}`);
  return true;
};

// Validación de token
exports.validateToken = async (token) => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

// Obtener roles del usuario
exports.getRoles = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');
  return [user.roles]; // puedes extender a múltiples roles si lo necesitas
};

// Listar todos los roles (solo admin)
exports.listRoles = async () => {  
  const roles = await Role.find();
  if(!roles) throw new Error('No roles found');
  return roles;
};

// Administración de usuarios (solo admin)
exports.listUsers = async () => {

  let users = await User.find().populate('roles').select('-password');
  return users;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  console.log('User found:', user);
  if (!user) throw new Error('Usuario no encontrado');
  return user;
};

exports.updateUser = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  const updated = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
  return updated;
};

exports.deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
  return true;
};
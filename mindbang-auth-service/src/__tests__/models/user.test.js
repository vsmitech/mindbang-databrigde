const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

describe('User Model Test Suite', () => {
  jest.setTimeout(30000);

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Limpieza post-test
    await mongoose.connection.close();
  });

  it('should create a new user with hashed password', async () => {
    const passwordHash = await bcrypt.hash('hashedpassword', 10);

    const user = new User({
      username: 'admin',
      email: 'contacto@vsmitech.com',
      password: passwordHash,
      roles: ['admin']
    });

    const savedUser = await user.save();
    expect(savedUser.username).toBe('admin');
    expect(savedUser.email).toBe('contacto@vsmitech.com');
    expect(savedUser.password).not.toBe('hashedpassword');
  });

  it('should validate password correctly', async () => {
    const user = new User({
      username: 'tester',
      email: 'tester@vsmitech.com',
      password: await bcrypt.hash('secure123', 10),
      roles: ['user']
    });

    await user.save();

    const isValid = await user.isValidPassword('secure123');
    expect(isValid).toBe(true);

    const isInvalid = await user.isValidPassword('wrongpass');
    expect(isInvalid).toBe(false);
  });

  it('should check user role correctly', async () => {
    const user = new User({
      username: 'rolecheck',
      email: 'role@vsmitech.com',
      password: await bcrypt.hash('rolepass', 10),
      roles: ['admin', 'editor']
    });

    await user.save();

    expect(user.hasRole('admin')).toBe(true);
    expect(user.hasRole('editor')).toBe(true);
    expect(user.hasRole('user')).toBe(false);
  });

  it('should default verified to false', async () => {
    const user = new User({
      username: 'verifytest',
      email: 'verify@vsmitech.com',
      password: await bcrypt.hash('verify123', 10),
      roles: ['user']
    });

    const savedUser = await user.save();
    expect(savedUser.verified).toBe(false);
  });
});

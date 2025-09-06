const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/Role');

describe('Role Model Test Suite', () => {
  jest.setTimeout(30000);

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Limpieza post-test
    await mongoose.connection.close();
  });

  it('should create a new role ', async () => {    

    const role = new Role({
      name: 'tester'
    });

    const savedRole = await user.save();
    expect(savedUser.username).toBe('tester');    
  });  
});

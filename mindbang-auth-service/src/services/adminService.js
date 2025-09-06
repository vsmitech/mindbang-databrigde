const Role = require('../models/Role');

exports.createRole = async (roleData) => {
  const role = new Role(roleData);
  return await role.save();
}

exports.updateRole = async (roleId, updateData) => {
  return await Role.findByIdAndUpdate(roleId, updateData, { new: true });
}   

exports.deleteRole = async (roleId) => {
  return await Role.findByIdAndDelete(roleId);
}

exports.listRoles = async () => {
  return await Role.find();
}
const adminService = require('../services/adminService');
// Crear nuevo rol
exports.createRole = async (req, res, next) => {
    try {
        const role = await adminService.createRole(req.body);
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        next(error);
    }
};

// Actualizar rol existente
exports.updateRole = async (req, res, next) => {
    try {
        const role = await adminService.updateRole(req.params.id, req.body);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role updated successfully', role });
    } catch (error) {
        next(error);
    }
};
// Eliminar rol
exports.deleteRole = async (req, res, next) => {
    try {
        const role = await adminService.deleteRole(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.listRoles = async (req, res, next) => {
    try {
        const roles = await adminService.listRoles();
        res.status(200).json({ roles });
    } catch (error) {
        next(error);
    }
}

exports.getRoleById = async (req, res, next) => {  
    try {
        const role = await adminService.getRoleById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        next(error);
    }
}
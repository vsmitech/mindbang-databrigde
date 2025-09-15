const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const Permision = require('../models/Permision');
const App = require('../models/App');
const { generateApiKey } = require('./utilCrypto');

/**
 * Función para inicializar la base de datos con roles y un usuario superadministrador por defecto.
 * Esta función es idempotente, lo que significa que se puede ejecutar múltiples veces sin efectos no deseados.
 */
const seedDatabase = async () => {
    try {
        const defaultRoles = ['sys-admin', 'admin', 'viewer', 'user'];
        const superAdminRoleName = 'sys-admin';
        const defaultSystemPermissions = ['read', 'write', 'delete'];
        const appIds = []; // Aquí puedes agregar los IDs de las aplicaciones si es necesario

        console.log('Verificando y creando aplicaciones por defecto...');
        // Crear aplicación mindbang-admin si no existe
        const adminApp = await App.findOneAndUpdate(
            { slug: process.env.APP_ADMIN_SLUG },
            { 
                name: 'MindBang Admin', 
                description: 'Aplicación de administración principal',
                slug: process.env.APP_ADMIN_SLUG, 
                apiKey: generateApiKey(process.env.APP_ADMIN_SLUG) 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`Aplicación mindbang-admin registrada con ID: ${adminApp._id}`);


        // Crear aplicación mindbang-databrigde si no existe
        const dataBrigdeApp = await App.findOneAndUpdate(
            { slug: process.env.APP_DATABRIGDE_SLUG },
            { 
                name: 'MindBang DataBrigde', 
                description: 'Aplicación de integración de datos',
                slug: process.env.APP_DATABRIGDE_SLUG, 
                apiKey: generateApiKey(process.env.APP_DATABRIGDE_SLUG) 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`Aplicación mindbang-databrigde registrada con ID: ${dataBrigdeApp._id}`);
        appIds.push(adminApp._id, dataBrigdeApp._id);



        console.log('Verificando y creando permisos por defecto...');
        // 1. Crear los permisos si no existen
        const permisionRecords = await Promise.all(
            defaultSystemPermissions.map(permisionName =>
                Permision.findOneAndUpdate(
                    { permision: permisionName },
                    { permision: permisionName },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
            )
        );

        // Obtener los IDs de todos los permisos creados
        const allPermissionIds = permisionRecords.map(p => p._id);

        console.log('Verificando y creando roles por defecto...');
        // 2. Crear los roles si no existen y asignarles permisos
        const roleRecords = await Promise.all(
            defaultRoles.map(roleName => {
                const permissionsToAssign = [];
                // Se asignan todos los permisos a sys-admin y admin, y solo 'read' a los demás
                if (roleName === superAdminRoleName || roleName === 'admin') {
                    permissionsToAssign.push(...allPermissionIds);
                } else {
                    const readPermission = permisionRecords.find(p => p.permision === 'read');
                    if (readPermission) {
                        permissionsToAssign.push(readPermission._id);
                    }
                }

                const isSystemRole = roleName === superAdminRoleName;

                return Role.findOneAndUpdate(
                    { role: roleName },
                    { role: roleName, permisions: permissionsToAssign, isSystem: isSystemRole },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            })
        );

        
        

        
        // Obtener los IDs de los roles que le corresponden al superadministrador
        const rolesForSuperAdmin = roleRecords
            .filter(role => role.role === superAdminRoleName)
            .map(role => role._id);

        const superAdminEmail = process.env.SUPERADMIN_EMAIL;
        const superAdminPassword = process.env.SUPERADMIN_PASSWORD;
        const superAdminUsername = process.env.SUPERADMIN_USERNAME;

        console.log('Superadmin password from env:', superAdminPassword ? superAdminPassword: 'Not Set');        


        // 3. Crear el usuario superadministrador si no existe
        console.log('Verificando usuario superadministrador...');
        const existingAdmin = await User.findOne({ email: superAdminEmail });

        if (!existingAdmin) {
            console.log('Usuario superadministrador no encontrado. Creando por defecto...');
            const newAdmin = new User({
                username: superAdminUsername || 'superadmin',
                email: superAdminEmail,
                password: superAdminPassword,
                roles: rolesForSuperAdmin, // Asigna los IDs de los roles
                applicationSlugs: ['mindbang-admin', 'mindbang-databrigde'], // Asigna los slugs de las aplicaciones
                applications: appIds // Asigna los IDs de las aplicaciones
            });

            await newAdmin.save();
            console.log('Usuario superadministrador creado con éxito.');
        } else {
            console.log('El usuario superadministrador ya existe.');
        }

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
};

module.exports = seedDatabase;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Usar bcryptjs por su compatibilidad
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true
    },      
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: v => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
            message: props => `${props.value} no es un correo válido!`
        }
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: Schema.Types.ObjectId, // Referencia al esquema de roles
        ref: 'Role' 
    }],
    verified: {
        type: Boolean,
        default: false
    },
    clientId: {
        type: Schema.Types.ObjectId, // Referencia a la organización
        ref: 'Organization',
        required: false
    },
    lastLogin: Date,
    passwordChangedAt: Date
}, {
    timestamps: true
});

// Middleware 'pre' de Mongoose para hashear la contraseña antes de guardar
// La mejor práctica es que el hashing ocurra aquí, no en el controlador.
userSchema.pre('save', async function (next) {
    // Si la contraseña no ha sido modificada, pasa al siguiente middleware
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método de instancia para validar la contraseña
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Método para verificar si el usuario tiene un rol
userSchema.methods.hasRole = function (roleName) {
    // Usar el método 'some' para verificar si algún elemento cumple la condición
    // Asume que el rol ya fue populado
    return this.roles.some(r => r.role === roleName);
};

module.exports = mongoose.model('User', userSchema);
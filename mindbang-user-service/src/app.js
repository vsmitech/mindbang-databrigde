const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const clientRoutes = require('./routes/clientRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const envFile = {
  test: '.env.test',
  production: '.env.prod',
  development: '.env.dev'
}[process.env.NODE_ENV || 'development'];



// Cargar variables de entorno
dotenv.config({ path: envFile });

console.log('Environment:', process.env.NODE_ENV);
console.log('Mongo URI:', process.env.MONGO_URI);

const app = express();

// Middlewares base
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// Rutas principales
app.use('/api/clients', clientRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/sessions', sessionRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error del servidor', error: err.message });
});

module.exports = app;


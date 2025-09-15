const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const clientRoutes = require('./routes/clientRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const sessionRoutes = require('./routes/sessionRoutes');



function createApp(DB_URI) {
    const app = express();
    app.use(express.json());
    // Middlewares base
    app.use(helmet());
    app.use(morgan('dev'));

    if (process.env.NODE_ENV === 'development') {
        console.log('CORS habilitado para desarrollo');
        app.use(cors(
            {
                origin: process.env.CLIENT_URL || 'http://localhost:3001',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization'],
                credentials: true
            }
        ));
    }
    else
        app.use(cors());

    app.use('/api/clients', clientRoutes);
    app.use('/api/users', userProfileRoutes);
    app.use('/api/sessions', sessionRoutes);

    // Middleware de manejo de errores
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error del servidor', error: err.message });
    });

    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB');
        //if (dbInitializer && typeof dbInitializer === 'function') {
        //dbInitializer(); // Llama a la función de inicialización aquí
        //}
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });

    // Middleware de manejo de errores
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error del servidor', error: err.message });
    });
    return app;
}


module.exports = createApp;





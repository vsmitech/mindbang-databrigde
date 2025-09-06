// app.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

function createApp(DB_URI, dbInitializer) {


  const app = express();
  app.use(express.json());

  const cors = require('cors');

  if (process.env.NODE_ENV === 'development') {
    console.log('CORS habilitado para desarrollo');
    app.use(cors(
      {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
      }
    ));
  }
  else
    app.use(cors());


  app.use('/api/auth', authRoutes);
  app.use('/api/private', require('./routes/privateRoutes'));
  // Middleware de manejo de errores
  app.use(errorHandler);

  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
    if (dbInitializer && typeof dbInitializer === 'function') {
      dbInitializer(); // Llama a la función de inicialización aquí
    }
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

  return app;
}

module.exports = createApp;

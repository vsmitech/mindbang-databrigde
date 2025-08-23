// index.js
const dotenv = require('dotenv');


const envFile = {
  test: '.env.test',
  production: '.env.prod',
  development: '.env.dev'
}[process.env.NODE_ENV || 'development'];

//Asegurar que la variable de entorno NODE_ENV esté definida
console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
console.log(`📦 Archivo cargado: ${envFile}`);

dotenv.config({ path: envFile });


const cors = require('cors');
const createApp = require('./app');

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
  throw new Error('Falta MONGO_URI en el archivo .env');
}

const app = createApp(DB_URI);

app.use(cors());

app.listen(PORT, () => {
  console.log(`Database URI: ${DB_URI}`);
  console.log(`Auth service running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

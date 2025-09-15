const dotenv = require('dotenv');
const createApp = require('./app');


const envFile = {
  test: '.env.test',
  production: '.env.prod',
  development: '.env.dev'
}[process.env.NODE_ENV || 'development'];

//notificar que variable de entorno NODE_ENV está definida
console.log(`📦 Archivo cargado: ${envFile}`);

dotenv.config({ path: envFile });

console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
console.log(`🔑 PORT: ${process.env.PORT}`);
console.log(`Client URL: ${process.env.CLIENT_URL? process.env.CLIENT_URL : 'No definido'}`);

const PORT = process.env.PORT || 3001;
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
  throw new Error('Falta MONGO_URI en el archivo .env');
}

const app = createApp(DB_URI);

app.listen(PORT, () => {
  console.log(`Database URI: ${DB_URI}`);
  console.log(`Auth service running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});






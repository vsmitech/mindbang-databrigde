# 🛡️ MindBang Auth Service

Servicio de autenticación modular para plataformas multicliente. Implementa registro, login y emisión de tokens JWT con validación de credenciales y seguridad integrada.

---

## 🚀 Flujo de funcionamiento

### 1. Registro de usuario (`POST /api/auth/register`)
- Recibe: `name`, `email`, `password`
- Hashea la contraseña con `bcrypt`
- Guarda el usuario en MongoDB
- Devuelve: objeto `user` sin contraseña

### 2. Login (`POST /api/auth/login`)
- Recibe: `email`, `password`
- Busca el usuario por email
- Compara la contraseña con el hash usando `bcrypt.compare`
- Si es válido, genera un token JWT
- Devuelve: `token` firmado

### 3. Middleware de errores
- Captura excepciones y errores de validación
- Devuelve respuesta estructurada con `success: false`

---

## 🧪 Endpoints disponibles

| Método | URL                        | Descripción         |
|--------|----------------------------|---------------------|
| POST   | `/api/auth/register`       | Registro de usuario |
| POST   | `/api/auth/login`          | Login y JWT         |

---

## ⚙️ Variables de entorno

El servicio carga variables desde `.env`, `.env.prod` o `.env.test` según el entorno:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mindbang-auth
JWT_SECRET=clave-super-secreta

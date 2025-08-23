const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

describe('authMiddleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Ruta protegida solo por token
    app.get('/protected', verifyToken, (req, res) => {
      res.status(200).json({ message: 'Token válido', user: req.user });
    });

    // Ruta protegida por token + rol
    app.get('/admin', verifyToken, requireRole(['admin']), (req, res) => {
      res.status(200).json({ message: 'Acceso autorizado para admin' });
    });
  });

  it('debe rechazar acceso sin token', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided');
  });

  it('debe rechazar acceso con token inválido', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid token');
  });

  it('debe permitir acceso con token válido', async () => {
    const token = jwt.sign({ userId: '123', email: 'felipe@vsmitech.com', role: 'user' }, JWT_SECRET);
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('felipe@vsmitech.com');
  });

  it('debe permitir acceso a ruta con rol admin', async () => {
    const token = jwt.sign({ userId: '123', email: 'admin@vsmitech.com', role: 'admin' }, JWT_SECRET);
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Acceso autorizado para admin');
  });

  it('debe rechazar acceso si el rol no es suficiente', async () => {
    const token = jwt.sign({ userId: '123', email: 'user@vsmitech.com', role: 'user' }, JWT_SECRET);
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Access denied: insufficient role');
  });
});

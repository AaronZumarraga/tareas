import express from 'express';
import cors from 'cors';
import { getPool } from './database.js';
import { 
  hashPassword, verifyPassword, generateToken, 
  validateTokenMiddleware, invalidateToken 
} from './auth.js';
import { UserRepository, TaskRepository } from './repository.js';
import { HTTP_STATUS } from './constants.js';

const app = express();
app.use(cors());
app.use(express.json());

// Decorator Pattern: Wrapper para manejo de errores centralizado
const safeHandler = (fn) => async (req, res, next) => {
  try { 
    await fn(req, res, next); 
  } catch (error) {
    console.error(`Error [${req.method} ${req.path}]:`, error.message);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ message: error.message });
  }
};

// --- Rutas Públicas ---
app.get('/api/health', safeHandler(async (req, res) => {
  await getPool(); // Verifica conexión
  res.json({ status: 'ok', db: 'connected' });
}));

app.post('/api/auth/register', safeHandler(async (req, res) => {
  const { email, password, nombre, apellido } = req.body;
  if (await UserRepository.findByEmail(email)) return res.status(HTTP_STATUS.CONFLICT).send('Correo registrado');
  
  const user = await UserRepository.create({ nombre, apellido, email, password: hashPassword(password) });
  res.status(HTTP_STATUS.CREATED).json({ ...user, token: generateToken(user.id) });
}));

app.post('/api/auth/login', safeHandler(async (req, res) => {
  const user = await UserRepository.findByEmail(req.body.email);
  if (!user || !verifyPassword(req.body.password, user.password)) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).send('Credenciales inválidas');
  }
  const { password, ...safeUser } = user;
  res.json({ ...safeUser, token: generateToken(user.id) });
}));

// --- Rutas Protegidas (Middleware Pattern) ---
app.use('/api', validateTokenMiddleware);

app.post('/api/auth/logout', (req, res) => {
  invalidateToken(req.token);
  res.json({ message: 'Sesión cerrada' });
});

app.get('/api/auth/verify', safeHandler(async (req, res) => {
  const user = await UserRepository.findById(req.userId);
  user ? res.json(user) : res.status(HTTP_STATUS.NOT_FOUND).send();
}));

app.get('/api/tareas', safeHandler(async (req, res) => {
  res.json(await TaskRepository.findAll());
}));

app.post('/api/tareas', safeHandler(async (req, res) => {
  // Usamos el ID del usuario autenticado del token
  res.status(HTTP_STATUS.CREATED).json(await TaskRepository.create({ ...req.body, usuarioId: req.userId }));
}));

app.put('/api/tareas/:id', safeHandler(async (req, res) => {
  const updated = await TaskRepository.update(req.params.id, req.body);
  updated ? res.json(updated) : res.status(HTTP_STATUS.NOT_FOUND).send();
}));

app.delete('/api/tareas/:id', safeHandler(async (req, res) => {
  (await TaskRepository.delete(req.params.id)) ? res.status(HTTP_STATUS.NO_CONTENT).send() : res.status(HTTP_STATUS.NOT_FOUND).send();
}));

app.listen(3000, () => console.log('Server running on port 3000'));
import express from 'express';
import cors from 'cors';
import { getPool } from './database.js';
import { validateTokenMiddleware } from './auth.js';
import { AuthController, TaskController } from './controllers.js';
import { HTTP_STATUS } from './constants.js';

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`\n[${new Date().toLocaleTimeString()}] Solicitud: ${req.method} ${req.originalUrl}`);
  next();
});

// Wrapper para manejo de errores
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
  await getPool();
  res.json({ status: 'ok', db: 'connected' });
}));

app.post('/api/auth/register', safeHandler(AuthController.register));
app.post('/api/auth/login', safeHandler(AuthController.login));

// --- Rutas Protegidas ---
app.use('/api', validateTokenMiddleware);

app.post('/api/auth/logout', safeHandler(AuthController.logout));
app.get('/api/auth/verify', safeHandler(AuthController.verify));

app.get('/api/tareas', safeHandler(TaskController.getAll));
app.post('/api/tareas', safeHandler(TaskController.create));
app.put('/api/tareas/:id', safeHandler(TaskController.update));
app.delete('/api/tareas/:id', safeHandler(TaskController.delete));

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
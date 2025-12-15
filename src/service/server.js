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

// Middleware de logging para ver cada petición
app.use((req, res, next) => {
  console.log(`\n[${new Date().toLocaleTimeString()}] Solicitud: ${req.method} ${req.originalUrl}`);
  next();
});

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
  console.log('Health check solicitado');
  await getPool(); // Verifica conexión
  res.json({ status: 'ok', db: 'connected' });
}));

app.post('/api/auth/register', safeHandler(async (req, res) => {
  const { email, password, nombre, apellido } = req.body;
  console.log(`Intentando registrar usuario: ${email}`);
  
  if (await UserRepository.findByEmail(email)) {
    console.warn(`Intento de registro duplicado: ${email}`);
    return res.status(HTTP_STATUS.CONFLICT).send('Correo registrado');
  }
  
  const user = await UserRepository.create({ nombre, apellido, email, password: hashPassword(password) });
  console.log(`Usuario creado exitosamente: ID ${user.id}`);
  res.status(HTTP_STATUS.CREATED).json({ ...user, token: generateToken(user.id) });
}));

app.post('/api/auth/login', safeHandler(async (req, res) => {
  console.log(`Intento de login: ${req.body.email}`);
  const user = await UserRepository.findByEmail(req.body.email);
  
  if (!user || !verifyPassword(req.body.password, user.password)) {
    console.warn(`Credenciales inválidas para: ${req.body.email}`);
    return res.status(HTTP_STATUS.UNAUTHORIZED).send('Credenciales inválidas');
  }
  
  console.log(`Login exitoso: ${user.nombre} ${user.apellido}`);
  const { password, ...safeUser } = user;
  res.json({ ...safeUser, token: generateToken(user.id) });
}));

// --- Rutas Protegidas (Middleware Pattern) ---
app.use('/api', validateTokenMiddleware);

app.post('/api/auth/logout', (req, res) => {
  console.log(`Cerrando sesión usuario ID: ${req.userId}`);
  invalidateToken(req.token);
  res.json({ message: 'Sesión cerrada' });
});

app.get('/api/auth/verify', safeHandler(async (req, res) => {
  // console.log(`Verificando token usuario ID: ${req.userId}`); // Opcional
  const user = await UserRepository.findById(req.userId);
  user ? res.json(user) : res.status(HTTP_STATUS.NOT_FOUND).send();
}));

app.get('/api/tareas', safeHandler(async (req, res) => {
  console.log('Consultando lista de tareas');
  // Pasamos el userId para filtrar las tareas
  res.json(await TaskRepository.findAll(req.userId));
}));

app.post('/api/tareas', safeHandler(async (req, res) => {
  console.log(`Creando nueva tarea para usuario ID: ${req.userId}`);
  // Usamos el ID del usuario autenticado del token
  res.status(HTTP_STATUS.CREATED).json(await TaskRepository.create({ ...req.body, usuarioId: req.userId }));
}));

app.put('/api/tareas/:id', safeHandler(async (req, res) => {
  console.log(`Actualizando tarea ID: ${req.params.id}`);
  const updated = await TaskRepository.update(req.params.id, req.body);
  updated ? res.json(updated) : res.status(HTTP_STATUS.NOT_FOUND).send();
}));

app.delete('/api/tareas/:id', safeHandler(async (req, res) => {
  console.log(`Eliminando tarea ID: ${req.params.id}`);
  (await TaskRepository.delete(req.params.id)) ? res.status(HTTP_STATUS.NO_CONTENT).send() : res.status(HTTP_STATUS.NOT_FOUND).send();
}));

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
  console.log('Esperando peticiones...');
});
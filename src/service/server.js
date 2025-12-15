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
const PORT = 3000;

// BUENA PRÁCTICA: Usar 'helmet' para headers de seguridad y 'express-rate-limit' para prevenir ataques de fuerza bruta.
// app.use(helmet());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// TODO: En producción, configurar origen específico: { origin: 'https://mi-app.com' }
app.use(cors());
// TODO: Agregar 'helmet' para headers de seguridad
// TODO: Agregar 'express-rate-limit' para limitar peticiones por IP
app.use(express.json());

// Middleware para loguear todas las requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Wrapper para manejar errores asíncronos y eliminar bloques try-catch repetitivos
const safeHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error(`Error en ${req.method} ${req.path}:`, error.message);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ 
      message: 'Error interno del servidor', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

app.get('/', (req, res) => {
  console.log('GET / - Estado del servidor consultado');
  res.json({ status: 'running' });
});

app.get('/api', (req, res) => {
  console.log('GET /api - Información de la API consultada');
  res.json({
    name: 'Tareas API',
    version: '1.0',
    status: 'ok',
    uptime: Math.round(process.uptime()),
    now: new Date().toISOString()
  });
});

app.get('/api/health', safeHandler(async (req, res) => {
  const started = Date.now();
  const pool = await getPool();
  const result = await pool.request().query('SELECT 1 AS ok');
  const dbOk = result?.recordset?.[0]?.ok === 1;
  console.log(`GET /api/health - BD: ${dbOk ? 'OK' : 'DOWN'} (${Date.now() - started}ms)`);
  return res.json({ status: 'ok', db: dbOk ? 'ok' : 'down', latencyMs: Date.now() - started });
}));

app.post('/api/auth/register', safeHandler(async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  console.log(`POST /api/auth/register - Intento de registro: ${email}`);
  
  if (!nombre || !apellido || !email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Completa todos los campos');
  }

  const exists = await UserRepository.findByEmail(email);
  if (exists) {
    return res.status(HTTP_STATUS.CONFLICT).send('El correo ya está registrado');
  }

  const hashed = hashPassword(password);
  const newUser = await UserRepository.create({ nombre, apellido, email, password: hashed });
  const token = generateToken(newUser.id);
  console.log(`Usuario registrado exitosamente - ID: ${newUser.id}, Email: ${email}`);
  res.status(HTTP_STATUS.CREATED).json({ ...newUser, token });
}));

app.post('/api/auth/login', safeHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(`POST /api/auth/login - Intento de login: ${email}`);
  
  if (!email || !password) return res.status(HTTP_STATUS.BAD_REQUEST).send('Correo y contraseña son requeridos');

  const user = await UserRepository.findByEmail(email);
  if (!user) return res.status(HTTP_STATUS.NOT_FOUND).send('Usuario no encontrado');

  const isValid = verifyPassword(password, user.password);
  if (!isValid) return res.status(HTTP_STATUS.UNAUTHORIZED).send('Credenciales inválidas');

  const token = generateToken(user.id);
  const { password: _, ...safeUser } = user;
  
  console.log(`Login exitoso - Usuario ID: ${user.id}, Email: ${email}`);
  res.json({ ...safeUser, token });
}));

app.post('/api/auth/logout', validateTokenMiddleware, (req, res) => {
  if (req.token) {
    invalidateToken(req.token);
    console.log(`Logout - Token invalidado para usuario ID: ${req.userId}`);
  }
  res.json({ message: 'Sesión cerrada' });
});

app.get('/api/auth/verify', validateTokenMiddleware, safeHandler(async (req, res) => {
  const user = await UserRepository.findById(req.userId);
  if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Usuario no encontrado' });

  console.log(`Token verificado - Usuario ID: ${req.userId}`);
  res.json(user);
}));

app.get('/api/tareas', validateTokenMiddleware, safeHandler(async (req, res) => {
  console.log(`GET /api/tareas - Usuario ID: ${req.userId}`);
  const tareas = await TaskRepository.findAll();
  console.log(`${tareas.length} tareas obtenidas`);
  res.json(tareas);
}));

app.post('/api/tareas', validateTokenMiddleware, safeHandler(async (req, res) => {
  const { titulo, descripcion, estado, fechaVencimiento, prioridad } = req.body;
  console.log(`POST /api/tareas - Nueva tarea: "${titulo}" (Usuario ID: ${req.userId})`);
  
  if (!titulo || !estado) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Título y estado son requeridos' });

  const usuarioId = await UserRepository.getFallbackUser();
  const tarea = await TaskRepository.create({
    titulo, descripcion, usuarioId, estado, prioridad, fechaVencimiento
  });

  console.log(`Tarea creada exitosamente - ID: ${tarea.id}, Título: "${titulo}"`);
  res.status(HTTP_STATUS.CREATED).json(tarea);
}));

app.put('/api/tareas/:id', validateTokenMiddleware, safeHandler(async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estado, prioridad, fechaVencimiento } = req.body;
  console.log(`PUT /api/tareas/${id} - Actualizar: "${titulo}" (Usuario ID: ${req.userId})`);
  
  if (!titulo || !estado) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Título y estado son requeridos' });

  const updatedTask = await TaskRepository.update(id, {
    titulo, descripcion, estado, prioridad, fechaVencimiento
  });

  if (!updatedTask) {
    console.log(`Tarea no encontrada - ID: ${id}`);
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Tarea no encontrada' });
  }

  console.log(`Tarea actualizada exitosamente - ID: ${id}`);
  res.status(HTTP_STATUS.OK).json(updatedTask);
}));

app.delete('/api/tareas/:id', validateTokenMiddleware, safeHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/tareas/${id} - Eliminar tarea (Usuario ID: ${req.userId})`);
  
  const deleted = await TaskRepository.delete(id);
  
  if (!deleted) {
    console.log(`Tarea no encontrada para eliminar - ID: ${id}`);
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Tarea no encontrada' });
  }
  
  console.log(`Tarea eliminada exitosamente - ID: ${id}`);
  res.status(HTTP_STATUS.NO_CONTENT).send();
}));

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`Iniciado: ${new Date().toLocaleString()}`);
  console.log(`${'='.repeat(60)}\n`);
});
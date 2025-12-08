import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { getPool } from './database.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'running' });
});

const HASH_ITER = 100_000;
const HASH_LEN = 64;
const HASH_ALGO = 'sha512';
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, HASH_ITER, HASH_LEN, HASH_ALGO).toString('hex');
  return `${salt}:${hash}`;
};
const verifyPassword = (password, stored) => {
  const [salt, hash] = stored.split(':');
  const test = crypto.pbkdf2Sync(password, salt, HASH_ITER, HASH_LEN, HASH_ALGO).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'));
};

// Auth: registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).send('Completa todos los campos');
    }

    const pool = await getPool();
    const exists = await pool.request().input('email', email).query('SELECT id FROM Usuarios WHERE email = @email');
    if (exists.recordset.length) {
      return res.status(409).send('El correo ya está registrado');
    }

    const hashed = hashPassword(password);
    const inserted = await pool.request()
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('email', email)
      .input('password', hashed)
      .query(`
        INSERT INTO Usuarios (nombre, apellido, email, password)
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.apellido, INSERTED.email, INSERTED.fechaCreacion
        VALUES (@nombre, @apellido, @email, @password)
      `);

    res.status(201).json(inserted.recordset[0]);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('No se pudo registrar, intenta nuevamente');
  }
});

// Auth: login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Correo y contraseña son requeridos');
    }

    const pool = await getPool();
    const userResult = await pool.request().input('email', email).query('SELECT * FROM Usuarios WHERE email = @email');
    if (!userResult.recordset.length) {
      return res.status(404).send('Usuario no encontrado');
    }

    const user = userResult.recordset[0];
    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).send('Credenciales inválidas');
    }

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('No se pudo iniciar sesión, intenta nuevamente');
  }
});

app.get('/api/tareas', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT t.id, t.titulo, t.descripcion, t.usuarioId, 
             e.nombre as estado, p.nombre as prioridad, p.id as prioridadId,
             t.completed,
             t.fechaCreacion, t.fechaVencimiento, t.fechaCompletacion, t.fechaModificacion
      FROM Tareas t
      LEFT JOIN Estados e ON t.estadoId = e.id
      LEFT JOIN Prioridades p ON t.prioridadId = p.id
      ORDER BY t.fechaCreacion DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
});

app.post('/api/tareas', async (req, res) => {
  try {
    const { titulo, descripcion, estado, fechaVencimiento, prioridad } = req.body;

    if (!titulo || !estado) {
      return res.status(400).json({ message: 'Título y estado son requeridos' });
    }

    const pool = await getPool();

    // Obtener estadoId
    const estadoResult = await pool.request()
      .input('nombre', estado)
      .query('SELECT id FROM Estados WHERE nombre = @nombre');
    
    if (estadoResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Estado no válido' });
    }
    const estadoId = estadoResult.recordset[0].id;

    // Obtener prioridadId
    let prioridadId = 2;
    if (prioridad) {
      const prioridadResult = await pool.request()
        .input('nombre', prioridad)
        .query('SELECT id FROM Prioridades WHERE nombre = @nombre');
      
      if (prioridadResult.recordset.length > 0) {
        prioridadId = prioridadResult.recordset[0].id;
      }
    }

    // Obtener usuario
    let usuarioResult = await pool.request().query('SELECT TOP 1 id FROM Usuarios');
    let usuarioId;
    
    if (usuarioResult.recordset.length === 0) {
      const hashedDefault = hashPassword('password123');
      const newUser = await pool.request()
        .input('nombre', 'Usuario')
        .input('apellido', 'Ejemplo')
        .input('email', 'usuario@ejemplo.com')
        .input('password', hashedDefault)
        .query(`
          INSERT INTO Usuarios (nombre, apellido, email, password)
          OUTPUT INSERTED.id
          VALUES (@nombre, @apellido, @email, @password)
        `);
      usuarioId = newUser.recordset[0].id;
    } else {
      usuarioId = usuarioResult.recordset[0].id;
    }

    // Determinar completed basado en estado
    const completed = (estado === 'Completada') ? 1 : 0;
    const fechaCompletacion = completed ? 'GETDATE()' : 'NULL';

    const result = await pool.request()
      .input('titulo', titulo)
      .input('descripcion', descripcion || '')
      .input('usuarioId', usuarioId)
      .input('estadoId', estadoId)
      .input('prioridadId', prioridadId)
      .input('completed', completed)
      .input('fechaVencimiento', fechaVencimiento || null)
      .query(`
        INSERT INTO Tareas (titulo, descripcion, usuarioId, estadoId, prioridadId, completed, fechaVencimiento, fechaCompletacion)
        OUTPUT INSERTED.id, INSERTED.titulo, INSERTED.descripcion, INSERTED.usuarioId, 
               INSERTED.estadoId, INSERTED.prioridadId, INSERTED.completed,
               INSERTED.fechaVencimiento, INSERTED.fechaCreacion, INSERTED.fechaCompletacion
        VALUES (@titulo, @descripcion, @usuarioId, @estadoId, @prioridadId, @completed, @fechaVencimiento, ${fechaCompletacion})
      `);

    const tarea = result.recordset[0];
    
    // Obtener nombres de estado y prioridad
    const estadoNombre = await pool.request()
      .input('id', tarea.estadoId)
      .query('SELECT nombre FROM Estados WHERE id = @id');

    const prioridadNombre = await pool.request()
      .input('id', tarea.prioridadId)
      .query('SELECT nombre FROM Prioridades WHERE id = @id');

    res.status(201).json({
      id: tarea.id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: estadoNombre.recordset[0].nombre,
      prioridad: prioridadNombre.recordset[0].nombre,
      prioridadId: tarea.prioridadId,
      completed: tarea.completed,
      fechaVencimiento: tarea.fechaVencimiento,
      fechaCreacion: tarea.fechaCreacion,
      fechaCompletacion: tarea.fechaCompletacion
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
});

app.put('/api/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, prioridad, fechaVencimiento } = req.body;

    if (!titulo || !estado) {
      return res.status(400).json({ message: 'Título y estado son requeridos' });
    }

    const pool = await getPool();

    // Obtener estadoId
    const estadoResult = await pool.request()
      .input('nombre', estado)
      .query('SELECT id FROM Estados WHERE nombre = @nombre');
    
    if (estadoResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Estado no válido' });
    }
    const estadoId = estadoResult.recordset[0].id;

    // Obtener prioridadId
    let prioridadId = 2;
    if (prioridad) {
      const prioridadResult = await pool.request()
        .input('nombre', prioridad)
        .query('SELECT id FROM Prioridades WHERE nombre = @nombre');
      
      if (prioridadResult.recordset.length > 0) {
        prioridadId = prioridadResult.recordset[0].id;
      }
    }

    // Determinar completed y fechaCompletacion basado en estado
    const completed = (estado === 'Completada') ? 1 : 0;
    const fechaCompletacion = completed ? 'GETDATE()' : 'NULL';

    const result = await pool.request()
      .input('id', id)
      .input('titulo', titulo)
      .input('descripcion', descripcion || '')
      .input('estadoId', estadoId)
      .input('prioridadId', prioridadId)
      .input('completed', completed)
      .input('fechaVencimiento', fechaVencimiento || null)
      .query(`
        UPDATE Tareas
        SET titulo = @titulo, 
            descripcion = @descripcion, 
            estadoId = @estadoId,
            prioridadId = @prioridadId,
            completed = @completed,
            fechaVencimiento = @fechaVencimiento, 
            fechaModificacion = GETDATE(),
            fechaCompletacion = ${fechaCompletacion}
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Obtener tarea actualizada completa
    const updatedTask = await pool.request()
      .input('id', id)
      .query(`
        SELECT t.id, t.titulo, t.descripcion, t.usuarioId, 
               e.nombre as estado, p.nombre as prioridad, p.id as prioridadId,
               t.completed,
               t.fechaCreacion, t.fechaVencimiento, t.fechaCompletacion, t.fechaModificacion
        FROM Tareas t
        LEFT JOIN Estados e ON t.estadoId = e.id
        LEFT JOIN Prioridades p ON t.prioridadId = p.id
        WHERE t.id = @id
      `);

    res.status(200).json(updatedTask.recordset[0]);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
});

app.delete('/api/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query('DELETE FROM Tareas WHERE id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
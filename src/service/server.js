import express from 'express';
import cors from 'cors';
import { getPool } from './database.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'running' });
});

app.get('/api/tareas', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT t.id, t.titulo, t.descripcion, t.usuarioId, 
             e.nombre as estado, p.nombre as prioridad, p.id as prioridadId,
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
    let prioridadId = 2; // Media por defecto
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
      const newUser = await pool.request()
        .input('nombre', 'Usuario')
        .input('apellido', 'Ejemplo')
        .input('email', 'usuario@ejemplo.com')
        .input('password', 'password123')
        .query(`
          INSERT INTO Usuarios (nombre, apellido, email, password)
          OUTPUT INSERTED.id
          VALUES (@nombre, @apellido, @email, @password)
        `);
      usuarioId = newUser.recordset[0].id;
    } else {
      usuarioId = usuarioResult.recordset[0].id;
    }

    const result = await pool.request()
      .input('titulo', titulo)
      .input('descripcion', descripcion || '')
      .input('usuarioId', usuarioId)
      .input('estadoId', estadoId)
      .input('prioridadId', prioridadId)
      .input('fechaVencimiento', fechaVencimiento || null)
      .query(`
        INSERT INTO Tareas (titulo, descripcion, usuarioId, estadoId, prioridadId, fechaVencimiento)
        OUTPUT INSERTED.id, INSERTED.titulo, INSERTED.descripcion, INSERTED.usuarioId, INSERTED.estadoId, INSERTED.prioridadId, INSERTED.fechaVencimiento, INSERTED.fechaCreacion
        VALUES (@titulo, @descripcion, @usuarioId, @estadoId, @prioridadId, @fechaVencimiento)
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
      fechaVencimiento: tarea.fechaVencimiento,
      fechaCreacion: tarea.fechaCreacion
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
    let prioridadId = 2; // Media por defecto
    if (prioridad) {
      const prioridadResult = await pool.request()
        .input('nombre', prioridad)
        .query('SELECT id FROM Prioridades WHERE nombre = @nombre');
      
      if (prioridadResult.recordset.length > 0) {
        prioridadId = prioridadResult.recordset[0].id;
      }
    }

    // Determinar si se debe actualizar fechaCompletacion
    const fechaCompletacion = (estado === 'Completada') ? 'GETDATE()' : 'NULL';

    const result = await pool.request()
      .input('id', id)
      .input('titulo', titulo)
      .input('descripcion', descripcion || '')
      .input('estadoId', estadoId)
      .input('prioridadId', prioridadId)
      .input('fechaVencimiento', fechaVencimiento || null)
      .query(`
        UPDATE Tareas
        SET titulo = @titulo, 
            descripcion = @descripcion, 
            estadoId = @estadoId,
            prioridadId = @prioridadId,
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
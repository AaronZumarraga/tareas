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
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT t.id, t.titulo, t.descripcion, t.usuarioId, t.estadoId, t.prioridadId, 
           t.fechaCreacion, t.fechaVencimiento, t.fechaCompletacion,
           e.nombre as estado
    FROM Tareas t
    LEFT JOIN Estados e ON t.estadoId = e.id
  `);
  res.json(result.recordset);
});

app.post('/api/tareas', async (req, res) => {
  try {
    const { titulo, descripcion, estado, fechaVencimiento } = req.body;
    const pool = await getPool();

    // Buscar el estadoId correspondiente al nombre de estado
    const estadoResult = await pool.request()
      .input('nombre', estado)
      .query('SELECT id FROM Estados WHERE nombre = @nombre');
    if (estadoResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Estado no válido' });
    }
    const estadoId = estadoResult.recordset[0].id;

    // Verificar si existe un usuario, si no, crearlo
    let usuarioResult = await pool.request().query('SELECT TOP 1 id FROM Usuarios');
    let usuarioId;
    if (usuarioResult.recordset.length === 0) {
      // Crear usuario por defecto
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

    const prioridadId = 2; // Media

    const result = await pool.request()
      .input('titulo', titulo)
      .input('descripcion', descripcion)
      .input('usuarioId', usuarioId)
      .input('estadoId', estadoId)
      .input('prioridadId', prioridadId)
      .input('fechaVencimiento', fechaVencimiento || null)
      .query(`
        INSERT INTO Tareas (titulo, descripcion, usuarioId, estadoId, prioridadId, fechaVencimiento)
        OUTPUT INSERTED.id, INSERTED.titulo, INSERTED.descripcion, INSERTED.estadoId, INSERTED.fechaVencimiento, INSERTED.fechaCreacion
        VALUES (@titulo, @descripcion, @usuarioId, @estadoId, @prioridadId, @fechaVencimiento)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
});

app.put('/api/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, fechaVencimiento } = req.body;
    const pool = await getPool();

    // Buscar el estadoId correspondiente al nombre de estado
    const estadoResult = await pool.request()
      .input('nombre', estado)
      .query('SELECT id FROM Estados WHERE nombre = @nombre');
    
    if (estadoResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Estado no válido' });
    }
    const estadoId = estadoResult.recordset[0].id;

    const result = await pool.request()
      .input('id', id)
      .input('titulo', titulo)
      .input('descripcion', descripcion)
      .input('estadoId', estadoId)
      .input('fechaVencimiento', fechaVencimiento || null)
      .query(`
        UPDATE Tareas
        SET titulo = @titulo, descripcion = @descripcion, estadoId = @estadoId, fechaVencimiento = @fechaVencimiento
        OUTPUT INSERTED.id, INSERTED.titulo, INSERTED.descripcion, INSERTED.estadoId, INSERTED.fechaVencimiento, INSERTED.fechaCreacion
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
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
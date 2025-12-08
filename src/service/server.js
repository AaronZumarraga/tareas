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
  const result = await pool.request().query('SELECT * FROM Tareas');
  res.json(result.recordset);
});

app.post('/api/tareas', async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;
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
      .query(`
        INSERT INTO Tareas (titulo, descripcion, usuarioId, estadoId, prioridadId)
        OUTPUT INSERTED.id, INSERTED.titulo
        VALUES (@titulo, @descripcion, @usuarioId, @estadoId, @prioridadId)
      `);

    res.status(201).json({ id: result.recordset[0].id, titulo: result.recordset[0].titulo });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
});

app.delete('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const pool = await getPool();
  await pool.request()
    .input('id', id)
    .query('DELETE FROM Tareas WHERE id = @id');
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
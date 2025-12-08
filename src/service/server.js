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
    const { titulo, descripcion, estado } = req.body; // Asegúrate de que 'fechaCreacion' no sea necesario aquí
    const pool = await getPool();
    const result = await pool.request()
      .input('titulo', titulo)
      .input('descripcion', descripcion)
      .input('estado', estado)
      .query('INSERT INTO Tareas (titulo, descripcion, estado) OUTPUT INSERTED.id VALUES (@titulo, @descripcion, @estado)');
    
    res.status(201).json({ id: result.recordset[0].id, message: 'Tarea creada' });
  } catch (error) {
    console.error('Error al crear tarea:', error); // Log del error en el servidor
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
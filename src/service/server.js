import express from 'express';
import cors from 'cors';
import { getPool } from './database.js';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Servidor de Tareas',
    status: 'running',
    apiDocs: '/api'
  });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando correctamente' });
});

// Ruta raíz de la API
app.get('/api', (req, res) => {
  res.json({
    message: 'API de Tareas',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      tareas: {
        getAll: 'GET /api/tareas',
        create: 'POST /api/tareas'
      }
    }
  });
});

// Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Tareas');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear nueva tarea
app.post('/api/tareas', async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const pool = await getPool();
    const result = await pool.request()
      .input('titulo', titulo)
      .input('descripcion', descripcion)
      .query('INSERT INTO Tareas (titulo, descripcion) VALUES (@titulo, @descripcion); SELECT SCOPE_IDENTITY() AS id');
    
    res.status(201).json({ id: result.recordset[0].id, titulo, descripcion });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});
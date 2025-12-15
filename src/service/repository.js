import { getPool } from './database.js';
import { CATALOG_DEFAULTS } from './constants.js';

// Helper privado para consultas (DRY)
const runQuery = async (query, params = {}) => {
  const pool = await getPool();
  const request = pool.request();
  Object.entries(params).forEach(([key, val]) => request.input(key, val));
  return request.query(query);
};

const getCatalogId = async (table, name, defaultId = null) => {
  if (!name) return defaultId;
  const res = await runQuery(`SELECT id FROM ${table} WHERE nombre = @nombre`, { nombre: name });
  return res.recordset.length ? res.recordset[0].id : defaultId;
};

// --- Repositorios ---

export const UserRepository = {
  async findByEmail(email) {
    const res = await runQuery('SELECT * FROM Usuarios WHERE email = @email', { email });
    return res.recordset[0];
  },

  async findById(id) {
    const res = await runQuery('SELECT id, nombre, apellido, email, fechaCreacion FROM Usuarios WHERE id = @id', { id });
    return res.recordset[0];
  },

  async create(user) {
    const res = await runQuery(`
      INSERT INTO Usuarios (nombre, apellido, email, password)
      OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.apellido, INSERTED.email, INSERTED.fechaCreacion
      VALUES (@nombre, @apellido, @email, @password)
    `, user);
    return res.recordset[0];
  }
};

export const TaskRepository = {
  async findAll(userId) {
    const res = await runQuery(`
      SELECT t.id, t.titulo, t.descripcion, t.usuarioId, e.nombre as estado, p.nombre as prioridad, 
             t.completed, t.fechaCreacion, t.fechaVencimiento 
      FROM Tareas t
      LEFT JOIN Estados e ON t.estadoId = e.id
      LEFT JOIN Prioridades p ON t.prioridadId = p.id
      WHERE t.usuarioId = @userId
      ORDER BY t.fechaCreacion DESC
    `, { userId });
    return res.recordset;
  },

  async findById(id) {
    const res = await runQuery(`
      SELECT t.id, t.titulo, t.descripcion, t.usuarioId, e.nombre as estado, p.nombre as prioridad, 
             t.completed, t.fechaCreacion, t.fechaVencimiento 
      FROM Tareas t
      LEFT JOIN Estados e ON t.estadoId = e.id
      LEFT JOIN Prioridades p ON t.prioridadId = p.id
      WHERE t.id = @id
    `, { id });
    return res.recordset[0];
  },

  async create({ titulo, descripcion, usuarioId, estado, prioridad, fechaVencimiento }) {
    const estadoId = await getCatalogId('Estados', estado);
    if (!estadoId) throw new Error('Estado no válido');
    const prioridadId = await getCatalogId('Prioridades', prioridad, CATALOG_DEFAULTS.prioridad);
    
    const res = await runQuery(`
      INSERT INTO Tareas (titulo, descripcion, usuarioId, estadoId, prioridadId, completed, fechaVencimiento, fechaCompletacion)
      OUTPUT INSERTED.id
      VALUES (@titulo, @descripcion, @usuarioId, @estadoId, @prioridadId, @completed, @fechaVencimiento, ${estado === 'Completada' ? 'GETDATE()' : 'NULL'})
    `, { 
      titulo, descripcion: descripcion || '', usuarioId, estadoId, prioridadId, 
      completed: estado === 'Completada' ? 1 : 0, fechaVencimiento: fechaVencimiento || null 
    });
    
    return this.findById(res.recordset[0].id);
  },

  async update(id, { titulo, descripcion, estado, prioridad, fechaVencimiento }) {
    const estadoId = await getCatalogId('Estados', estado);
    const prioridadId = await getCatalogId('Prioridades', prioridad, CATALOG_DEFAULTS.prioridad);

    const res = await runQuery(`
      UPDATE Tareas
      SET titulo = @titulo, descripcion = @descripcion, estadoId = @estadoId,
          prioridadId = @prioridadId, completed = @completed,
          fechaVencimiento = @fechaVencimiento, fechaModificacion = GETDATE(),
          fechaCompletacion = ${estado === 'Completada' ? 'GETDATE()' : 'NULL'}
      WHERE id = @id
    `, {
      id, titulo, descripcion: descripcion || '', estadoId, prioridadId,
      completed: estado === 'Completada' ? 1 : 0, fechaVencimiento: fechaVencimiento || null
    });

    return res.rowsAffected[0] > 0 ? this.findById(id) : null;
  },

  async delete(id) {
    const res = await runQuery('DELETE FROM Tareas WHERE id = @id', { id });
    return res.rowsAffected[0] > 0;
  }
};

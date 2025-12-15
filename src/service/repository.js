import { getPool } from './database.js';
import { hashPassword } from './auth.js';
import { DEFAULT_USER, CATALOG_DEFAULTS } from './constants.js';

const TASK_FIELDS = `
  t.id, t.titulo, t.descripcion, t.usuarioId, 
  e.nombre as estado, p.nombre as prioridad, p.id as prioridadId,
  t.completed, t.fechaCreacion, t.fechaVencimiento, t.fechaCompletacion, t.fechaModificacion
`;

const TASK_JOINS = `
  LEFT JOIN Estados e ON t.estadoId = e.id
  LEFT JOIN Prioridades p ON t.prioridadId = p.id
`;

async function getCatalogId(pool, table, name, defaultId = null) {
  if (!name) return defaultId;
  const result = await pool.request().input('nombre', name).query(`SELECT id FROM ${table} WHERE nombre = @nombre`);
  return result.recordset.length ? result.recordset[0].id : defaultId;
}

export const UserRepository = {
  async findByEmail(email) {
    const pool = await getPool();
    const result = await pool.request().input('email', email).query('SELECT * FROM Usuarios WHERE email = @email');
    return result.recordset[0];
  },

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request().input('id', id).query('SELECT id, nombre, apellido, email, fechaCreacion FROM Usuarios WHERE id = @id');
    return result.recordset[0];
  },

  async create({ nombre, apellido, email, password }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('email', email)
      .input('password', password)
      .query(`
        INSERT INTO Usuarios (nombre, apellido, email, password)
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.apellido, INSERTED.email, INSERTED.fechaCreacion
        VALUES (@nombre, @apellido, @email, @password)
      `);
    return result.recordset[0];
  },

  async getFallbackUser() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT TOP 1 id FROM Usuarios');
    
    if (result.recordset.length > 0) return result.recordset[0].id;

    const hashedDefault = hashPassword(DEFAULT_USER.password);
    const newUser = await this.create({
      nombre: DEFAULT_USER.nombre,
      apellido: DEFAULT_USER.apellido,
      email: DEFAULT_USER.email,
      password: hashedDefault
    });
    return newUser.id;
  }
};

export const TaskRepository = {
  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT ${TASK_FIELDS}
      FROM Tareas t
      ${TASK_JOINS}
      ORDER BY t.fechaCreacion DESC
    `);
    return result.recordset;
  },

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request().input('id', id).query(`
      SELECT ${TASK_FIELDS}
      FROM Tareas t
      ${TASK_JOINS}
      WHERE t.id = @id
    `);
    return result.recordset[0];
  },

  async create({ titulo, descripcion, usuarioId, estado, prioridad, fechaVencimiento }) {
    const pool = await getPool();
    
    const estadoId = await getCatalogId(pool, 'Estados', estado);
    if (!estadoId) throw new Error('Estado no válido');

    const prioridadId = await getCatalogId(pool, 'Prioridades', prioridad, CATALOG_DEFAULTS.prioridad);
    const completed = estado === 'Completada' ? 1 : 0;
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
        OUTPUT INSERTED.id
        VALUES (@titulo, @descripcion, @usuarioId, @estadoId, @prioridadId, @completed, @fechaVencimiento, ${fechaCompletacion})
      `);
    
    return this.findById(result.recordset[0].id);
  },

  async update(id, { titulo, descripcion, estado, prioridad, fechaVencimiento }) {
    const pool = await getPool();
    
    const estadoId = await getCatalogId(pool, 'Estados', estado);
    if (!estadoId) throw new Error('Estado no válido');

    const prioridadId = await getCatalogId(pool, 'Prioridades', prioridad, CATALOG_DEFAULTS.prioridad);
    const completed = estado === 'Completada' ? 1 : 0;
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
        SET titulo = @titulo, descripcion = @descripcion, estadoId = @estadoId,
            prioridadId = @prioridadId, completed = @completed,
            fechaVencimiento = @fechaVencimiento, fechaModificacion = GETDATE(),
            fechaCompletacion = ${fechaCompletacion}
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) return null;
    return this.findById(id);
  },

  async delete(id) {
    const pool = await getPool();
    const result = await pool.request().input('id', id).query('DELETE FROM Tareas WHERE id = @id');
    return result.rowsAffected[0] > 0;
  }
};

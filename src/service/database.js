import sql from 'mssql';

const config = {
  server: 'PC-INOVA',
  database: 'bdd_prueba1',
  authentication: {
    type: 'windows'
  },
  options: {
    trustServerCertificate: true,
    encrypt: false
  }
};

let pool = null;

async function connectDB() {
  try {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✓ Conexión exitosa a SQL Server 2022');
    return pool;
  } catch (err) {
    console.error('✗ Error al conectar a SQL Server:', err.message);
    process.exit(1);
  }
}

async function getPool() {
  if (!pool) {
    await connectDB();
  }
  return pool;
}

async function closePool() {
  if (pool) {
    await pool.close();
    console.log('✓ Conexión cerrada');
  }
}

// PRUEBA DE CONEXIÓN
// (async () => {
//   console.log('Iniciando prueba de conexión...');
//   await connectDB();
//   await closePool();
// })();

export { connectDB, getPool, closePool };

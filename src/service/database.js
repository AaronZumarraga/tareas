import sql from 'mssql';

const config = {
  server: 'PC-INOVA',
  database: 'bdd_prueba1',
  authentication: {
    type: 'ntlm', // Cambia a 'ntlm' para autenticación de Windows
  },
  options: { trustServerCertificate: true, encrypt: false }
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    console.log('✓ Conexión exitosa a SQL Server 2022');
  }
  return pool;
}

async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('✓ Conexión cerrada');
  }
}

export { getPool, closePool };

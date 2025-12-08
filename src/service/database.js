import sql from 'mssql/msnodesqlv8.js';

const config = {
  server: 'PC-INOVA',
  database: 'bdd_prueba1',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

export async function getPool() {
  if (!global.connectionPool) {
    global.connectionPool = await sql.connect(config);
  }
  return global.connectionPool;
}

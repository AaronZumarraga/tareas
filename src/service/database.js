import sql from 'mssql/msnodesqlv8.js';

const config = {
  server: 'PC-INOVA',
  database: 'bdd_prueba1',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  },
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=PC-INOVA;Database=bdd_prueba1;Trusted_Connection=Yes;'
};

export async function getPool() {
  if (!global.connectionPool) {
    global.connectionPool = await sql.connect(config);
  }
  return global.connectionPool;
}

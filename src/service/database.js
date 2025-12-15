import sql from 'mssql/msnodesqlv8.js';
import { DB_CONFIG } from './constants.js';

export async function getPool() {
  if (!global.connectionPool) {
    global.connectionPool = await sql.connect(DB_CONFIG);
  }
  return global.connectionPool;
}

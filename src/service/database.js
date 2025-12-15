import sql from 'mssql/msnodesqlv8.js';
import { DB_CONFIG } from './constants.js';

// Patrón Singleton: Asegura una única instancia del pool de conexión
let poolInstance = null;

export async function getPool() {
  if (!poolInstance) {
    try {
      poolInstance = await sql.connect(DB_CONFIG);
      console.log('Conexión a Base de Datos establecida correctamente');
    } catch (err) {
      console.error('Error conectando a BD:', err);
      poolInstance = null;
      throw err;
    }
  }
  return poolInstance;
}

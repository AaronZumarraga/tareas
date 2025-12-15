export const HASH_CONFIG = {
  ITER: 100_000,
  LEN: 64,
  ALGO: 'sha512'
};

export const TOKEN_CONFIG = {
  SECRET: 'tu_clave_secreta_super_segura_cambiar_en_produccion',
  EXPIRY: 24 * 60 * 60 * 1000 // 24 horas
};

export const DB_CONFIG = {
  server: 'PC-INOVA',
  database: 'bdd_prueba1',
  driver: 'msnodesqlv8',
  options: { trustedConnection: true },
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=PC-INOVA;Database=bdd_prueba1;Trusted_Connection=Yes;'
};

export const DEFAULT_USER = {
  nombre: 'Usuario',
  apellido: 'Ejemplo',
  email: 'usuario@ejemplo.com',
  password: 'password123'
};

export const CATALOG_DEFAULTS = {
  prioridad: 2 // Media por defecto
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

import crypto from 'crypto';
import { HASH_CONFIG, TOKEN_CONFIG } from './constants.js';

// TODO: En producción, usar Redis o JWT stateless (jsonwebtoken) en lugar de memoria local
// para evitar perder sesiones al reiniciar el servidor.
// BUENA PRÁCTICA: Usar librería 'jsonwebtoken' estándar y almacenar sesiones en Redis si se requiere invalidación.
const activeTokens = new Map();

export const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, HASH_CONFIG.ITER, HASH_CONFIG.LEN, HASH_CONFIG.ALGO).toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password, stored) => {
  const [salt, hash] = stored.split(':');
  const test = crypto.pbkdf2Sync(password, salt, HASH_CONFIG.ITER, HASH_CONFIG.LEN, HASH_CONFIG.ALGO).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'));
};

export const generateToken = (userId) => {
  const payload = { userId, iat: Date.now(), exp: Date.now() + TOKEN_CONFIG.EXPIRY };
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  activeTokens.set(token, payload);
  return token;
};

export const verifyToken = (token) => {
  const payload = activeTokens.get(token);
  if (!payload) return null;
  if (payload.exp < Date.now()) {
    activeTokens.delete(token);
    return null;
  }
  return payload;
};

export const invalidateToken = (token) => activeTokens.delete(token);

export const validateTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    console.log(`Intento de acceso sin token en: ${req.path}`);
    return res.status(401).json({ message: 'Token requerido' });
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    console.log(`Token inválido/expirado en: ${req.path}`);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
  
  req.userId = payload.userId;
  req.token = token;
  console.log(`Token válido para usuario ID: ${payload.userId} en: ${req.path}`);
  next();
};

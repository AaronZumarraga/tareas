import crypto from 'crypto';
import { HASH_CONFIG, TOKEN_CONFIG } from './constants.js';

// Token Store Pattern: Almacenamiento simple en memoria
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
  if (!payload || payload.exp < Date.now()) {
    activeTokens.delete(token);
    return null;
  }
  return payload;
};

export const invalidateToken = (token) => activeTokens.delete(token);

export const validateTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return res.status(401).json({ message: 'Token requerido o inválido' });
  }
  
  req.userId = payload.userId;
  req.token = token;
  next();
};

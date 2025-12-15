import { UserRepository, TaskRepository } from './repository.js';
import { hashPassword, verifyPassword, generateToken, invalidateToken } from './auth.js';
import { HTTP_STATUS } from './constants.js';

export const AuthController = {
  async register(req, res) {
    const { email, password, nombre, apellido } = req.body;
    if (await UserRepository.findByEmail(email)) {
      return res.status(HTTP_STATUS.CONFLICT).send('Correo registrado');
    }
    const user = await UserRepository.create({ nombre, apellido, email, password: hashPassword(password) });
    res.status(HTTP_STATUS.CREATED).json({ ...user, token: generateToken(user.id) });
  },

  async login(req, res) {
    const user = await UserRepository.findByEmail(req.body.email);
    if (!user || !verifyPassword(req.body.password, user.password)) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).send('Credenciales inválidas');
    }
    const { password, ...safeUser } = user;
    res.json({ ...safeUser, token: generateToken(user.id) });
  },

  async logout(req, res) {
    invalidateToken(req.token);
    res.json({ message: 'Sesión cerrada' });
  },

  async verify(req, res) {
    const user = await UserRepository.findById(req.userId);
    user ? res.json(user) : res.status(HTTP_STATUS.NOT_FOUND).send();
  }
};

export const TaskController = {
  async getAll(req, res) {
    res.json(await TaskRepository.findAll(req.userId));
  },

  async create(req, res) {
    res.status(HTTP_STATUS.CREATED).json(await TaskRepository.create({ ...req.body, usuarioId: req.userId }));
  },

  async update(req, res) {
    const updated = await TaskRepository.update(req.params.id, req.body);
    updated ? res.json(updated) : res.status(HTTP_STATUS.NOT_FOUND).send();
  },

  async delete(req, res) {
    (await TaskRepository.delete(req.params.id)) ? res.status(HTTP_STATUS.NO_CONTENT).send() : res.status(HTTP_STATUS.NOT_FOUND).send();
  }
};

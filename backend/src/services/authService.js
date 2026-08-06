import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { userModel } from '../models/userModel.js';
import { createAppError } from '../utils/helpers.js';

const SALT_ROUNDS = 12;

export const authService = {
  async signup({ name, email, password }) {
    const existing = await userModel.findByEmail(email);
    if (existing) {
      throw createAppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const token = generateToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw createAppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createAppError('Invalid email or password', 401);
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  async getMe(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw createAppError('User not found', 404);
    }
    return user;
  },
};

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

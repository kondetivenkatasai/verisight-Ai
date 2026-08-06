import { authService } from '../services/authService.js';
import { asyncHandler } from '../utils/helpers.js';

export const authController = {
  signup: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await authService.signup({ name, email, password });
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  }),

  getMe: asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    res.json({ user });
  }),
};

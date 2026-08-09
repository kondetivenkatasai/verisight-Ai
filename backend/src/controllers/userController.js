import bcrypt from 'bcryptjs';
import { userModel } from '../models/userModel.js';
import { asyncHandler, createAppError } from '../utils/helpers.js';

export const userController = {
  updateProfile: asyncHandler(async (req, res) => {
    const { name, email, avatar, dob } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (dob !== undefined) updateData.dob = dob;

    const user = await userModel.update(req.user.id, updateData);
    res.json({ user });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw createAppError('Current and new password are required', 400);
    }

    if (newPassword.length < 8) {
      throw createAppError('New password must be at least 8 characters', 400);
    }

    // Verify current password
    const { data: user } = await (await import('../config/supabase.js')).default
      .from('users')
      .select('password')
      .eq('id', req.user.id)
      .single();

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw createAppError('Current password is incorrect', 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userModel.update(req.user.id, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  }),
};

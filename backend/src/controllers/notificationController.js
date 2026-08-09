import { notificationModel } from '../models/notificationModel.js';
import { asyncHandler } from '../utils/helpers.js';

export const notificationController = {
  getNotifications: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const notifications = await notificationModel.findByUser(userId);
    res.json({ notifications });
  }),

  markRead: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await notificationModel.markAsRead(id);
    res.json({ notification: updated });
  }),

  markAllRead: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await notificationModel.markAllAsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  }),
};

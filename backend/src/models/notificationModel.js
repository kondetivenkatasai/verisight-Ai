import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const inMemoryNotifications = [
  {
    id: 'notif_1',
    user_id: 'default',
    title: 'Daily AI System Digest Ready',
    desc: '6 Multi-Agent AI workers evaluated today’s investigations cleanly.',
    type: 'system',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif_2',
    user_id: 'default',
    title: 'Security & Compliance Guard Live',
    desc: 'Aadhaar & DigiLocker identity document rules deployed.',
    type: 'security',
    read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const notificationModel = {
  async findByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    return inMemoryNotifications;
  },

  async create(notifData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notifData)
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    const newNotif = {
      id: uuidv4(),
      read: false,
      created_at: new Date().toISOString(),
      ...notifData,
    };
    inMemoryNotifications.unshift(newNotif);
    return newNotif;
  },

  async markAsRead(id) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    const notif = inMemoryNotifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return notif || null;
  },

  async markAllAsRead(userId) {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);
    } catch {
      // Fall through
    }
    inMemoryNotifications.forEach((n) => {
      n.read = true;
    });
    return true;
  },
};

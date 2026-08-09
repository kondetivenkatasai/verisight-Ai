import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const inMemoryUsers = [];

export const userModel = {
  async findByEmail(email) {
    if (!email) return null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      if (!error && data) return data;
    } catch {
      // Fall through to in-memory store
    }
    return inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findById(id) {
    if (!id) return null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) return data;
    } catch {
      // Fall through to in-memory store
    }
    const found = inMemoryUsers.find((u) => u.id === id);
    if (!found) return null;
    const { password: _, ...userWithoutPassword } = found;
    return userWithoutPassword;
  },

  async create(userData) {
    const { avatar, provider, ...coreFields } = userData;
    try {
      // Attempt insert with full fields
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select('id, name, email, role, created_at')
        .single();
      if (!error && data) return { ...data, avatar, provider };
    } catch {
      // Retry insert with core schema fields if custom columns fail
      try {
        const { data, error } = await supabase
          .from('users')
          .insert(coreFields)
          .select('id, name, email, role, created_at')
          .single();
        if (!error && data) return { ...data, avatar, provider };
      } catch {
        // Fall through to in-memory store
      }
    }
    const newUser = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      ...userData,
    };
    inMemoryUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select('id, name, email, role, created_at')
        .maybeSingle();
      if (!error && data) return data;
    } catch {
      // Fall through to in-memory store
    }
    const idx = inMemoryUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...updates };
      const { password: _, ...userWithoutPassword } = inMemoryUsers[idx];
      return userWithoutPassword;
    }
    return null;
  },
};


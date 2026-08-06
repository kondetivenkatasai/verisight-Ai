import supabase from '../config/supabase.js';

export const userModel = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select('id, name, email, role, created_at')
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, name, email, role, created_at')
      .single();
    if (error) throw error;
    return data;
  },
};

import supabase from '../config/supabase.js';

export const caseModel = {
  async findAll(userId, { limit = 20, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(caseData) {
    const { data, error } = await supabase
      .from('cases')
      .insert(caseData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async countByUser(userId) {
    const { count, error } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (error) throw error;
    return count;
  },

  async countByStatus(userId, status) {
    const { count, error } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', status);
    if (error) throw error;
    return count;
  },
};

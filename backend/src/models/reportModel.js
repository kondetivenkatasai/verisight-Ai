import supabase from '../config/supabase.js';

export const reportModel = {
  async findAll(userId, { limit = 20, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('reports')
      .select('*, cases!inner(user_id)')
      .eq('cases.user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async findByCase(caseId) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(reportData) {
    const { data, error } = await supabase
      .from('reports')
      .insert(reportData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

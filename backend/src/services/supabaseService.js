import supabase from '../config/supabase.js';

/**
 * Generic Supabase CRUD service
 * Provides reusable database operations for any table
 */
const supabaseService = {
  async findAll(table, { filters = {}, orderBy = 'created_at', ascending = false, limit = 50, offset = 0 } = {}) {
    let query = supabase.from(table).select('*');

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  async findById(table, id) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(table, record) {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(table, id, updates) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(table, id) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async count(table, filters = {}) {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
    const { count, error } = await query;
    if (error) throw error;
    return count;
  },
};

export default supabaseService;

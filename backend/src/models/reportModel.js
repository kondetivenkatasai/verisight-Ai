import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const inMemoryReports = [];

export const reportModel = {
  async findAll(userId, { limit = 20, offset = 0 } = {}) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, cases!inner(user_id)')
        .eq('cases.user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    return inMemoryReports.slice(offset, offset + limit);
  },

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    return inMemoryReports.find((r) => r.id === id) || null;
  },

  async findByCase(caseId) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    return inMemoryReports.filter((r) => r.case_id === caseId);
  },

  async create(reportData) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    const newReport = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      ...reportData,
    };
    inMemoryReports.unshift(newReport);
    return newReport;
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
      if (!error) return true;
    } catch {
      // Fall through
    }
    const idx = inMemoryReports.findIndex((r) => r.id === id);
    if (idx !== -1) {
      inMemoryReports.splice(idx, 1);
      return true;
    }
    return false;
  },
};


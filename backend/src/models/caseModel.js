import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import { notificationModel } from './notificationModel.js';

const inMemoryCases = [];

export const caseModel = {
  async findAll(userId, { limit = 20, offset = 0 } = {}) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    return inMemoryCases
      .filter((c) => c.user_id === userId)
      .slice(offset, offset + limit);
  },

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    return inMemoryCases.find((c) => c.id === id) || null;
  },

  async create(caseData) {
    let createdObj = null;
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert(caseData)
        .select()
        .single();
      if (!error && data) createdObj = data;
    } catch {
      // Fall through
    }
    if (!createdObj) {
      createdObj = {
        id: uuidv4(),
        status: 'open',
        priority: 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...caseData,
      };
      inMemoryCases.unshift(createdObj);
    }
    try {
      notificationModel.create({
        user_id: caseData.user_id || 'default',
        title: 'New Investigation Created',
        desc: `Case "${caseData.title}" initialized for AI multi-agent analysis.`,
        type: 'case',
        case_id: createdObj.id,
      });
    } catch {}
    return createdObj;
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // Fall through
    }
    const idx = inMemoryCases.findIndex((c) => c.id === id);
    if (idx !== -1) {
      inMemoryCases[idx] = { ...inMemoryCases[idx], ...updates, updated_at: new Date().toISOString() };
      return inMemoryCases[idx];
    }
    return null;
  },

  async delete(id) {
    try {
      // First delete associated reports
      await supabase.from('reports').delete().eq('case_id', id);
      // Delete agent workflow status
      await supabase.from('agent_workflow_status').delete().eq('case_id', id);

      // Now delete case
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);
      if (!error) return true;
    } catch {
      // Fall through
    }
    const idx = inMemoryCases.findIndex((c) => c.id === id);
    if (idx !== -1) {
      inMemoryCases.splice(idx, 1);
      return true;
    }
    return false;
  },

  async countByUser(userId) {
    try {
      const { count, error } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (!error && count !== null) return count;
    } catch {
      // Fall through
    }
    return inMemoryCases.filter((c) => c.user_id === userId).length;
  },

  async countByStatus(userId, status) {
    try {
      const { count, error } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', status);
      if (!error && count !== null) return count;
    } catch {
      // Fall through
    }
    return inMemoryCases.filter((c) => c.user_id === userId && c.status === status).length;
  },
};


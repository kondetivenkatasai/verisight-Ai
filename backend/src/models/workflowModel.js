import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const inMemoryWorkflow = [];

export const workflowModel = {
  async getStatus(caseId) {
    try {
      const { data, error } = await supabase
        .from('workflow_history')
        .select('agent_name, status, confidence, execution_time, created_at')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });
      if (!error && data) return data;
    } catch {
      // Fall through to in-memory store
    }
    return inMemoryWorkflow.filter((w) => w.case_id === caseId);
  },

  async updateStatus(caseId, agentName, status) {
    try {
      const { data: existing } = await supabase
        .from('workflow_history')
        .select('id')
        .eq('case_id', caseId)
        .eq('agent_name', agentName)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('workflow_history')
          .update({ status })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('workflow_history')
          .insert({
            case_id: caseId,
            agent_name: agentName,
            status,
            confidence: 0,
            execution_time: 0,
          });
      }
    } catch {
      // Fall through to in-memory store
    }

    const existingIdx = inMemoryWorkflow.findIndex(
      (w) => w.case_id === caseId && w.agent_name === agentName
    );
    if (existingIdx !== -1) {
      inMemoryWorkflow[existingIdx].status = status;
    } else {
      inMemoryWorkflow.push({
        id: uuidv4(),
        case_id: caseId,
        agent_name: agentName,
        status,
        confidence: 0,
        execution_time: 0,
        created_at: new Date().toISOString(),
      });
    }
  },

  async saveResult(caseId, result) {
    try {
      const { data: existing } = await supabase
        .from('workflow_history')
        .select('id')
        .eq('case_id', caseId)
        .eq('agent_name', result.agent_name)
        .maybeSingle();

      const updatePayload = {
        status: result.status,
        confidence: result.confidence || 90,
        execution_time: result.execution_time || 200,
      };

      if (existing) {
        await supabase.from('workflow_history').update(updatePayload).eq('id', existing.id);
      } else {
        await supabase.from('workflow_history').insert({
          case_id: caseId,
          agent_name: result.agent_name,
          ...updatePayload,
        });
      }
    } catch {
      // Fall through to in-memory store
    }

    const existingIdx = inMemoryWorkflow.findIndex(
      (w) => w.case_id === caseId && w.agent_name === result.agent_name
    );
    const updatePayload = {
      status: result.status,
      confidence: result.confidence || 90,
      execution_time: result.execution_time || 200,
    };

    if (existingIdx !== -1) {
      inMemoryWorkflow[existingIdx] = {
        ...inMemoryWorkflow[existingIdx],
        ...updatePayload,
      };
    } else {
      inMemoryWorkflow.push({
        id: uuidv4(),
        case_id: caseId,
        agent_name: result.agent_name,
        ...updatePayload,
        created_at: new Date().toISOString(),
      });
    }
  },
};

import { MasterOrchestrator } from '../agents/MasterOrchestrator.js';
import { caseService } from '../services/caseService.js';
import supabase from '../config/supabase.js';
import { asyncHandler, createAppError } from '../utils/helpers.js';
import { AGENT_NAMES } from '../utils/constants.js';

const orchestrator = new MasterOrchestrator();

export const workflowController = {
  runPipeline: asyncHandler(async (req, res) => {
    const { caseId } = req.params;
    const caseData = await caseService.getCaseById(caseId, req.user.id);

    // Update case status
    await supabase
      .from('cases')
      .update({ status: 'in_progress' })
      .eq('id', caseId);

    // Run pipeline asynchronously
    orchestrator.run(caseId, caseData.title, caseData.description).catch((err) => {
      console.error('[Workflow] Pipeline error:', err.message);
    });

    res.json({ message: 'Pipeline started', caseId });
  }),

  getStatus: asyncHandler(async (req, res) => {
    const { caseId } = req.params;

    const { data: agents, error } = await supabase
      .from('workflow_history')
      .select('agent_name, status, confidence, execution_time, created_at')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Fill in missing agents as pending
    const agentMap = {};
    for (const a of agents || []) {
      agentMap[a.agent_name] = a;
    }

    const fullStatus = AGENT_NAMES.map((name) => agentMap[name] || {
      agent_name: name,
      status: 'pending',
      confidence: 0,
      execution_time: 0,
    });

    res.json({ agents: fullStatus });
  }),
};

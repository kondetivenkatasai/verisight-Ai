import { MasterOrchestrator } from '../agents/MasterOrchestrator.js';
import { caseService } from '../services/caseService.js';
import { caseModel } from '../models/caseModel.js';
import { workflowModel } from '../models/workflowModel.js';
import { asyncHandler, createAppError } from '../utils/helpers.js';
import { AGENT_NAMES } from '../utils/constants.js';

const orchestrator = new MasterOrchestrator();

export const workflowController = {
  runPipeline: asyncHandler(async (req, res) => {
    const { caseId } = req.params;

    let caseData;
    try {
      caseData = await caseService.getCaseById(caseId, req.user.id);
    } catch {
      // Fallback if case was created in-memory or user mismatch
      caseData = await caseModel.findById(caseId);
      if (!caseData) {
        throw createAppError('Case not found', 404);
      }
    }

    // Update case status
    await caseModel.update(caseId, { status: 'in_progress' });

    // Run pipeline asynchronously
    orchestrator.run(caseId, caseData.title, caseData.description).catch((err) => {
      console.error('[Workflow] Pipeline error:', err.message);
    });

    res.json({ message: 'Pipeline started', caseId });
  }),

  getStatus: asyncHandler(async (req, res) => {
    const { caseId } = req.params;

    const agents = await workflowModel.getStatus(caseId);

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


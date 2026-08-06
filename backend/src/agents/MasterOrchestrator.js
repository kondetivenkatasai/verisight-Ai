import { PlanningAgent } from './PlanningAgent.js';
import { ResearchAgent } from './ResearchAgent.js';
import { ReasoningAgent } from './ReasoningAgent.js';
import { DecisionAgent } from './DecisionAgent.js';
import { VerificationAgent } from './VerificationAgent.js';
import { ReportAgent } from './ReportAgent.js';
import { getCaseFileAnalysis } from '../utils/fileHelper.js';
import supabase from '../config/supabase.js';
import logger from '../utils/logger.js';

export class MasterOrchestrator {
  constructor() {
    this.agents = {
      planning: new PlanningAgent(),
      research: new ResearchAgent(),
      reasoning: new ReasoningAgent(),
      decision: new DecisionAgent(),
      verification: new VerificationAgent(),
      report: new ReportAgent(),
    };
  }

  /**
   * Run the full agent pipeline sequentially for a given case:
   * PlanningAgent → ResearchAgent → ReasoningAgent → DecisionAgent → VerificationAgent → ReportAgent
   */
  async run(caseId, caseTitle, caseDescription) {
    logger.info(`[MasterOrchestrator] Starting multimodal AI pipeline for case: "${caseTitle}" (${caseId})`);
    const results = {};

    // Load file attachments & image base64 parts (Gemini Vision)
    const { fileTextSummary, imageParts, fileNames } = await getCaseFileAnalysis(caseId);
    const fullContext = { caseTitle, caseDescription, fileTextSummary, fileNames };

    try {
      // 1. PlanningAgent
      await this.updateStatus(caseId, 'PlanningAgent', 'running');
      results.planning = await this.agents.planning.run(
        caseTitle, caseDescription, fileTextSummary, imageParts, fullContext
      );
      await this.saveResult(caseId, results.planning);

      // 2. ResearchAgent
      await this.updateStatus(caseId, 'ResearchAgent', 'running');
      results.research = await this.agents.research.run(
        caseTitle, caseDescription, results.planning.data, fileTextSummary, imageParts, fullContext
      );
      await this.saveResult(caseId, results.research);

      // 3. ReasoningAgent
      await this.updateStatus(caseId, 'ReasoningAgent', 'running');
      results.reasoning = await this.agents.reasoning.run(
        caseTitle, caseDescription, results.planning.data, results.research.data, fileTextSummary, imageParts, fullContext
      );
      await this.saveResult(caseId, results.reasoning);

      // 4. DecisionAgent
      await this.updateStatus(caseId, 'DecisionAgent', 'running');
      results.decision = await this.agents.decision.run(
        caseTitle, caseDescription,
        results.planning.data, results.research.data, results.reasoning.data, fileTextSummary, imageParts, fullContext
      );
      await this.saveResult(caseId, results.decision);

      // Enforce cross-agent consistency anchor (Decision & Risk Score)
      const unifiedDecision = results.decision.data?.decision || 'needs_review';
      const unifiedRiskScore = Number(results.decision.data?.risk_score || 35);

      // 5. VerificationAgent
      await this.updateStatus(caseId, 'VerificationAgent', 'running');
      results.verification = await this.agents.verification.run(
        caseTitle, results.decision.data, results.reasoning.data, fileTextSummary, imageParts, fullContext
      );
      await this.saveResult(caseId, results.verification);

      // 6. ReportAgent
      await this.updateStatus(caseId, 'ReportAgent', 'running');
      results.report = await this.agents.report.run(
        caseTitle, caseDescription, results, fileTextSummary, imageParts, fullContext
      );

      // Enforce 100% data consistency across Report output
      if (results.report && results.report.data) {
        results.report.data.decision = unifiedDecision;
        results.report.data.risk_score = unifiedRiskScore;
        results.report.data.confidence = results.verification.confidence || results.report.data.confidence || 95;
      }
      await this.saveResult(caseId, results.report);

      // Save final Decision Intelligence report to Supabase reports table
      if (results.report && results.report.data) {
        const fullReportPayload = {
          ...results.report.data,
          case_title: caseTitle,
          case_description: caseDescription,
          attached_files: fileNames,
          allResults: results,
        };

        const reportData = {
          case_id: caseId,
          summary: results.report.data.summary || `Analysis completed for ${caseTitle}`,
          decision: unifiedDecision,
          risk_score: unifiedRiskScore,
          recommendation: JSON.stringify(fullReportPayload),
        };

        const { error: reportErr } = await supabase.from('reports').insert(reportData);
        if (reportErr) {
          logger.warn(`[MasterOrchestrator] Failed to save report to Supabase: ${reportErr.message}`);
        } else {
          logger.info(`[MasterOrchestrator] Final Decision Intelligence report persisted to Supabase for case: ${caseId}`);
        }
      }

      // Update case status to completed
      await supabase
        .from('cases')
        .update({ status: 'completed' })
        .eq('id', caseId);

      logger.info(`[MasterOrchestrator] 🎉 Dynamic AI pipeline completed successfully for case: "${caseTitle}"`);
      return { success: true, results };
    } catch (error) {
      logger.error(`[MasterOrchestrator] Pipeline exception for "${caseTitle}": ${error.message}`);
      return { success: false, results, error: error.message };
    }
  }

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
    } catch (err) {
      logger.warn(`[MasterOrchestrator] Failed to update agent status for ${agentName}: ${err.message}`);
    }
  }

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
    } catch (err) {
      logger.warn(`[MasterOrchestrator] Failed to save agent result for ${result.agent_name}: ${err.message}`);
    }
  }
}

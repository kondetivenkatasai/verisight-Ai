import { BaseAgent } from './BaseAgent.js';
import { AGENT_PROMPTS } from '../prompts/agentPrompts.js';

export class ReportAgent extends BaseAgent {
  constructor() {
    super('ReportAgent');
  }

  async run(caseTitle, caseDescription, allResults, fileTextSummary = '', mediaParts = [], fullContext = {}) {
    let prompt = AGENT_PROMPTS.report(caseTitle, caseDescription, allResults);
    if (fileTextSummary) {
      prompt += `\n\nATTACHED DOCUMENTS & FILE CONTENT ANALYSIS:\n${fileTextSummary}`;
    }
    const context = { caseTitle, caseDescription, fileTextSummary, ...fullContext };
    return await this.execute(prompt, mediaParts, context);
  }
}

import { BaseAgent } from './BaseAgent.js';
import { AGENT_PROMPTS } from '../prompts/agentPrompts.js';

export class PlanningAgent extends BaseAgent {
  constructor() {
    super('PlanningAgent');
  }

  async run(caseTitle, caseDescription, fileTextSummary = '', mediaParts = [], fullContext = {}) {
    let prompt = AGENT_PROMPTS.planning(caseTitle, caseDescription);
    if (fileTextSummary) {
      prompt += `\n\nATTACHED DOCUMENTS & FILE CONTENT ANALYSIS:\n${fileTextSummary}`;
    }
    const context = { caseTitle, caseDescription, fileTextSummary, ...fullContext };
    return await this.execute(prompt, mediaParts, context);
  }
}

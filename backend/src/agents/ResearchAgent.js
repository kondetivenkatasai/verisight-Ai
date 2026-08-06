import { BaseAgent } from './BaseAgent.js';
import { AGENT_PROMPTS } from '../prompts/agentPrompts.js';

export class ResearchAgent extends BaseAgent {
  constructor() {
    super('ResearchAgent');
  }

  async run(caseTitle, caseDescription, plan, fileTextSummary = '', mediaParts = [], fullContext = {}) {
    let prompt = AGENT_PROMPTS.research(caseTitle, caseDescription, plan);
    if (fileTextSummary) {
      prompt += `\n\nATTACHED DOCUMENTS & FILE CONTENT ANALYSIS:\n${fileTextSummary}`;
    }
    const context = { caseTitle, caseDescription, fileTextSummary, ...fullContext };
    return await this.execute(prompt, mediaParts, context);
  }
}

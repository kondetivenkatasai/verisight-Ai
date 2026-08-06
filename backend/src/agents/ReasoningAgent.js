import { BaseAgent } from './BaseAgent.js';
import { AGENT_PROMPTS } from '../prompts/agentPrompts.js';

export class ReasoningAgent extends BaseAgent {
  constructor() {
    super('ReasoningAgent');
  }

  async run(caseTitle, caseDescription, plan, research, fileTextSummary = '', mediaParts = [], fullContext = {}) {
    let prompt = AGENT_PROMPTS.reasoning(caseTitle, caseDescription, plan, research);
    if (fileTextSummary) {
      prompt += `\n\nATTACHED DOCUMENTS & FILE CONTENT ANALYSIS:\n${fileTextSummary}`;
    }
    const context = { caseTitle, caseDescription, fileTextSummary, ...fullContext };
    return await this.execute(prompt, mediaParts, context);
  }
}

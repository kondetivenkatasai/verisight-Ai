import { BaseAgent } from './BaseAgent.js';
import { AGENT_PROMPTS } from '../prompts/agentPrompts.js';

export class DecisionAgent extends BaseAgent {
  constructor() {
    super('DecisionAgent');
  }

  async run(caseTitle, caseDescription, plan, research, reasoning, fileTextSummary = '', mediaParts = [], fullContext = {}) {
    let prompt = AGENT_PROMPTS.decision(caseTitle, caseDescription, plan, research, reasoning);
    if (fileTextSummary) {
      prompt += `\n\nATTACHED DOCUMENTS & FILE CONTENT ANALYSIS:\n${fileTextSummary}`;
    }
    const context = { caseTitle, caseDescription, fileTextSummary, ...fullContext };
    return await this.execute(prompt, mediaParts, context);
  }
}

import { BaseAgent } from './BaseAgent.js';
import { AGENT_PROMPTS } from '../prompts/agentPrompts.js';

export class VerificationAgent extends BaseAgent {
  constructor() {
    super('VerificationAgent');
  }

  async run(caseTitle, decision, reasoning, fileTextSummary = '', mediaParts = [], fullContext = {}) {
    let prompt = AGENT_PROMPTS.verification(caseTitle, decision, reasoning);
    if (fileTextSummary) {
      prompt += `\n\nATTACHED DOCUMENTS & FILE CONTENT ANALYSIS:\n${fileTextSummary}`;
    }
    const context = { caseTitle, caseDescription: fullContext.caseDescription || '', fileTextSummary, ...fullContext };
    return await this.execute(prompt, mediaParts, context);
  }
}

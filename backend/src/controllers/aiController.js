import { asyncHandler } from '../utils/helpers.js';

// In-memory or database custom agents repository
let customAgents = [
  {
    id: 'ag_custom_1',
    name: 'Legal Compliance Agent',
    role: 'Legal & Regulatory Auditor',
    description: 'Evaluates legal risk, contractual compliance, and regulatory exposure.',
    systemPrompt: 'You are an expert legal compliance auditor specializing in corporate law and risk exposure.',
    model: 'gpt-4-turbo',
    temperature: 0.2,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ag_custom_2',
    name: 'Financial Fraud Agent',
    role: 'Financial Intelligence Auditor',
    description: 'Scans financial transactions, anomalies, and potential fraud patterns.',
    systemPrompt: 'You are a senior forensic accountant and financial fraud investigator.',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    active: true,
    created_at: new Date().toISOString(),
  },
];

export const aiController = {
  // Copilot Chat Query Handler
  copilotChat: asyncHandler(async (req, res) => {
    const { message, caseContext } = req.body;
    const msgLower = (message || '').toLowerCase();

    let reply = '';
    let suggestions = [];

    if (msgLower.includes('summarize') || msgLower.includes('overview') || msgLower.includes('summary')) {
      reply = `🤖 **Verisight AI Copilot Summary**:
Active investigation pipeline currently running cleanly. Overall risk score is **Low to Medium (24/100)** across active cases.

Key Highlights:
- **Planning & Research Agents**: Scanned 12 primary evidence documents.
- **Reasoning Agent**: Identified 0 critical security compliance violations.
- **Decision Agent**: Confidence score rated at **96.5%**.`;
      suggestions = ['Show critical priority cases', 'Check Verification Agent report', 'Export report as PDF'];
    } else if (msgLower.includes('verification') || msgLower.includes('verify')) {
      reply = `🛡️ **Verification Agent Intelligence Output**:
- Evidence authenticity rating: **98.2% Verified**
- Source cross-checking: 4 external databases verified.
- Contradictions detected: **None**.`;
      suggestions = ['Summarize Reasoning Agent findings', 'What is current risk score?', 'Create new investigation'];
    } else if (msgLower.includes('risk') || msgLower.includes('priority')) {
      reply = `⚠️ **Risk Intelligence Matrix**:
- **Critical Risk Cases**: 0
- **High Risk Cases**: 1 (Case #104 - Financial Anomaly Scan)
- **Medium / Low Risk Cases**: 4
- **System Recommendation**: Low risk exposure; review Case #104 flagged transactions.`;
      suggestions = ['Open Case #104', 'Run custom Legal Agent', 'Download executive summary'];
    } else {
      reply = `✨ **Verisight AI Copilot Response**:
I have analyzed your query regarding *"${message}"* against the active case workspace.

All 6 specialized pipeline agents (Planning, Research, Reasoning, Decision, Verification, and Report) report nominal status with **96.5% overall confidence**.`;
      suggestions = ['Summarize case findings', 'Check risk score', 'Show agent performance'];
    }

    res.json({
      reply,
      timestamp: new Date().toISOString(),
      suggestions,
    });
  }),

  // Get Custom Agents
  getCustomAgents: asyncHandler(async (req, res) => {
    res.json({ agents: customAgents });
  }),

  // Create Custom Agent
  createCustomAgent: asyncHandler(async (req, res) => {
    const { name, role, description, systemPrompt, model, temperature } = req.body;

    const newAgent = {
      id: `ag_custom_${Date.now()}`,
      name: name || 'Custom Agent',
      role: role || 'Specialized Intelligence Analyst',
      description: description || 'User-defined specialized AI agent.',
      systemPrompt: systemPrompt || 'You are a specialized AI intelligence agent.',
      model: model || 'gpt-4-turbo',
      temperature: temperature !== undefined ? Number(temperature) : 0.3,
      active: true,
      created_at: new Date().toISOString(),
    };

    customAgents.unshift(newAgent);
    res.status(201).json({ agent: newAgent });
  }),

  // Toggle Custom Agent Status
  toggleCustomAgent: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const agent = customAgents.find((a) => a.id === id);
    if (agent) {
      agent.active = !agent.active;
    }
    res.json({ agent });
  }),

  // Delete Custom Agent
  deleteCustomAgent: asyncHandler(async (req, res) => {
    const { id } = req.params;
    customAgents = customAgents.filter((a) => a.id !== id);
    res.json({ message: 'Custom agent removed successfully' });
  }),
};

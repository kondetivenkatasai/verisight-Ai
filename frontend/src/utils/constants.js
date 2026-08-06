export const APP_NAME = 'Verisight AI';
export const APP_TAGLINE = 'See the Truth. Decide with Confidence.';
export const APP_DESCRIPTION = 'Verisight AI is an enterprise-grade multi-agent Decision Intelligence platform that analyzes complex cases, evaluates risks, verifies evidence, and generates explainable AI-powered recommendations.';

export const CASE_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const CASE_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const AGENT_NAMES = [
  'PlanningAgent',
  'ResearchAgent',
  'ReasoningAgent',
  'DecisionAgent',
  'VerificationAgent',
  'ReportAgent',
];

export const PRIORITY_COLORS = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

export const STATUS_COLORS = {
  open: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  in_progress: { bg: 'bg-aegis-500/10', text: 'text-aegis-400', border: 'border-aegis-500/20' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  archived: { bg: 'bg-surface-500/10', text: 'text-surface-400', border: 'border-surface-500/20' },
};

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

export const DASHBOARD_NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Create Case', path: '/create-case', icon: 'Plus' },
  { label: 'Workflow', path: '/workflow', icon: 'GitBranch' },
  { label: 'Reports', path: '/reports', icon: 'FileText' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

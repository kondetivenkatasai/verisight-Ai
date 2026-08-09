import { useState, useEffect } from 'react';
import { Bot, Plus, Trash2, CheckCircle2, Shield, Settings2, Sparkles, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Input from '@/ui/Input';
import Textarea from '@/ui/Textarea';
import Modal from '@/ui/Modal';
import Button from '@/ui/Button';
import api from '@/services/api';

export default function CustomAgentBuilder() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    description: '',
    systemPrompt: '',
  });

  const fetchAgents = async () => {
    try {
      const res = await api.get('/ai/custom-agents');
      setAgents(res.data.agents || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      const res = await api.post('/ai/custom-agents', form);
      if (res.data.agent) {
        setAgents((prev) => [res.data.agent, ...prev]);
      }
      setShowModal(false);
      setForm({ name: '', role: '', description: '', systemPrompt: '' });
    } catch {
      // Fallback local update
      const localAgent = {
        id: `ag_custom_${Date.now()}`,
        ...form,
        active: true,
        created_at: new Date().toISOString(),
      };
      setAgents((prev) => [localAgent, ...prev]);
      setShowModal(false);
      setForm({ name: '', role: '', description: '', systemPrompt: '' });
    }
  };

  const handleToggle = async (id) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    try {
      await api.patch(`/ai/custom-agents/${id}/toggle`);
    } catch {}
  };

  const handleDelete = async (id) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    try {
      await api.delete(`/ai/custom-agents/${id}`);
    } catch {}
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      isDark ? 'bg-[#111726] border-[#1e2942]' : 'bg-white border-gray-150 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-blue-500" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
              Custom AI Agent Builder
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-[#8a99b5] mt-1">
            Configure specialized AI agents with domain prompts for corporate compliance, legal, and financial auditing.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className={`py-2 px-4 rounded-xl text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
            isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#9a55ff] hover:bg-[#8843ed]'
          }`}
        >
          <Plus size={15} />
          <span>New AI Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
              agent.active
                ? isDark
                  ? 'bg-[#151c2e] border-blue-500/30'
                  : 'bg-purple-50/50 border-purple-200'
                : isDark
                ? 'bg-[#0f1523] border-[#1e2942] opacity-60'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-500 shrink-0" />
                    {agent.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block mt-0.5">
                    {agent.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(agent.id)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    agent.active
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500 border border-transparent'
                  }`}
                >
                  {agent.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <p className="text-[11px] text-gray-600 dark:text-[#8a99b5] leading-relaxed mb-3">
                {agent.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#1e2942]">
              <span className="text-[9px] text-gray-400 dark:text-[#5c6b8a]">
                Model: {agent.model || 'gpt-4-turbo'}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(agent.id)}
                className="text-rose-500 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                title="Remove Agent"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Add New Custom Agent */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Configure Custom Specialized AI Agent"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Agent Name"
            placeholder="e.g. Tax & Financial Audit Agent"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />

          <Input
            label="Agent Role Title"
            placeholder="e.g. Senior Forensic Accountant"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            required
          />

          <Input
            label="Short Description"
            placeholder="e.g. Scans financial reports for tax exposure anomalies."
            value={form.description}
            onChange={(f) => setForm((prev) => ({ ...prev, description: f.target.value }))}
            required
          />

          <Textarea
            label="System Instruction Prompt"
            placeholder="You are an expert AI auditor specializing in..."
            rows={4}
            value={form.systemPrompt}
            onChange={(f) => setForm((prev) => ({ ...prev, systemPrompt: f.target.value }))}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Deploy Custom Agent
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

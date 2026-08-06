import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Button from '@/ui/Button';
import RadialGlowButton from '@/ui/RadialGlowButton';
import Input from '@/ui/Input';
import Textarea from '@/ui/Textarea';
import Select from '@/ui/Select';
import FileUpload from '@/components/FileUpload';
import { caseService } from '@/services/caseService';
import { pageTransition } from '@/animations/variants';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function CreateCase() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('priority', form.priority);
      files.forEach((file) => formData.append('files', file));

      const res = await caseService.create(formData);
      navigate(`/workflow?caseId=${res.data.case.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">Create New Case</h1>
        <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">Submit a case for AI-powered multi-agent analysis</p>
      </div>

      <div className="rounded-2xl bg-surface-900 border border-surface-300 dark:border-white/[0.08] p-8 shadow-subtle-card backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Input
            label="Case Title"
            placeholder="Enter a descriptive title"
            value={form.title}
            onChange={handleChange('title')}
            required
          />

          <Textarea
            label="Description"
            placeholder="Provide detailed information about the case..."
            rows={6}
            value={form.description}
            onChange={handleChange('description')}
            required
          />

          <Select
            label="Priority"
            options={priorityOptions}
            value={form.priority}
            onChange={handleChange('priority')}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
              Attachments (optional)
            </label>
            <FileUpload onFilesSelected={setFiles} maxFiles={5} />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-surface-200 dark:border-white/5">
            <RadialGlowButton
              type="submit"
              loading={loading}
              icon={Send}
              size="lg"
            >
              Submit Case
            </RadialGlowButton>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}


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
      const serverMsg = err.response?.data?.message;
      const details = err.response?.data?.errors?.map((e) => `${e.field}: ${e.message}`).join(', ');
      setError(details ? `${serverMsg} (${details})` : (serverMsg || 'Failed to create case'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create New Case</h1>
        <p className="text-gray-500 dark:text-[#8a99b5] text-sm mt-1">Submit a case for AI-powered multi-agent analysis</p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#111726] border border-gray-150 dark:border-[#1e2942] p-8 shadow-sm dark:shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Attachments (optional)
            </label>
            <FileUpload onFilesSelected={setFiles} maxFiles={5} />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-[#1c273e]">
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



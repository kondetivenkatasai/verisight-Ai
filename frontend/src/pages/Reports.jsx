import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, ArrowUpDown } from 'lucide-react';
import ReportCard from '@/components/ReportCard';
import DecisionIntelligenceReport from '@/components/DecisionIntelligenceReport';
import Modal from '@/ui/Modal';
import { PageLoader } from '@/ui/Loader';
import { reportService } from '@/services/reportService';
import { pageTransition, staggerContainer, staggerItem } from '@/animations/variants';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportService.getAll();
        setReports(res.data.reports || []);
      } catch {
        // Fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filtered & Sorted Reports Computation
  const processedReports = useMemo(() => {
    return reports
      .filter((r) => {
        const query = searchQuery.toLowerCase();
        const titleMatch = (r.cases?.title || r.summary || '').toLowerCase().includes(query);
        const summaryMatch = (r.summary || '').toLowerCase().includes(query);
        const matchesSearch = titleMatch || summaryMatch;

        const matchesDecision =
          decisionFilter === 'all' || r.decision?.toLowerCase() === decisionFilter.toLowerCase();

        return matchesSearch && matchesDecision;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
        if (sortBy === 'highest_risk') return Number(b.risk_score || 0) - Number(a.risk_score || 0);
        if (sortBy === 'highest_confidence') return Number(b.confidence || 95) - Number(a.confidence || 95);
        return 0;
      });
  }, [reports, searchQuery, decisionFilter, sortBy]);

  if (loading) return <PageLoader />;

  return (
    <motion.div {...pageTransition} className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">Full Report History & Decision Intelligence</h1>
        <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">Search, filter, analyze, and export complete multi-agent AI reports</p>
      </div>

      {/* Controls Bar: Search, Filters, Sorting */}
      <div className="rounded-2xl bg-surface-900 border border-surface-300 dark:border-white/[0.08] p-4 backdrop-blur-xl shadow-subtle-card flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500" />
          <input
            type="text"
            placeholder="Search reports by title, keywords, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5 text-xs font-medium text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-aegis-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter by Decision */}
          <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-surface-600 dark:text-surface-300 font-medium">
            <Filter size={14} className="text-aegis-600 dark:text-aegis-400 shrink-0" />
            <span>Decision:</span>
            <select
              value={decisionFilter}
              onChange={(e) => setDecisionFilter(e.target.value)}
              className="bg-transparent text-surface-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-[#111318] text-surface-900 dark:text-white">All Decisions</option>
              <option value="approved" className="bg-white dark:bg-[#111318] text-emerald-600 dark:text-emerald-400">Approved</option>
              <option value="escalate" className="bg-white dark:bg-[#111318] text-amber-600 dark:text-amber-400">Escalated</option>
              <option value="needs_review" className="bg-white dark:bg-[#111318] text-indigo-600 dark:text-indigo-400">Needs Review</option>
              <option value="rejected" className="bg-white dark:bg-[#111318] text-red-600 dark:text-red-400">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-surface-600 dark:text-surface-300 font-medium">
            <ArrowUpDown size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-surface-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-white dark:bg-[#111318] text-surface-900 dark:text-white">Newest First</option>
              <option value="oldest" className="bg-white dark:bg-[#111318] text-surface-900 dark:text-white">Oldest First</option>
              <option value="highest_risk" className="bg-white dark:bg-[#111318] text-surface-900 dark:text-white">Highest Risk</option>
              <option value="highest_confidence" className="bg-white dark:bg-[#111318] text-surface-900 dark:text-white">Highest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {processedReports.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {processedReports.map((report) => (
            <motion.div key={report.id} variants={staggerItem}>
              <ReportCard report={report} onClick={() => setSelectedReport(report)} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-2xl bg-surface-900 border border-surface-300 dark:border-white/[0.08] p-12 text-center shadow-subtle-card">
          <FileText size={40} className="mx-auto mb-4 text-surface-400 dark:text-surface-600" />
          <h3 className="text-lg font-bold text-surface-900 dark:text-surface-200 mb-2">No matching reports found</h3>
          <p className="text-sm text-surface-500 font-normal">Try adjusting your search terms or decision filters</p>
        </div>
      )}

      {/* Decision Intelligence Report Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="AI Decision Intelligence Report"
        size="5xl"
      >
        {selectedReport && (
          <DecisionIntelligenceReport
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </Modal>
    </motion.div>
  );
}


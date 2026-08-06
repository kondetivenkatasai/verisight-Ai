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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Full Report History & Decision Intelligence
        </h1>
        <p className="text-gray-500 dark:text-[#8a99b5] text-sm mt-1">
          Search, filter, analyze, and export complete multi-agent AI reports
        </p>
      </div>

      {/* Controls Bar: Search, Filters, Sorting */}
      <div className="rounded-2xl bg-white dark:bg-[#111726] border border-gray-150 dark:border-[#1e2942] p-4 shadow-sm dark:shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#5c6b8a]" />
          <input
            type="text"
            placeholder="Search reports by title, keywords, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-[#151c2e] border border-gray-200 dark:border-[#1e2942] text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#5c6b8a] focus:outline-none focus:border-[#9a55ff] dark:focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter by Decision */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#151c2e] border border-gray-200 dark:border-[#1e2942] rounded-xl px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
            <Filter size={14} className="text-[#9a55ff] dark:text-blue-400 shrink-0" />
            <span>Decision:</span>
            <select
              value={decisionFilter}
              onChange={(e) => setDecisionFilter(e.target.value)}
              className="bg-transparent text-gray-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-[#111726] text-gray-900 dark:text-white">All Decisions</option>
              <option value="approved" className="bg-white dark:bg-[#111726] text-emerald-600 dark:text-emerald-400">Approved</option>
              <option value="escalate" className="bg-white dark:bg-[#111726] text-amber-600 dark:text-amber-400">Escalated</option>
              <option value="needs_review" className="bg-white dark:bg-[#111726] text-indigo-600 dark:text-indigo-400">Needs Review</option>
              <option value="rejected" className="bg-white dark:bg-[#111726] text-rose-600 dark:text-rose-400">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#151c2e] border border-gray-200 dark:border-[#1e2942] rounded-xl px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
            <ArrowUpDown size={14} className="text-[#9a55ff] dark:text-blue-400 shrink-0" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-gray-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-white dark:bg-[#111726] text-gray-900 dark:text-white">Newest First</option>
              <option value="oldest" className="bg-white dark:bg-[#111726] text-gray-900 dark:text-white">Oldest First</option>
              <option value="highest_risk" className="bg-white dark:bg-[#111726] text-gray-900 dark:text-white">Highest Risk</option>
              <option value="highest_confidence" className="bg-white dark:bg-[#111726] text-gray-900 dark:text-white">Highest Confidence</option>
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
        <div className="rounded-2xl bg-white dark:bg-[#111726] border border-gray-150 dark:border-[#1e2942] p-12 text-center shadow-sm">
          <FileText size={40} className="mx-auto mb-4 text-gray-300 dark:text-[#3d4b68]" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No matching reports found</h3>
          <p className="text-sm text-gray-500 dark:text-[#8a99b5] font-normal">Try adjusting your search terms or decision filters</p>
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


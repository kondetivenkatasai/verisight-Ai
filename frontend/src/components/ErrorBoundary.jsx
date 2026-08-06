import React from 'react';
import Button from '@/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught rendering exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-xl">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Workflow Interface Recovered</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
            An unexpected error occurred while rendering the workflow pipeline. We have safely caught the exception so your data remains intact.
          </p>
          <Button icon={RefreshCw} onClick={this.handleReset} size="md">
            Reload Workflow Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

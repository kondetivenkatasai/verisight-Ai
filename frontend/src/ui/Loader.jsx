export default function Loader({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]} rounded-full
          border-aegis-500/30 border-t-aegis-500
          animate-spin
        `}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Loader size="lg" />
        <p className="text-surface-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonLine({ className = '' }) {
  return (
    <div
      className={`h-4 rounded-lg bg-surface-800 animate-pulse ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-surface-900/50 border border-surface-700/30 p-6 space-y-4">
      <SkeletonLine className="w-3/4 h-5" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-1/2" />
    </div>
  );
}

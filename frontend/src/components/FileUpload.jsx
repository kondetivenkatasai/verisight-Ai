import { useState, useCallback } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';

export default function FileUpload({ onFilesSelected, maxFiles = 5, accept = '*' }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (newFiles) => {
      const fileArray = Array.from(newFiles).slice(0, maxFiles - files.length);
      const updated = [...files, ...fileArray];
      setFiles(updated);
      onFilesSelected?.(updated);
    },
    [files, maxFiles, onFilesSelected]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesSelected?.(updated);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-2xl border-2 border-dashed p-8 text-center
          transition-all duration-200 cursor-pointer backdrop-blur-md
          ${
            dragActive
              ? 'border-aegis-500 bg-aegis-500/10'
              : 'border-surface-300 dark:border-white/10 hover:border-aegis-500/50 bg-surface-100 dark:bg-surface-800/40'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="p-3 rounded-2xl bg-aegis-500/10 border border-aegis-500/20 inline-flex mb-3">
          <Upload size={24} className="text-aegis-600 dark:text-aegis-400" />
        </div>
        <p className="text-xs sm:text-sm text-surface-700 dark:text-surface-300 mb-1 font-semibold">
          <span className="text-aegis-600 dark:text-aegis-400 font-bold">Click to upload</span> or drag and drop
        </p>
        <p className="text-[11px] text-surface-500 font-medium">Up to {maxFiles} files</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-xl bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5 px-3.5 py-2.5 shadow-subtle-card"
            >
              <FileIcon size={16} className="text-aegis-600 dark:text-aegis-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-surface-900 dark:text-white truncate">{file.name}</p>
                <p className="text-[11px] font-medium text-surface-500">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


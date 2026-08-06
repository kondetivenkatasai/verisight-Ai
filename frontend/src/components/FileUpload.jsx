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
          relative rounded-xl border-2 border-dashed p-8 text-center
          transition-all duration-200 cursor-pointer
          ${
            dragActive
              ? 'border-aegis-500 bg-aegis-500/5'
              : 'border-surface-700/50 hover:border-surface-600 bg-surface-900/30'
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
        <Upload size={28} className="mx-auto mb-3 text-surface-500" />
        <p className="text-sm text-surface-300 mb-1">
          <span className="text-aegis-400 font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-surface-500">Up to {maxFiles} files</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg bg-surface-900/50 border border-surface-700/30 px-3 py-2"
            >
              <FileIcon size={16} className="text-aegis-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-200 truncate">{file.name}</p>
                <p className="text-xs text-surface-500">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 rounded hover:bg-surface-800 text-surface-500 hover:text-red-400 transition-colors"
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

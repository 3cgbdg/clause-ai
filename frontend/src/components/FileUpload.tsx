import { useRef } from 'react';
import { FileText, CheckCircle, Upload } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileUpload = ({ file, onFileSelect }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        onFileSelect(droppedFile);
      }
    }
  };

  return (
    <div 
      className={`w-full h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group relative overflow-hidden ${
        file 
        ? 'border-accent/50 bg-accent/5' 
        : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
      }`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />
      
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
        file ? 'bg-accent text-white rotate-0' : 'bg-white/5 text-gray-400 group-hover:scale-110'
      }`}>
        {file ? <CheckCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
      </div>
      
      <h3 className="text-lg font-semibold mb-2 px-4 text-center truncate max-w-full">
        {file ? file.name : 'Click or drag PDF to upload'}
      </h3>
      
      <p className="text-sm text-gray-400 text-center px-4">
        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Up to 50 pages or 10MB.'}
      </p>

      {file && (
        <button 
          onClick={(e) => { e.stopPropagation(); onFileSelect(null); }}
          className="mt-6 text-xs text-risk-high hover:underline font-bold uppercase tracking-widest bg-risk-high/10 px-3 py-1 rounded-full"
        >
          Remove file
        </button>
      )}

      {/* Subtle indicator for drag drop */}
      {!file && (
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </div>
  );
};

export default FileUpload;

import React, { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  onProcess: () => void;
  isProcessing: boolean;
  files: File[];
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zM3 10a1 1 0 011 1v1h1a1 1 0 010 2H4v1a1 1 0 01-2 0v-1H1a1 1 0 010-2h1v-1a1 1 0 011-1zm12 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, onProcess, isProcessing, files }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    onFilesSelect(newFiles);
  }, [onFilesSelect]);

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const newFiles = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    if(fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
    }
    onFilesSelect(newFiles);
  }, [onFilesSelect]);
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const dropzoneClasses = `relative block w-full border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ease-in-out ${isDragging ? 'border-brand-cyan bg-brand-cyan/10' : 'border-brand-accent/50 hover:border-brand-cyan/80'}`;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <label 
        htmlFor="file-upload" 
        className={dropzoneClasses}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-brand-light">
            <UploadIcon className={isDragging ? 'text-brand-cyan' : 'text-brand-accent'}/>
            <span className="mt-2 block font-medium">
                Drag & Drop files here or <span className="text-brand-cyan font-semibold">browse</span>
            </span>
            <p className="text-sm text-brand-accent">PDF, DOCX, TXT, CSV, JSON</p>
        </div>
        <input
            id="file-upload"
            name="file-upload"
            type="file"
            multiple
            className="sr-only"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.csv,.json,.html"
        />
      </label>

      {files.length > 0 && (
        <div className="space-y-3 animate-fade-in">
            <h3 className="font-semibold text-brand-light">Selected Files:</h3>
            <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-brand-primary/80 border border-brand-accent/50 py-1 px-3 rounded-full text-sm">
                        <span className="flex-1 truncate max-w-xs text-brand-text/90">{file.name}</span>
                        <span className="text-brand-accent text-xs">{Math.round(file.size / 1024)} KB</span>
                    </div>
                ))}
            </div>
        </div>
      )}

      <button
        onClick={onProcess}
        disabled={isProcessing || files.length === 0}
        className="w-full bg-gradient-to-r from-brand-cyan to-cyan-400 text-brand-primary font-bold py-3 px-4 rounded-lg hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] transition-all duration-300 ease-in-out disabled:from-brand-accent disabled:to-brand-light disabled:text-brand-secondary disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center space-x-2"
      >
        <SparkleIcon />
        <span>{isProcessing ? 'Processing...' : 'Analyze Files'}</span>
      </button>
    </div>
  );
};
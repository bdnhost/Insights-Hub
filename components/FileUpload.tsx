
import React, { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const FileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-light" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
    </svg>
);


export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, onProcess, isProcessing }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
    onFilesSelect(files);
  }, [onFilesSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    if(fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
    }
    setSelectedFiles(files);
    onFilesSelect(files);
  }, [onFilesSelect]);
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="space-y-6">
      <label 
        htmlFor="file-upload" 
        className="relative block w-full border-2 border-dashed border-brand-accent rounded-lg p-12 text-center cursor-pointer hover:border-brand-cyan transition-colors duration-300"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
            <UploadIcon />
            <span className="mt-2 block text-sm font-medium text-brand-light">
                Drag & Drop files here or <span className="text-brand-cyan">browse</span>
            </span>
            <p className="text-xs text-brand-accent">PDF, DOCX, TXT, CSV, JSON</p>
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

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
            <h3 className="font-semibold text-brand-light">Selected Files:</h3>
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center space-x-2 bg-brand-primary p-2 rounded-md text-sm">
                        <FileIcon />
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-brand-accent">{Math.round(file.size / 1024)} KB</span>
                    </li>
                ))}
            </ul>
        </div>
      )}

      <button
        onClick={onProcess}
        disabled={isProcessing || selectedFiles.length === 0}
        className="w-full bg-brand-cyan text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 disabled:bg-brand-accent disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? 'Processing...' : 'Analyze Files'}
      </button>
    </div>
  );
};

import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { analyzeFiles, queryData } from './services/geminiService';
import type { AnalysisResult } from './types';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setAnalysisResult(null);
    setQueryResult(null);
    setError(null);
  };

  const handleProcessFiles = useCallback(async () => {
    if (files.length === 0) {
      setError("Please select files to analyze.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setAnalysisResult(null);
    setQueryResult(null);

    try {
      const result = await analyzeFiles(files);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsProcessing(false);
    }
  }, [files]);
  
  const handleQuery = useCallback(async (query: string) => {
    if (!analysisResult) {
      setError("Please process files before asking a question.");
      return;
    }
    setIsQuerying(true);
    setQueryResult(null);
    setError(null);

    try {
        const context = `
            Main Summary: ${analysisResult.summary}
            Identified Topics: ${analysisResult.topics.join(', ')}
        `;
      const result = await queryData(context, query);
      setQueryResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while querying.");
    } finally {
      setIsQuerying(false);
    }
  }, [analysisResult]);

  return (
    <div className="min-h-screen bg-brand-primary font-sans text-brand-text">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto bg-brand-secondary/50 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-xl border border-brand-accent/30 p-4 sm:p-6 lg:p-8 space-y-8">
          <FileUpload onFilesSelect={handleFilesSelect} onProcess={handleProcessFiles} isProcessing={isProcessing} files={files} />

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-center font-medium animate-fade-in">{error}</div>}
          
          {isProcessing && (
            <div className="flex flex-col items-center justify-center space-y-4 text-brand-light p-8">
              <Spinner />
              <p className="text-lg animate-pulse">AI agents are analyzing your data...</p>
              <p className="text-sm text-brand-accent">This might take a moment.</p>
            </div>
          )}

          {analysisResult && (
            <AnalysisDashboard 
              result={analysisResult} 
              onQuery={handleQuery}
              isQuerying={isQuerying}
              queryResult={queryResult}
            />
          )}
        </div>
        <footer className="text-center text-brand-accent text-sm mt-12 pb-4">
          <p>&copy; {new Date().getFullYear()} DeepSeek Insights. Powered by AI.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
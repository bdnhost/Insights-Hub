
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
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-brand-secondary rounded-2xl shadow-2xl p-6 md:p-8 space-y-8">
          <FileUpload onFilesSelect={handleFilesSelect} onProcess={handleProcessFiles} isProcessing={isProcessing} />

          {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg text-center">{error}</div>}
          
          {isProcessing && (
            <div className="flex flex-col items-center justify-center space-y-4 text-brand-light p-8">
              <Spinner />
              <p className="text-lg animate-pulse">AI agents are analyzing your data...</p>
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
        <footer className="text-center text-brand-accent mt-12 pb-4">
          <p>&copy; {new Date().getFullYear()} DeepSeek Insights. Powered by AI.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;

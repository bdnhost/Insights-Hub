import type { AnalysisResult } from '../types';

export const analyzeFiles = async (files: File[]): Promise<AnalysisResult> => {
    const fileNames = files.map(f => f.name).join(', ');

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileNames }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "An unknown error occurred" }));
            throw new Error(`Server error: ${response.status} - ${errorData.error || 'Failed to analyze files.'}`);
        }

        const result: AnalysisResult = await response.json();
        
        // Basic validation
        if (!result.summary || !Array.isArray(result.topics) || !Array.isArray(result.trends) || !Array.isArray(result.opportunities)) {
            throw new Error("Invalid response structure from server.");
        }

        return result;

    } catch (error) {
        console.error("Error calling analysis API:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to analyze files.");
    }
};

export const queryData = async (context: string, query: string): Promise<string> => {
    try {
        const response = await fetch('/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ context, query }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "An unknown error occurred" }));
            throw new Error(`Server error: ${response.status} - ${errorData.error || 'Failed to get answer.'}`);
        }
        
        const result = await response.json();
        if (typeof result.text !== 'string') {
            throw new Error("Invalid response structure from query API.");
        }
        return result.text;
    } catch (error) {
        console.error("Error calling query API:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to get an answer.");
    }
};
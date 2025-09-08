
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A comprehensive summary of the potential insights derived from the files, written in Hebrew."
        },
        topics: {
            type: Type.ARRAY,
            description: "A list of key topics or categories identified from the file names, in Hebrew.",
            items: { type: Type.STRING }
        },
        trends: {
            type: Type.ARRAY,
            description: "A list of potential trends detected, including a confidence score.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the trend in Hebrew." },
                    description: { type: Type.STRING, description: "A brief explanation of the trend in Hebrew." },
                    confidence: { type: Type.INTEGER, description: "A confidence score from 0 to 100." }
                },
                required: ["name", "description", "confidence"]
            }
        },
        opportunities: {
            type: Type.ARRAY,
            description: "A list of potential business or research opportunities identified.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Title of the opportunity in Hebrew." },
                    description: { type: Type.STRING, description: "A detailed description of the opportunity in Hebrew." },
                    potential_score: { type: Type.INTEGER, description: "A score from 0 to 100 indicating the potential impact." }
                },
                required: ["title", "description", "potential_score"]
            }
        }
    },
    required: ["summary", "topics", "trends", "opportunities"]
};


export const analyzeFiles = async (files: File[]): Promise<AnalysisResult> => {
    const fileNames = files.map(f => f.name).join(', ');
    const prompt = `
        Based on the following list of file names, act as a multi-agent AI system for business intelligence.
        File names: ${fileNames}.
        
        Your agents are:
        - Summarizer Agent: Provide a high-level summary of the potential information contained within these files.
        - Classifier Agent: Identify the main topics or domains.
        - Trend Analyzer Agent: Detect potential market or data trends.
        - Opportunity Finder Agent: Identify potential business or research opportunities.
        
        Please provide your combined analysis in Hebrew.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        // Basic validation
        if (!result.summary || !Array.isArray(result.topics) || !Array.isArray(result.trends) || !Array.isArray(result.opportunities)) {
            throw new Error("Invalid response structure from AI model.");
        }

        return result as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze files. The AI model could not process the request.");
    }
};

export const queryData = async (context: string, query: string): Promise<string> => {
    const prompt = `
        You are an AI assistant analyzing a dataset.
        Here is the initial analysis context: "${context}".
        
        Now, answer the user's question based on this context. The question is in Hebrew, so please respond in Hebrew.
        
        Question: "${query}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for query:", error);
        throw new Error("Failed to get an answer. The AI model could not process the query.");
    }
};

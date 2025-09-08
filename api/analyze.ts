
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { fileNames } = req.body;
        if (!fileNames || typeof fileNames !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid fileNames in request body.' });
        }
        
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

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in /api/analyze:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to analyze files on the server.", details: message });
    }
}

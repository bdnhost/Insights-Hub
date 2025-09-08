
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { context, query } = req.body;
        if (!context || typeof context !== 'string' || !query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid context/query in request body.' });
        }

        const prompt = `
            You are an AI assistant analyzing a dataset.
            Here is the initial analysis context: "${context}".
            
            Now, answer the user's question based on this context. The question is in Hebrew, so please respond in Hebrew.
            
            Question: "${query}"
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return res.status(200).json({ text: response.text });
    } catch (error) {
        console.error("Error in /api/query:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to process query on the server.", details: message });
    }
}

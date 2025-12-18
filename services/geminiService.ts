
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getFinancialInsight = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) {
    return "Start adding transactions to unlock AI-powered insights about your money.";
  }

  // Optimize payload size for the context window
  const recentTransactions = transactions.slice(0, 50).map(t => ({
    a: t.amount,
    c: t.category,
    t: t.type,
    d: t.description,
    s: t.source
  }));

  try {
    // Using gemini-3-flash-preview for basic text tasks like summarization and insights
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze these financial transactions for a college student. 
        Data: ${JSON.stringify(recentTransactions)}.
        
        Provide a single, short, witty, and friendly 1-sentence insight or nudge. 
        Focus on patterns (e.g., too much coffee, good saving, subscription overload).
        Use emojis. Be encouraging but honest. 
        Do not use markdown. Just plain text.
      `,
    });

    // Extracting text output directly from GenerateContentResponse property (not a method)
    return response.text || "Keep tracking to see more insights!";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Couldn't generate an insight right now. Check back later! 🌟";
  }
};

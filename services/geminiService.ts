
import { GoogleGenAI } from "@google/genai";
import { Book, Sale, Purchase } from "../types";

// Fixed: Correctly initialize GoogleGenAI as a world-class engineer
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistanceStream = async (
  query: string,
  data: { books: Book[]; sales: Sale[]; purchases: Purchase[] }
) => {
  try {
    const context = `
      You are Salman AI, the world-class Library Management AI for Salman Book Center. 
      You have access to current library data for this specific shop:
      - Total unique book titles: ${data.books.length}
      - Total units in stock: ${data.books.reduce((acc, b) => acc + b.quantity, 0)}
      - Total revenue to date: ₹${data.sales.reduce((acc, s) => acc + s.totalAmount, 0)}
      
      Inventory Snapshot: ${data.books.map(b => `${b.name} by ${b.writer} (${b.quantity} in stock)`).join(', ')}

      Rules:
      1. If the user asks about Salman Book Center's stats, use the provided context.
      2. If the user asks for information about a specific book NOT in the list, use Google Search to provide a summary and current popularity.
      3. Always be professional, helpful, and concise.
      4. If you use external search results, mention the sources.
    `;

    // Fixed: Updated model to gemini-3-flash-preview and simplified contents
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: context,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    return responseStream;
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    throw error;
  }
};

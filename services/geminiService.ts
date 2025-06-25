
import { GoogleGenAI, GenerateContentResponse, Chat, GroundingChunk } from "@google/genai";
import { StoryOutput, WhyZoneAnswer } from '../types';
import { API_KEY_ERROR_MESSAGE } from "../constants";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error(API_KEY_ERROR_MESSAGE);
}

const STORY_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const QNA_MODEL_NAME = 'gemini-2.5-flash-preview-04-17'; // Can use the same or different

const cleanJsonString = (jsonStr: string): string => {
  let cleaned = jsonStr.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleaned.match(fenceRegex);
  if (match && match[2]) {
    cleaned = match[2].trim();
  }
  return cleaned;
};

export const generateStoryFromPrompt = async (prompt: string, kidAgeGroup: '3-5' | '6-8' | null): Promise<StoryOutput> => {
  if (!ai) throw new Error(API_KEY_ERROR_MESSAGE);

  const ageSpecificInstruction = kidAgeGroup === '3-5' 
    ? "Keep the story very simple, with easy words, short sentences, and a positive message. Focus on clear actions and familiar concepts. Maximum 100 words."
    : "Make the story engaging and slightly more complex, with some descriptive language and a clear plot. Maximum 200 words.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: STORY_MODEL_NAME,
      contents: `Generate a short, fun, and imaginative story for a child. The story should be based on this idea: "${prompt}".
      The story should have a clear title.
      Respond in JSON format with the following structure: { "title": "Story Title", "story": "The full story text...", "characters": ["Character1", "Character2"], "setting": "Description of where it happens" }.`,
      config: {
        systemInstruction: `You are a creative and friendly storyteller for children. ${ageSpecificInstruction}`,
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        thinkingConfig: { thinkingBudget: 0 } // Low latency for creative tasks
      },
    });

    const rawJson = response.text;
    const cleanedJson = cleanJsonString(rawJson);
    const parsedData = JSON.parse(cleanedJson) as StoryOutput;
    
    // Validate required fields
    if (!parsedData.title || !parsedData.story) {
        // Fallback if JSON structure is not as expected, or try a simpler prompt
        console.warn("Gemini response did not match expected StoryOutput structure. Falling back.", parsedData);
        return { title: "A Fun Story", story: `Once upon a time, in a land full of wonders, there was an adventure about ${prompt}. It was very exciting!`, characters: [], setting: "A magical place" };
    }
    return parsedData;

  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    // Provide a friendly fallback story
    return {
      title: "Oops! Story Time Glitch",
      story: `Once upon a time, the story machine had a little hiccup! But imagine a wonderful adventure about "${prompt}". It was surely magical!`,
      characters: ["Brave Explorer"],
      setting: "A land of imagination"
    };
  }
};

export const getAnswerForWhyQuestion = async (question: string, kidAgeGroup: '3-5' | '6-8' | null): Promise<{ answer: string; sources?: GroundingChunk[] }> => {
  if (!ai) throw new Error(API_KEY_ERROR_MESSAGE);

  const ageSpecificInstruction = kidAgeGroup === '3-5' 
    ? "Explain in very simple terms, using short sentences and words a 3-5 year old can understand. Be concise and direct. Focus on the core concept."
    : "Explain clearly and engagingly, suitable for a 6-8 year old. You can use slightly more complex vocabulary and provide a bit more detail.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: QNA_MODEL_NAME,
      contents: `Please answer this child's question: "${question}"`,
      config: {
        systemInstruction: `You are a friendly and knowledgeable helper for curious kids. ${ageSpecificInstruction} If the question is about recent events or needs up-to-date info, use Google Search to find the answer. Always list the sources if you use Google Search.`,
        tools: [{ googleSearch: {} }], // Enable Google Search grounding
        temperature: 0.5, // More factual
        thinkingConfig: { thinkingBudget: 0 } 
      },
    });

    const answerText = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.filter(chunk => chunk.web) as GroundingChunk[] | undefined;
    
    return { answer: answerText, sources };

  } catch (error) {
    console.error("Error getting answer from Gemini:", error);
    return { answer: "Oops! I had a little trouble finding that answer. Maybe ask a grown-up or try another question?" };
  }
};

// Simple chat functionality can be added here if needed, following the Chat API guidelines.
// For now, focusing on single-turn generation.
let chatInstance: Chat | null = null;

export const startChat = (systemInstruction?: string): void => {
    if (!ai) throw new Error(API_KEY_ERROR_MESSAGE);
    chatInstance = ai.chats.create({
        model: QNA_MODEL_NAME, // Or a different model for chat
        config: {
            systemInstruction: systemInstruction || "You are a friendly conversational AI for kids.",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });
};

export const sendMessageInChat = async (message: string): Promise<string> => {
    if (!ai) throw new Error(API_KEY_ERROR_MESSAGE);
    if (!chatInstance) {
        startChat(); // Initialize with default if not started
    }
    if (!chatInstance) return "Chat not initialized."; // Should not happen if startChat works

    try {
        const response: GenerateContentResponse = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending chat message:", error);
        return "Sorry, I couldn't process that message right now.";
    }
};
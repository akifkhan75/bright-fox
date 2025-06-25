
import { GoogleGenAI, GenerateContentResponse, Chat, GroundingChunk } from "@google/genai";
import { StoryOutput } from '../types'; // WhyZoneAnswer also from types
import { API_KEY_ERROR_MESSAGE } from "../constants";

// For React Native, API_KEY should be managed securely, e.g., via react-native-dotenv
// import { GEMINI_API_KEY } from '@env'; // Example if using react-native-dotenv
// For this conversion, we'll assume API_KEY is made available globally or imported
// from a dedicated config file that you'll set up.
// As a placeholder:
const getConfiguredApiKey = (): string | undefined => {
  // In a real app, you'd use react-native-dotenv or a similar mechanism.
  // For example, if you have a config.ts:
  // import { GEMINI_API_KEY } from './config'; return GEMINI_API_KEY;
  // This is a placeholder and will likely cause an error if not set up.
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    // @ts-ignore
    return process.env.API_KEY;
  }
  // @ts-ignore (if you set it up via @env)
  if (typeof GEMINI_API_KEY !== 'undefined') return GEMINI_API_KEY;

  console.warn("GEMINI_API_KEY is not configured for React Native. Please set it up in your environment (e.g., via react-native-dotenv).");
  return undefined; 
};

const API_KEY = getConfiguredApiKey();

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error(API_KEY_ERROR_MESSAGE);
  // Consider how to handle this in UI - maybe disable AI features
}

const STORY_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const QNA_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

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
  if (!ai) throw new Error(API_KEY_ERROR_MESSAGE + " Gemini AI client not initialized.");

  const ageSpecificInstruction = kidAgeGroup === '3-5' 
    ? "Keep the story very simple, with easy words, short sentences, and a positive message. Focus on clear actions and familiar concepts. Maximum 100 words."
    : "Make the story engaging and slightly more complex, with some descriptive language and a clear plot. Maximum 200 words.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: STORY_MODEL_NAME,
      contents: `Generate a short, fun, and imaginative story for a child. The story should be based on this idea: "${prompt}".
      Respond in JSON format with the following structure: { "title": "Story Title", "story": "The full story text...", "characters": ["Character1", "Character2"], "setting": "Description of where it happens" }.`,
      config: {
        systemInstruction: `You are a creative and friendly storyteller for children. ${ageSpecificInstruction}`,
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const rawJson = response.text;
    const cleanedJson = cleanJsonString(rawJson);
    const parsedData = JSON.parse(cleanedJson) as StoryOutput;
    
    if (!parsedData.title || !parsedData.story) {
        console.warn("Gemini response did not match expected StoryOutput structure. Falling back.", parsedData);
        return { title: "A Fun Story", story: `Once upon a time, in a land full of wonders, there was an adventure about ${prompt}. It was very exciting!`, characters: [], setting: "A magical place" };
    }
    return parsedData;

  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    return {
      title: "Oops! Story Time Glitch",
      story: `Once upon a time, the story machine had a little hiccup! But imagine a wonderful adventure about "${prompt}". It was surely magical!`,
      characters: ["Brave Explorer"],
      setting: "A land of imagination"
    };
  }
};

export const getAnswerForWhyQuestion = async (question: string, kidAgeGroup: '3-5' | '6-8' | null): Promise<{ answer: string; sources?: GroundingChunk[] }> => {
  if (!ai) throw new Error(API_KEY_ERROR_MESSAGE + " Gemini AI client not initialized.");

  const ageSpecificInstruction = kidAgeGroup === '3-5' 
    ? "Explain in very simple terms, using short sentences and words a 3-5 year old can understand. Be concise and direct. Focus on the core concept."
    : "Explain clearly and engagingly, suitable for a 6-8 year old. You can use slightly more complex vocabulary and provide a bit more detail.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: QNA_MODEL_NAME,
      contents: `Please answer this child's question: "${question}"`,
      config: {
        systemInstruction: `You are a friendly and knowledgeable helper for curious kids. ${ageSpecificInstruction} If the question is about recent events or needs up-to-date info, use Google Search to find the answer. Always list the sources if you use Google Search.`,
        tools: [{ googleSearch: {} }],
        temperature: 0.5,
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


let chatInstance: Chat | null = null;

export const startChat = (systemInstruction?: string): void => {
    if (!ai) throw new Error(API_KEY_ERROR_MESSAGE + " Gemini AI client not initialized.");
    chatInstance = ai.chats.create({
        model: QNA_MODEL_NAME,
        config: {
            systemInstruction: systemInstruction || "You are a friendly conversational AI for kids.",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });
};

export const sendMessageInChat = async (message: string): Promise<string> => {
    if (!ai) throw new Error(API_KEY_ERROR_MESSAGE + " Gemini AI client not initialized.");
    if (!chatInstance) {
        startChat(); 
    }
    if (!chatInstance) return "Chat not initialized."; 

    try {
        const response: GenerateContentResponse = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending chat message:", error);
        return "Sorry, I couldn't process that message right now.";
    }
};

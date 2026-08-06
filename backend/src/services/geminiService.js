import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let genAI = null;

function getClient() {
  if (!genAI) {
    if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY.includes('your-gemini-api-key') || env.GEMINI_API_KEY.trim() === '') {
      return null;
    }
    try {
      genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    } catch (err) {
      logger.error('Failed to initialize GoogleGenerativeAI client:', err.message);
      return null;
    }
  }
  return genAI;
}

export const geminiService = {
  async generateContent(prompt, mediaParts = [], { temperature = 0.7, maxTokens = 4096 } = {}) {
    const client = getClient();
    if (!client) {
      return { text: '', error: true, message: 'AI API client not initialized' };
    }

    const candidateModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-pro'];

    for (const modelName of candidateModels) {
      try {
        const genModel = client.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        });

        const contents = mediaParts && mediaParts.length > 0 ? [prompt, ...mediaParts] : prompt;
        const result = await genModel.generateContent(contents);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim().length > 0) {
          return { text, error: false };
        }
      } catch (err) {
        logger.warn(`Model ${modelName} failed: ${err.message}. Trying next model...`);
      }
    }

    return { text: '', error: true, message: 'All Gemini models failed or API key invalid.' };
  },

  async generateJSON(prompt, mediaParts = [], options = {}) {
    const promptText = prompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include markdown formatting or code blocks.';
    const result = await this.generateContent(promptText, mediaParts, options);

    if (result.error || !result.text) {
      return { data: null, error: result.message || 'No AI response' };
    }

    try {
      const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return { data: JSON.parse(cleaned), error: null };
    } catch (parseError) {
      logger.error('Failed to parse Gemini response as JSON:', parseError.message);
      return { data: null, error: 'JSON parsing failure' };
    }
  },
};

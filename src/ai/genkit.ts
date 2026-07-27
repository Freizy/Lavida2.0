import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let _ai: ReturnType<typeof genkit> | null = null;

export function getAI() {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY. Set it in your .env or Netlify environment variables.');
    }
    _ai = genkit({
      plugins: [googleAI({apiKey})],
      model: 'googleai/gemini-flash-latest',
    });
  }
  return _ai;
}

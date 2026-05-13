'use server';
/**
 * @fileOverview A symptom analysis AI agent.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis process.
 * - SymptomAnalysisInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalysisOutput - The return type for the analyzeSymptoms function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SymptomAnalysisInputSchema = z.object({
  gender: z.enum(['Male', 'Female']).describe('The gender of the user.'),
  age: z.number().int().min(1).max(99).describe('The age of the user in years.'),
  symptoms: z.string().min(1).describe('A detailed description of the symptoms the user is experiencing.'),
});
export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

const SymptomAnalysisOutputSchema = z.string().describe('A concise explanation of 5 possible medical conditions, their causes, and suggested next steps.');
export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;

export async function analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisOutput> {
  return symptomAnalysisFlow(input);
}

const symptomAnalysisPrompt = ai.definePrompt({
  name: 'symptomAnalysisPrompt',
  input: { schema: SymptomAnalysisInputSchema },
  output: { schema: SymptomAnalysisOutputSchema },
  prompt: `You are a friendly medical assistant. Briefly explain 5 possible conditions, their causes, and suggested next steps for a {{{age}}}-year-old {{{gender}}} experiencing the following symptoms: {{{symptoms}}}. Keep the answer concise and easy to read.`,
});

const symptomAnalysisFlow = ai.defineFlow(
  {
    name: 'symptomAnalysisFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await symptomAnalysisPrompt(input);
    return output!;
  }
);

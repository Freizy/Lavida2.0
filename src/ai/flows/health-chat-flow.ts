'use server';
/**
 * @fileOverview A conversational AI flow for health-related follow-up questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const HealthChatInputSchema = z.object({
  initialContext: z.object({
    gender: z.string(),
    age: z.number(),
    symptoms: z.string(),
    conditions: z.array(z.string()),
  }),
  history: z.array(MessageSchema),
  message: z.string(),
});

export type HealthChatInput = z.infer<typeof HealthChatInputSchema>;

const HealthChatOutputSchema = z.object({
  response: z.string(),
});

export type HealthChatOutput = z.infer<typeof HealthChatOutputSchema>;

export async function chatWithLaVida(input: HealthChatInput): Promise<HealthChatOutput> {
  return healthChatFlow(input);
}

const healthChatPrompt = ai.definePrompt({
  name: 'healthChatPrompt',
  input: { schema: HealthChatInputSchema },
  output: { schema: HealthChatOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
  prompt: `You are LaVida Health Buddy, a friendly and empathetic medical assistant.
The user is a {{{initialContext.age}}}-year-old {{{initialContext.gender}}} who previously reported these symptoms: "{{{initialContext.symptoms}}}".
Our initial analysis suggested these possible conditions: {{#each initialContext.conditions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.

Your goal is to answer their follow-up questions concisely and helpfully. 
Always maintain a supportive tone but include a clear disclaimer that you are an AI and they should see a doctor for medical diagnosis.

Conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
user: {{{message}}}
model:`,
});

const healthChatFlow = ai.defineFlow(
  {
    name: 'healthChatFlow',
    inputSchema: HealthChatInputSchema,
    outputSchema: HealthChatOutputSchema,
  },
  async (input) => {
    const { output } = await healthChatPrompt(input);
    if (!output) {
      throw new Error('I am sorry, I am having trouble responding right now. Please try again.');
    }
    return output;
  }
);

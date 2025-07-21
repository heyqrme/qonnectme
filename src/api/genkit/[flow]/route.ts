import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { nextHandler } from '@genkit-ai/next';
import '@/ai/flows/suggest-profile-theme';

export const { GET, POST } = nextHandler();

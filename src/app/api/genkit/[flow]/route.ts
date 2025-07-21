import { createApiHandler } from '@genkit-ai/next/api';
import '@/ai/flows/suggest-profile-theme';

export const { GET, POST } = createApiHandler();

// IMPORTANT: Import all flows that you want to be exposed as API endpoints.
import '@/ai/flows/suggest-profile-theme';

// The 'run' function from @genkit-ai/next is a default export
// that creates the route handler for you.
import run from '@genkit-ai/next';

// This single line exposes all imported Genkit flows as API endpoints.
// It handles the request, runs the specified flow, and returns the response.
export const POST = run();

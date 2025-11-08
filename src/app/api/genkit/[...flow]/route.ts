'use server';
import {getGenkitAPIRoute} from '@genkit-ai/next';
import {NextRequest} from 'next/server';
import '@/ai/dev';

const {POST} = getGenkitAPIRoute();

// This is a workaround for Next.js 14, which changes how route parameters
// are passed to the handler.
// See: https://github.com/firebase/genkit/issues/952
export async function POST_FIX(
  req: NextRequest,
  context: {params: {flow: string[]}}
) {
  return POST(req, context.params.flow);
}

export {POST_FIX as POST};

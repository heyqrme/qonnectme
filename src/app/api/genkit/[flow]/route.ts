
'use server';

import { NextRequest, NextResponse } from 'next/server';
import run from '@genkit-ai/next';
import { ZodError } from 'zod';

// IMPORTANT: Import all flows that you want to be exposed as API endpoints.
import '@/ai/flows/suggest-profile-theme';

// This is the standard Next.js 15 App Router API route handler.
async function postHandler(req: NextRequest, { params }: { params: { flow: string } }) {
  const flowId = params.flow;

  try {
    const body = await req.json();
    // The 'run' function from @genkit-ai/next will handle the actual flow execution.
    // We pass it the flowId and the request body.
    const result = await run(flowId, body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error processing request for flow ${flowId}:`, error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred.',
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

export const POST = postHandler;


'use server';

import { run } from '@genkit-ai/next';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import '@/ai/flows/suggest-profile-theme';

async function postHandler(req: NextRequest, { params }: { params: { flow: string } }) {
  const flowId = params.flow;

  try {
    const body = await req.json();
    return NextResponse.json(body);
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

export const POST = run(async (flowId, body) => {
  // The 'run' wrapper from @genkit-ai/next handles flow execution.
  // We don't need to call runFlow manually.
  // The body is already parsed from the request.
  return { flowId, body };
});

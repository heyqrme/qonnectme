
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { run } from '@genkit-ai/next';
import '@/ai/flows/suggest-profile-theme';

export async function POST(
  req: NextRequest,
  { params }: { params: { flow: string } }
) {
  const flowId = params.flow;
  const body = await req.json();

  try {
    const result = await run(flowId, body, {
      // Note: The `next` plugin is required for this to work.
      // We can also pass other options here, like `auth`.
    });
    return result;
  } catch (error: any) {
    console.error(`Error executing flow ${flowId}:`, error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred.',
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

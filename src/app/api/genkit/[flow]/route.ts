
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { run } from '@genkit-ai/next';
import '@/ai/flows/suggest-profile-theme';

export async function POST(
  req: NextRequest,
  { params }: { params: { flow: string } }
) {
  const flowId = params.flow;
  
  try {
    const body = await req.json();
    const result = await run(flowId, body);
    return result;
  } catch (error: any) {
    console.error(`Error executing flow ${flowId}:`, error);
    
    // Check if it's a Zod validation error for better client feedback
    if (error.name === 'ZodError') {
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

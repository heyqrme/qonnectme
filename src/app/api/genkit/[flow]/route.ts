'use server';

import { NextResponse } from 'next/server';
import { runFlow } from 'genkit';
import { ZodError } from 'zod';
import '@/ai/flows/suggest-profile-theme';

export async function POST(
  req: Request,
  { params }: { params: { flow: string } }
) {
  const flowId = params.flow;
  
  try {
    const body = await req.json();
    const result = await runFlow(flowId, body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error executing flow ${flowId}:`, error);
    
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

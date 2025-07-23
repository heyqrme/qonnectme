import { NextRequest, NextResponse } from 'next/server';
import { run } from '@genkit-ai/next';
import '@/ai/flows/suggest-profile-theme';

export async function POST(req: NextRequest, { params }: { params: { flow: string } }) {
  const flowId = params.flow;
  const body = await req.json();

  return run(flowId, body, {
    // Note: The `next` plugin is required for this to work.
    // We can also pass other options here, like `auth`.
  });
}

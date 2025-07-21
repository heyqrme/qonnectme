
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import type { Flow } from 'genkit';

// A map of available flows to prevent arbitrary code execution
const availableFlows: { [key: string]: () => Promise<any> } = {
  'suggest-profile-theme': () => import('@/ai/flows/suggest-profile-theme'),
};

export async function POST(
  req: NextRequest,
  { params }: { params: { flow: string } }
) {
  const { flow: flowName } = params;

  // Security: Ensure the requested flow is in our allowlist
  if (!availableFlows[flowName]) {
    return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
  }

  try {
    const body = await req.json();

    // Dynamically import the specific flow module
    const flowModule = await availableFlows[flowName]();

    // Convert kebab-case flow name (from URL) to camelCase function name
    const functionName = flowName.replace(/-(\w)/g, (_, c) => c.toUpperCase());

    const flowFunction = flowModule[functionName];

    if (typeof flowFunction !== 'function') {
      return NextResponse.json({ error: `Function ${functionName} not found in module` }, { status: 500 });
    }

    // Execute the flow with the request body
    const result = await flowFunction(body);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error(`Error executing flow ${flowName}:`, err);
    // Provide more specific feedback for validation errors
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred', details: err.message || String(err) }, { status: 500 });
  }
}

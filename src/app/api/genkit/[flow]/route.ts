
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { Flow } from 'genkit';

// A map of available flows to prevent arbitrary code execution
const availableFlows: { [key: string]: () => Promise<{ default: Flow<any, any, any> } | any> } = {
  'suggest-profile-theme': () => import('@/ai/flows/suggest-profile-theme'),
};

export async function POST(
  req: NextRequest,
  { params }: { params: { flow: string } }
) {
  const { flow: flowName } = params;

  if (!availableFlows[flowName]) {
    return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
  }

  try {
    const body = await req.json();

    // Dynamically import the flow function.
    // In this project, the exported function we want to call is the flow name itself in camelCase.
    // e.g., suggest-profile-theme flow is called with suggestProfileTheme function
    const flowModule = await availableFlows[flowName]();
    
    // Convert kebab-case flow name to camelCase for the function call
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
    // Try to parse Zod errors for better client-side feedback
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred', details: err.message || String(err) }, { status: 500 });
  }
}

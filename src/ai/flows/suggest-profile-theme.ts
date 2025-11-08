'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting personalized profile themes based on user uploaded music and media.
 *
 * - suggestProfileTheme - A function that suggests a profile theme.
 * - SuggestProfileThemeInput - The input type for the suggestProfileTheme function.
 * - SuggestProfileThemeOutput - The return type for the suggestProfileTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfileThemeInputSchema = z.object({
  musicTaste: z.string().describe('The user music taste, expressed as list of artists and genres.'),
  mediaDescription: z.string().describe('Description of the media content uploaded by the user (photos, videos).'),
});
export type SuggestProfileThemeInput = z.infer<typeof SuggestProfileThemeInputSchema>;

const SuggestProfileThemeOutputSchema = z.object({
  themeSuggestion: z.string().describe('The suggested theme for the user profile.'),
  styleSuggestion: z.string().describe('The suggested style for the user profile based on the theme.'),
  colorPalette: z.string().describe('A color palette matching the theme, as comma separated list of hex color codes.'),
});
export type SuggestProfileThemeOutput = z.infer<typeof SuggestProfileThemeOutputSchema>;

export async function suggestProfileTheme(input: SuggestProfileThemeInput): Promise<SuggestProfileThemeOutput> {
  return suggestProfileThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProfileThemePrompt',
  input: {schema: SuggestProfileThemeInputSchema},
  output: {schema: SuggestProfileThemeOutputSchema},
  prompt: `You are a profile theming expert with great taste.

Based on the user's music taste and media content, suggest a profile theme, a profile style and a color palette to match.

Music taste: {{{musicTaste}}}
Media description: {{{mediaDescription}}}`,
});

export const suggestProfileThemeFlow = ai.defineFlow(
  {
    name: 'suggestProfileThemeFlow',
    inputSchema: SuggestProfileThemeInputSchema,
    outputSchema: SuggestProfileThemeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

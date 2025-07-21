'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import type { SuggestProfileThemeOutput } from '@/ai/flows/suggest-profile-theme';
import { suggestProfileTheme } from '@/ai/flows/suggest-profile-theme';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  musicTaste: z.string().min(10, { message: 'Please describe your music taste in a bit more detail.' }),
  mediaDescription: z.string().min(10, { message: 'Please describe your photos/videos in a bit more detail.' }),
});

export function ThemeSuggester() {
  const [suggestion, setSuggestion] = useState<SuggestProfileThemeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      musicTaste: '',
      mediaDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const data = await suggestProfileTheme(values);
      setSuggestion(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-accent" />
          <CardTitle>AI-Powered Theme Suggestions</CardTitle>
        </div>
        <CardDescription>
          Can't decide on a vibe? Let our AI suggest a theme for your profile based on your tastes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="musicTaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Music Taste</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Taylor Swift, lofi hip hop, 80s rock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your photos/videos</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Photos from my trip to Japan, concert videos, pictures of my cat." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggest Theme
            </Button>
          </form>
        </Form>
      </CardContent>
      {suggestion && (
        <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
            <h3 className="font-semibold text-lg font-headline">Here's what we came up with:</h3>
            <div className="grid gap-4 w-full">
                <div>
                    <h4 className="font-medium">Theme</h4>
                    <p className="text-muted-foreground">{suggestion.themeSuggestion}</p>
                </div>
                <div>
                    <h4 className="font-medium">Style</h4>
                    <p className="text-muted-foreground">{suggestion.styleSuggestion}</p>
                </div>
                <div>
                    <h4 className="font-medium">Color Palette</h4>
                    <div className="flex gap-2 mt-1">
                        {suggestion.colorPalette.split(',').map((color) => (
                            <div key={color.trim()} className="h-10 w-10 rounded-md border" style={{ backgroundColor: color.trim() }} title={color.trim()} />
                        ))}
                    </div>
                </div>
            </div>
            <Button variant="secondary">Apply Theme (Coming Soon)</Button>
        </CardFooter>
      )}
    </Card>
  );
}

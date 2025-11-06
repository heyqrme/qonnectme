'use client';

import { AppHeader } from "@/components/app-header";
import { MusicPlayer } from "@/components/music-player";
import { useAuth } from "@/context/auth-context";
import { MusicProvider } from "@/context/music-context";
import React from "react";
import { Loader2 } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useAuth();
  
  // The AuthProvider now handles the main loading and redirection logic.
  // This layout just ensures that we don't render the app UI until the user is authenticated.
  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Loading your Qonnection...</p>
      </div>
    );
  }

  return (
    <MusicProvider>
        <div className="flex min-h-screen w-full flex-col bg-background">
            <AppHeader />
            {children}
        </div>
        <MusicPlayer />
    </MusicProvider>
  );
}

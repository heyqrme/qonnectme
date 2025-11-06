'use client';

import { AppHeader } from "@/components/app-header";
import { MusicPlayer } from "@/components/music-player";
import { useAuth } from "@/context/auth-context";
import { MusicProvider } from "@/context/music-context";
import React from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    // If auth state is done loading and there's no user, redirect to login.
    // This protects all pages that use this layout.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  // While checking for the user, show a full-screen loader.
  // Or if the user is not yet available after loading (before redirect kicks in).
  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Loading your Qonnection...</p>
      </div>
    );
  }

  // If user is authenticated, render the app.
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

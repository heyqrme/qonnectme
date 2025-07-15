
'use client';

import { AppHeader } from "@/components/app-header";
import { MusicPlayer } from "@/components/music-player";
import { useAuth } from "@/context/auth-context";
import { MusicProvider } from "@/context/music-context";
import { useRouter } from "next/navigation";
import React from "react";
import { AuthLayout } from "./auth-layout";
import { AuthForm } from "./auth-form";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);
  
  if (!user) {
    // Optionally, render a loading spinner or a blank page while redirecting
    return null; 
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

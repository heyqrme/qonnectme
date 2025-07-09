
'use client';

import { AppHeader } from "@/components/app-header";
import { MusicPlayer } from "@/components/music-player";
import { MusicProvider } from "@/context/music-context";

export function AppLayout({ children }: { children: React.ReactNode }) {
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

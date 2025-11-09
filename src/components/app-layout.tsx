'use client';

import { AppHeader } from "@/components/app-header";
import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  // The protection logic has been moved to AuthGate which wraps the entire application.
  // This layout is now only responsible for rendering the app's structure (header, content, music player).
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
        <AppHeader />
        {children}
    </div>
  );
}

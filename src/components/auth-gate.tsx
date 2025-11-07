'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const protectedRoutes = ['/profile', '/activity', '/friends', '/store', '/cart', '/admin', '/profile/edit'];
const publicRoutes = ['/login', '/signup', '/'];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      // Do nothing while loading, the UI will show a spinner
      return;
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/u/');

    if (user && (pathname === '/login' || pathname === '/signup')) {
      // If user is logged in and on a login/signup page, redirect to profile
      router.push('/profile');
    } else if (!user && isProtectedRoute) {
      // If user is not logged in and tries to access a protected route, redirect to login
      router.push('/login');
    }

  }, [isUserLoading, user, pathname, router]);

  // While checking for the user, show a full-screen loader.
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Loading your Qonnection...</p>
      </div>
    );
  }

  // If user is not authenticated and on a protected page, we show a loader while redirecting.
  // This prevents a brief flash of the unprotected page content.
  if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
     return (
      <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Redirecting to login...</p>
      </div>
    );
  }


  return <>{children}</>;
}

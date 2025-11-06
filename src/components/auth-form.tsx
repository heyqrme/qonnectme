'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { QrCode, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export function AuthForm() {
  const pathname = usePathname();
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = pathname === '/login';
  const title = isLogin ? 'Welcome Back!' : 'Create an Account';
  const description = isLogin ? 'Enter your credentials to access your account.' : 'Enter your details to get started.';
  const buttonText = isLogin ? 'Log In' : 'Sign Up';
  const linkText = isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In";
  const linkHref = isLogin ? '/signup' : '/login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(email, password);
    }
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="text-center">
        <QrCode className="mx-auto h-8 w-8 text-primary" />
        <CardTitle className="text-2xl font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                  Forgot your password?
                </Link>
              )}
            </div>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText}
          </Button>
          <Button variant="outline" className="w-full" disabled={isLoading}>
            Sign up with Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href={linkHref} className="underline" prefetch={false}>
            {linkText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';

export function AuthForm() {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/login';
  const title = isLogin ? 'Welcome Back!' : 'Create an Account';
  const description = isLogin ? 'Enter your credentials to access your account.' : 'Enter your details to get started.';
  const buttonText = isLogin ? 'Log In' : 'Sign Up';
  const linkText = isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In";
  const linkHref = isLogin ? '/signup' : '/login';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/profile');
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
            <Input id="email" type="email" placeholder="m@example.com" required />
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
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            {buttonText}
          </Button>
          <Button variant="outline" className="w-full">
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

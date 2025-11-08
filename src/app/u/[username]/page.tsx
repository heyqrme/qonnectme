'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QrCode, UserPlus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type PublicProfilePageProps = {
  params: { username: string };
};

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = params;
  const { toast } = useToast();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Avatar className="mx-auto h-24 w-24 mb-4">
            <AvatarImage
              src={`https://placehold.co/128x128.png`}
              alt={username}
              data-ai-hint="person avatar"
            />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold font-headline">
            {username}
          </CardTitle>
          <CardDescription>Public Qonnectme Profile</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={() =>
              toast({
                title: 'Friend Request Sent!',
                description: `Your request to connect with ${username} has been sent.`,
              })
            }
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add Friend
          </Button>
          <Button className="w-full" variant="secondary" asChild>
            <Link href={`/profile`}>
              <QrCode className="mr-2 h-4 w-4" /> View My QR
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

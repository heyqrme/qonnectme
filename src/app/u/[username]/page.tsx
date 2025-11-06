// src/app/u/[username]/page.tsx

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QrCode, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import type { NextPage } from "next";

// MOCK USER DATA - In a real app, this would be fetched from a database
const mockUsers: { [key: string]: any } = {
    "sarah": {
        name: "Sarah",
        username: "sarah",
        avatarUrl: "https://i.pravatar.cc/150?u=sarah",
        avatarHint: "A woman with brown hair and a friendly smile.",
        bio: "Just a girl who loves music, coffee, and coding. 🎶☕💻",
    },
    "jane": {
        name: "Jane Doe",
        username: "jane",
        avatarUrl: "https://i.pravatar.cc/150?u=jane",
        avatarHint: "A person with short, dark hair, wearing glasses.",
        bio: "Exploring the world one city at a time. Travel enthusiast and foodie.",
    },
    "alex": {
        name: "Alex",
        username: "alex",
        avatarUrl: "https://i.pravatar.cc/150?u=alex",
        avatarHint: "A person with blonde hair, looking thoughtfully into the distance.",
        bio: "Musician, artist, and dreamer. Creating sounds and visuals.",
    }
};

// Placeholder function to fetch user data
const fetchUserByUsername = async (username: string) => {
    console.log(`Fetching user: ${username}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockUsers[username.toLowerCase()] || null;
};

// Placeholder hook to check if the current user is registered
const useIsRegisteredUser = () => {
    // In a real app, this would check authentication status
    return true;
};

const PublicProfilePage: NextPage<{ params: { username: string } }> = ({ params }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const isRegisteredUser = useIsRegisteredUser();
    const { toast } = useToast();

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            const userData = await fetchUserByUsername(params.username);
            setUser(userData);
            setLoading(false);
        }
        if (params.username) {
            loadUser();
        }
    }, [params.username]);

    const handleSendRequest = () => {
        toast({
            title: "Request Sent!",
            description: `Your friend request to ${user.name} has been sent.`,
        });
    };

    if (loading) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-md text-center shadow-2xl animate-pulse">
                    <CardHeader>
                        <div className="h-32 w-32 rounded-full bg-muted mx-auto"></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
                           <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-12 bg-muted rounded w-full"></div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 text-center">
                <QrCode className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-4xl font-bold font-headline">User Not Found</h1>
                <p className="text-muted-foreground mt-2">
                    Oops! We couldn'''t find a profile for "@{params.username}".
                </p>
                <Button asChild className="mt-6">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md text-center shadow-2xl">
                <CardHeader>
                     <Avatar className="h-32 w-32 mx-auto border-4 border-background shadow-lg">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
                        <CardDescription className="text-primary">@{user.username}</CardDescription>
                    </div>
                    <p className="text-muted-foreground">
                        {user.bio}
                    </p>
                    {isRegisteredUser ? (
                        <Button onClick={handleSendRequest} size="lg" className="w-full">
                            <UserPlus className="mr-2" /> Send Friend Request
                        </Button>
                    ) : (
                        <Button asChild size="lg" className="w-full">
                            <Link href="/signup">
                                <UserPlus className="mr-2" /> Sign Up to Connect
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default PublicProfilePage;

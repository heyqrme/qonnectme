
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, UserPlus } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React from "react";

type PageProps = {
    params: { username: string };
};

// This is a placeholder for fetching user data and checking auth status
// In a real app, you would fetch this from your database and auth provider.
const fetchUserByUsername = async (username: string) => {
    const mockUsers: { [key: string]: any } = {
        janedoe: {
            name: "Jane Doe",
            username: "janedoe",
            avatarUrl: "https://placehold.co/128x128.png",
            avatarHint: "female portrait",
            bio: "Music lover, photographer, adventurer. Living life one day at a time.",
        },
        alexray: {
            name: "Alex Ray",
            username: "alexray",
            avatarUrl: "https://placehold.co/128x128.png",
            avatarHint: "male portrait",
            bio: "Rocking out and taking names. Find me at the next show.",
        },
    };
    return mockUsers[username] || null;
};

// This is a placeholder for checking if the current visitor is logged in.
const useIsRegisteredUser = () => {
    // In a real app, you would check for a valid session here.
    // For this prototype, we'll toggle it to simulate both states.
    // To test the "logged in" view, change this to `true`.
    const [isRegistered] = React.useState(false); 
    return isRegistered;
};


export default function PublicProfilePage({ params }: PageProps) {
    const [user, setUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const isRegisteredUser = useIsRegisteredUser();
    const { toast } = useToast();

    React.useEffect(() => {
        const loadUser = async () => {
            const userData = await fetchUserByUsername(params.username);
            setUser(userData);
            setLoading(false);
        }
        loadUser();
    }, [params.username]);

    const handleSendRequest = () => {
        toast({
            title: "Request Sent!",
            description: `Your friend request to ${user.name} has been sent.`,
        });
    };

    if (loading) {
        // You can add a loading skeleton here
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
                    Oops! We couldn't find a profile for "@{params.username}".
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

'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QrCode, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { useFirebase } from "@/firebase";


interface UserProfile {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    bio: string;
}

const PublicProfilePage: NextPage<{ params: { username: string } }> = ({ params }) => {
    const { firestore } = useFirebase();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUserByUsername = async (username: string) => {
            if (!firestore) return;
            setLoading(true);
            try {
                const usersRef = collection(firestore, "users");
                // In a real app, you might query by a unique 'username' field.
                // Here we simulate it by using the UID which is passed in the URL.
                const q = query(usersRef, where("id", "==", username), limit(1));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    setUser(userDoc.data() as UserProfile);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (params.username) {
            fetchUserByUsername(params.username);
        }
    }, [params.username, firestore]);

    const handleSendRequest = () => {
        if (!user) return;
        toast({
            title: "Request Sent!",
            description: `Your friend request to ${user.name} has been sent.`,
        });
    };

    if (loading) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-md text-center shadow-2xl">
                    <CardHeader>
                        <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <h1 className="text-2xl font-bold">Loading Profile...</h1>
                           <p className="text-muted-foreground">Please wait while we fetch the user's details.</p>
                        </div>
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
                    Oops! We couldn't find a profile for "@{params.username}". This could be because the user doesn't exist or the link is incorrect.
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
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
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
                    <Button onClick={handleSendRequest} size="lg" className="w-full">
                        <UserPlus className="mr-2" /> Send Friend Request
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default PublicProfilePage;

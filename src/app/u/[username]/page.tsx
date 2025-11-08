"use client"; // <-- Add this line at the top

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, UserPlus } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React from "react";

// Correct type definition for Next.js App Router page props
type PublicProfilePageProps = {
    params: { username: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

// **ADD THIS PART**
export default function PublicProfilePage({ params, searchParams }: PublicProfilePageProps) {
    const { username } = params;
    // You can use searchParams here if needed
    const { toast } = useToast();

    // Example of using the data and other components
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <Card className="w-[350px]">
                <CardHeader className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={`/api/avatar/${username}`} alt={username} />
                        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl font-bold">{username}</CardTitle>
                    <CardDescription>Public profile for {username}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button className="w-full" onClick={() => toast({ title: "Follow feature coming soon!" })}>
                        <UserPlus className="mr-2 h-4 w-4" /> Follow
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                        <Link href={`/qr/${username}`}>
                            <QrCode className="mr-2 h-4 w-4" /> View QR
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
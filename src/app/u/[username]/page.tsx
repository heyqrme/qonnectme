
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, UserPlus } from "lucide-react";
import Link from "next/link";

// This is a placeholder for fetching user data based on the username
// In a real app, you would fetch this from your database.
const fetchUserByUsername = async (username: string) => {
    // Mock data for demonstration
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


export default async function PublicProfilePage({ params }: { params: { username: string } }) {
    const user = await fetchUserByUsername(params.username);

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
                    <Button asChild size="lg" className="w-full">
                        <Link href="/signup">
                            <UserPlus className="mr-2" /> Sign Up to Connect
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}


import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, UserPlus, UserX } from "lucide-react";

export default function FriendsPage() {
    const friends = [
        { id: 1, name: "Alex Ray", username: "alexray", avatarUrl: "https://placehold.co/40x40.png" },
        { id: 2, name: "Jordan Lee", username: "jordanlee", avatarUrl: "https://placehold.co/40x40.png" },
        { id: 3, name: "Casey Kim", username: "caseykim", avatarUrl: "https://placehold.co/40x40.png" },
        { id: 4, name: "Taylor Smith", username: "taylorsmith", avatarUrl: "https://placehold.co/40x40.png" },
    ];
    const requests = [
        { id: 5, name: "Morgan Riley", username: "morganriley", avatarUrl: "https://placehold.co/40x40.png" },
        { id: 6, name: "Drew Chen", username: "drewchen", avatarUrl: "https://placehold.co/40x40.png" },
    ];

    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>My Network</CardTitle>
                        <CardDescription>Manage your friends and connection requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="requests">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
                                <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
                                <TabsTrigger value="add">Add Friend</TabsTrigger>
                            </TabsList>
                            <TabsContent value="friends" className="mt-4">
                                <div className="space-y-4">
                                    {friends.map(friend => (
                                        <div key={friend.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                                            <Avatar>
                                                <AvatarImage src={friend.avatarUrl} alt={friend.name} data-ai-hint="person avatar" />
                                                <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-1 flex-1">
                                                <p className="font-semibold">{friend.name}</p>
                                                <p className="text-sm text-muted-foreground">@{friend.username}</p>
                                            </div>
                                            <Button variant="outline" size="sm">View Profile</Button>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="requests" className="mt-4">
                                <div className="space-y-4">
                                    {requests.map(request => (
                                        <div key={request.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                                            <Avatar>
                                                <AvatarImage src={request.avatarUrl} alt={request.name} data-ai-hint="person face" />
                                                <AvatarFallback>{request.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-1 flex-1">
                                                <p className="font-semibold">{request.name}</p>
                                                <p className="text-sm text-muted-foreground">@{request.username}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="outline"><UserCheck className="h-4 w-4 text-accent" /></Button>
                                                <Button size="icon" variant="outline"><UserX className="h-4 w-4 text-muted-foreground" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                             <TabsContent value="add" className="mt-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="add-friend-input">Username or Email</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input id="add-friend-input" placeholder="e.g., alexray or alex@example.com" />
                                            <Button><UserPlus className="mr-2 h-4 w-4" /> Send Request</Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </AppLayout>
    );
}

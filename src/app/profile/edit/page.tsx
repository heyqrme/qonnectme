
'use client';

import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSuggester } from "@/components/theme-suggester";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import React, { useRef, useState } from "react";

export default function EditProfilePage() {
    const [avatarPreview, setAvatarPreview] = useState<string>("https://placehold.co/128x128.png");
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <div className="grid gap-6 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>Update your public profile information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
                                <div className="relative group">
                                    <Avatar className="h-32 w-32">
                                        <AvatarImage src={avatarPreview} alt="User Avatar" data-ai-hint="person avatar" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <button
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Camera className="h-8 w-8 text-white" />
                                        <span className="sr-only">Upload new avatar</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={avatarInputRef}
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                                <div className="space-y-4 flex-1 w-full">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue="Jane Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" defaultValue="janedoe" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" defaultValue="Music lover, photographer, adventurer. Living life one day at a time." />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>

                    <ThemeSuggester />

                </div>
            </main>
        </AppLayout>
    );
}

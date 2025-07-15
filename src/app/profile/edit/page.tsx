
'use client';

import { AppLayout } from "@/components/app-layout";
import { ThemeSuggester } from "@/components/theme-suggester";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditProfilePage() {
    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <div className="grid gap-6 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>Update your public profile information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="Jane Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue="janedoe" />
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

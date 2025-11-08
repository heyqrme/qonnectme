'use client';

import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { useFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function EditProfilePage() {
    const { user } = useAuth();
    const { storage, firestore } = useFirebase();
    const { toast } = useToast();
    const router = useRouter();

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.photoURL || "https://placehold.co/128x128.png");
    const [name, setName] = useState(user?.displayName || '');
    const [username, setUsername] = useState(user?.email?.split('@')[0] || '');
    const [bio, setBio] = useState(''); // Fetch this from Firestore in a useEffect if needed
    const [isSaving, setIsSaving] = useState(false);

    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveChanges = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not authenticated', description: 'You must be logged in to save changes.' });
            return;
        }

        setIsSaving(true);
        try {
            let newAvatarUrl = user.photoURL;

            // 1. Upload new avatar if one was selected
            if (avatarFile) {
                const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
                const uploadTask = await uploadBytes(storageRef, avatarFile);
                newAvatarUrl = await getDownloadURL(uploadTask.ref);
            }
            
            // 2. Update Firestore document
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, {
                name: name,
                username: username,
                bio: bio,
                avatarUrl: newAvatarUrl
            });

            toast({ title: 'Profile Updated', description: 'Your changes have been saved successfully.' });
            router.push('/profile');

        } catch (error: any) {
            console.error("Failed to save profile:", error);
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: error.message || 'An unexpected error occurred.'
            });
        } finally {
            setIsSaving(false);
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
                                        <AvatarImage src={avatarPreview || undefined} alt="User Avatar" data-ai-hint="person avatar" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <button
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        disabled={isSaving}
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
                                        disabled={isSaving}
                                    />
                                </div>
                                <div className="space-y-4 flex-1 w-full">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isSaving}/>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" placeholder="Tell us a little about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} disabled={isSaving} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>Cancel</Button>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </div>

                </div>
            </main>
        </AppLayout>
    );
}
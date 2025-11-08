''''use client';

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
import { updateProfile } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";

export default function EditProfilePage() {
    const { user, reloadUser } = useAuth();
    const { storage, firestore } = useFirebase();
    const { toast } = useToast();
    const router = useRouter();

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [initialUsername, setInitialUsername] = useState('');


    useEffect(() => {
        if (user) {
            const initialUserUsername = user.email?.split('@')[0] || '';
            setAvatarPreview(user.photoURL || `https://placehold.co/128x128.png`);
            setName(user.displayName || '');
            
            const userDocRef = doc(firestore, "users", user.uid);
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUsername(data.username || initialUserUsername);
                    setInitialUsername(data.username || initialUserUsername);
                    setBio(data.bio || '');
                } else {
                    setUsername(initialUserUsername);
                    setInitialUsername(initialUserUsername);
                }
            });
        }
    }, [user, firestore]);

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
            toast({ variant: 'destructive', title: 'Not authenticated' });
            return;
        }

        setIsSaving(true);
        let success = false;

        try {
            if (username !== initialUsername) {
                const usernameDocRef = doc(firestore, "usernames", username);
                const usernameDoc = await getDoc(usernameDocRef);
                if (usernameDoc.exists()) {
                    toast({ variant: "destructive", title: "Username Taken" });
                    throw new Error("Username taken");
                }
            }

            let newAvatarUrl = user.photoURL;

            if (avatarFile) {
                const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
                await uploadBytes(storageRef, avatarFile);
                newAvatarUrl = await getDownloadURL(storageRef);
            }
            
            await updateProfile(user, {
                displayName: name,
                photoURL: newAvatarUrl
            });

            const batch = writeBatch(firestore);
            const userDocRef = doc(firestore, 'users', user.uid);
            const profileUrl = `${window.location.origin}/${username}`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}`;
            
            batch.set(userDocRef, {
                id: user.uid,
                name: name,
                username: username,
                bio: bio,
                avatarUrl: newAvatarUrl,
                profileUrl: profileUrl,
                qrCodeUrl: qrCodeUrl
            }, { merge: true });

            if (username !== initialUsername) {
                const newUsernameDocRef = doc(firestore, "usernames", username);
                batch.set(newUsernameDocRef, { userId: user.uid });
                const oldUsernameDocRef = doc(firestore, "usernames", initialUsername);
                batch.delete(oldUsernameDocRef);
            }
            
            await batch.commit();

            await reloadUser();
            toast({ title: 'Profile Saved!' });
            success = true;

        } catch (error: any) {
            console.error("SAVE_PROFILE_ERROR:", error);
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: `Error: ${error.message} Code: ${error.code || 'N/A'}`,
                duration: 10000, // Show toast for 10 seconds
            });
        } finally {
            setIsSaving(false);
            if (success) {
                router.push('/profile');
            }
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
                                        <AvatarImage src={avatarPreview || undefined} alt="User Avatar" />
                                        <AvatarFallback>{name?.slice(0,2) || '...'}</AvatarFallback>
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
'''
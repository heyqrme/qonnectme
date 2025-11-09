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
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, writeBatch, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";

export default function EditProfilePage() {
    const { user, reloadUser } = useAuth();
    const { storage, firestore } = useFirebase();
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [initialUsername, setInitialUsername] = useState('');

    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const initialUserUsername = user.email?.split('@')[0] || '';
                setName(user.displayName || '');
                setAvatarPreview(user.photoURL);

                // Corrected path to point to the 'profile' subcollection
                const userDocRef = doc(firestore, "users", user.uid, "profile", "main");
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUsername(data.username || initialUserUsername);
                    setInitialUsername(data.username || initialUserUsername);
                    setBio(data.bio || '');
                } else {
                    setUsername(initialUserUsername);
                    setInitialUsername(initialUserUsername);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                toast({ variant: "destructive", title: "Failed to load profile", description: "There was an error loading your profile data." });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [user, firestore, toast]);

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
    
        try {
            // 1. Check for username uniqueness if it has changed
            if (username !== initialUsername) {
                // This query is inefficient at scale, but okay for this app.
                // A better approach would be a 'usernames' collection for lookups.
                const usersRef = collection(firestore, "users");
                const q = query(usersRef, where("username", "==", username));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    toast({ variant: "destructive", title: "Username Taken", description: "This username is already in use. Please choose another." });
                    setIsSaving(false);
                    return;
                }
            }
    
            // 2. Upload avatar if a new one is selected
            let newAvatarUrl = user.photoURL;
            if (avatarFile) {
                const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
                const uploadTask = await uploadBytes(storageRef, avatarFile);
                newAvatarUrl = await getDownloadURL(uploadTask.ref);
            }
    
            // 3. Update Firebase Auth Profile
            await updateProfile(user, { displayName: name, photoURL: newAvatarUrl });
    
            // 4. Prepare Firestore update for the subcollection document
            const profileUrl = `${window.location.origin}/u/${username}`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}`;
            
            // Corrected path to point to the 'profile' subcollection
            const userDocRef = doc(firestore, 'users', user.uid, 'profile', 'main');
            const userDocData = {
                id: user.uid,
                name: name,
                username: username,
                bio: bio,
                avatarUrl: newAvatarUrl,
                profileUrl: profileUrl,
                qrCodeUrl: qrCodeUrl,
            };
    
            // Use a non-blocking Firestore update with proper error handling
            setDoc(userDocRef, userDocData, { merge: true }).catch(error => {
                const permissionError = new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'update',
                    requestResourceData: userDocData,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
    
            // 5. Reload user data in the app and navigate
            await reloadUser();
            toast({ title: 'Profile Saved!' });
            router.push('/profile');
    
        } catch (error: any) {
            console.error("SAVE_PROFILE_ERROR:", error);
            // This will catch errors from auth updates, storage uploads, or username checks
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: `An unexpected error occurred: ${error.message}`,
                duration: 9000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center flex-1">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </AppLayout>
        )
    }

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
                                        <AvatarFallback>{name?.slice(0, 2) || '...'}</AvatarFallback>
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
                                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isSaving} />
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

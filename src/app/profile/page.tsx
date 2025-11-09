'use client';

import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useFirebase } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MusicProvider } from '@/context/music-context';
import { MusicPlayer } from '@/components/music-player';

interface ProfileData {
    name?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    qrCodeUrl?: string; // Expect this from the database
}

function ProfilePage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);

    useEffect(() => {
        if (user) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setProfileData(doc.data() as ProfileData);
                } else {
                    // Handle case where user document doesn't exist yet
                    // This could be where you set some default data or guide the user to edit their profile
                    setProfileData({
                        name: user.displayName || 'No name set',
                        username: user.email?.split('@')[0] || 'username',
                        bio: 'No bio set.',
                        avatarUrl: user.photoURL || undefined,
                        qrCodeUrl: undefined, // No QR code until profile is saved
                    });
                }
            });

            return () => unsubscribe();
        }
    }, [user, firestore]);

    if (!profileData) {
        return <div>Loading profile...</div>; // Or a proper skeleton loader
    }

    const { name, username, bio, avatarUrl, qrCodeUrl } = profileData;

    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <div className="grid gap-6 max-w-2xl mx-auto">
                    <Card>
                        <CardHeader className="flex-row items-center gap-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={avatarUrl} alt="User Avatar" />
                                <AvatarFallback>{name?.slice(0, 2) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <CardTitle className="text-2xl">{name}</CardTitle>
                                <CardDescription>@{username}</CardDescription>
                            </div>
                            <Link href="/profile/edit" className="ml-auto">
                                <Button variant="outline" size="icon">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit Profile</span>
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Bio</h3>
                                    <p className="text-muted-foreground">{bio}</p>
                                </div>

                                {qrCodeUrl && (
                                    <div className="mt-6 flex flex-col items-center">
                                        <Image src={qrCodeUrl} alt="QR Code" width={150} height={150} />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Scan this to view your profile
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </AppLayout>
    );
}


export default function ProfilePageWrapper() {
    return (
        <MusicProvider>
            <ProfilePage />
            <MusicPlayer />
        </MusicProvider>
    );
}

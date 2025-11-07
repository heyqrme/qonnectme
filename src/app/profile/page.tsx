'use client';

import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMusic } from "@/context/music-context";
import { useToast } from "@/hooks/use-toast";
import { Edit, Music, Video, Image as ImageIcon, Upload, Copy, Download, PauseCircle, PlayCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useDoc, useFirebase } from "@/firebase";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";
import { doc } from "firebase/firestore";
import type { User } from 'firebase/auth';

interface UserProfile {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    bio: string;
    qrCodeUrl: string;
    profileUrl: string;
    photos: { id: number; url: string; hint: string }[];
    videos: { id: number; url: string; hint: string }[];
}

function ProfileContent({ user }: { user: User }) {
    const { songs, handleUploadSong, handlePlayPause, currentSongIndex, isPlaying } = useMusic();
    const [newSongFile, setNewSongFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { firestore } = useFirebase();

    const userProfileRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    const { data: userProfile, isLoading } = useDoc<UserProfile>(userProfileRef);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setNewSongFile(event.target.files[0]);
        }
    };

    const onUpload = () => {
        if (newSongFile) {
            handleUploadSong(newSongFile);
            setNewSongFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    
    const handleCopyLink = () => {
        if (!userProfile) return;
        navigator.clipboard.writeText(userProfile.profileUrl);
        toast({
            title: "Copied to clipboard!",
            description: "Your profile link has been copied.",
        });
    };

    const handleDownloadQR = async () => {
        if (!userProfile) return;
        try {
            const response = await fetch(userProfile.qrCodeUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${userProfile.username}-qonnectme-qr.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast({
                title: "Download Started!",
                description: "Your QR code is being downloaded.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Download Failed",
                description: "Could not download the QR code image.",
            });
        }
    };

    if (isLoading || !userProfile) {
        return (
            <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </main>
        )
    }

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">
            <div className="w-full">
                <Card>
                    <CardHeader className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">
                            {/* QR Code Section */}
                            <div className="flex flex-col items-center justify-center gap-2 h-full">
                                <div className="p-2 bg-white rounded-lg shadow-md">
                                    {userProfile.qrCodeUrl ? (
                                        <Image src={userProfile.qrCodeUrl} alt={`${userProfile.name}'s QR Code`} width={128} height={128} />
                                    ) : (
                                        <div className="w-[128px] h-[128px] bg-gray-200 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 mt-2">
                                    <Button variant="ghost" size="sm" onClick={handleCopyLink} className="text-muted-foreground">
                                        <Copy className="mr-2 h-3 w-3" />
                                        Copy Link
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleDownloadQR} className="text-muted-foreground">
                                        <Download className="mr-2 h-3 w-3" />
                                        Download
                                    </Button>
                                </div>
                            </div>

                            {/* Avatar Section */}
                            <div className="flex flex-col items-center order-first md:order-none">
                                <Avatar className="h-36 w-36">
                                    <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="female portrait" />
                                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            
                            {/* User Info Section */}
                            <div className="flex flex-col items-center md:items-start gap-2">
                                 <div className="space-y-1 text-center md:text-left">
                                    <h1 className="text-2xl font-bold text-card-foreground font-headline">{userProfile.name}</h1>
                                    <p className="text-sm text-muted-foreground">@{userProfile.username}</p>
                                </div>
                                <p className="text-sm text-muted-foreground max-w-xs">{userProfile.bio}</p>
                                <Button asChild variant="outline" size="sm" className="mt-2">
                                    <Link href="/profile/edit"><Edit className="mr-2 h-4 w-4"/> Edit Profile</Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Tabs defaultValue="photos">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                                <TabsTrigger value="photos"><ImageIcon className="mr-2 h-4 w-4" /> Photos</TabsTrigger>
                                <TabsTrigger value="videos"><Video className="mr-2 h-4 w-4" /> Videos</TabsTrigger>
                                <TabsTrigger value="music"><Music className="mr-2 h-4 w-4" /> Music</TabsTrigger>
                                <TabsTrigger value="posts"><ImageIcon className="mr-2 h-4 w-4" /> Posts</TabsTrigger>
                            </TabsList>
                            <TabsContent value="photos" className="mt-4">
                                <div className="text-center text-muted-foreground py-8">
                                    Photo gallery coming soon!
                                </div>
                            </TabsContent>
                            <TabsContent value="videos" className="mt-4">
                                <div className="text-center text-muted-foreground py-8">
                                    Video gallery coming soon!
                                </div>
                            </TabsContent>
                            <TabsContent value="music" className="mt-4">
                                <div className="grid gap-6">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4 font-headline">My Vibe</h3>
                                        <p className="text-muted-foreground mb-4">The tracks I've uploaded. Click to play!</p>
                                        <div className="space-y-2">
                                            {songs.map((song, index) => (
                                                <div key={song.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                                                    <button onClick={() => handlePlayPause(index)} className="text-accent">
                                                        {isPlaying && currentSongIndex === index ? <PauseCircle className="h-5 w-5 animate-pulse" /> : <PlayCircle className="h-5 w-5" />}
                                                    </button>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{song.title}</p>
                                                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {songs.length === 0 && (
                                                <p className="text-muted-foreground text-center py-4">Your playlist is empty. Upload a song to get started!</p>
                                            )}
                                        </div>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5"/> Upload Music</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <Label htmlFor="music-upload">Upload a new song file</Label>
                                                <div className="flex gap-2">
                                                <Input 
                                                    id="music-upload" 
                                                    type="file" 
                                                    accept="audio/*" 
                                                    ref={fileInputRef}
                                                    onChange={onFileChange}
                                                />
                                                <Button onClick={onUpload} disabled={!newSongFile}>
                                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                                </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                </div>
                            </TabsContent>
                            <TabsContent value="posts" className="mt-4">
                                <div className="text-center text-muted-foreground py-8">
                                    Posts coming soon!
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { user, isUserLoading } = useAuth();
    
    if (isUserLoading) {
        return (
            <AppLayout>
                <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
            </AppLayout>
        )
    }

    if (!user) {
        // This case should ideally be handled by AuthGate, but as a fallback:
        return (
             <AppLayout>
                <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                    <p>Please log in to view your profile.</p>
                </main>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <main className="flex-1 p-4 md:p-8">
                <ProfileContent user={user} />
            </main>
        </AppLayout>
    );
}

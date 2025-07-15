
'use client';

import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMusic } from "@/context/music-context";
import { useToast } from "@/hooks/use-toast";
import { Edit, Music, QrCode, Video, Image as ImageIcon, Upload, Camera, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";

function ProfileContent() {
    const { songs, handleUploadSong, handlePlayPause, currentSongIndex, isPlaying } = useMusic();
    const [newSongFile, setNewSongFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const user = {
        name: "Jane Doe",
        username: "janedoe",
        avatarUrl: "https://placehold.co/128x128.png",
        bio: "Music lover, photographer, adventurer. Living life one day at a time. Exploring the world and connecting with amazing people.",
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=https://qonnect.me/janedoe&bgcolor=1f1f1f&color=A080DD&qzone=1`,
        profileUrl: "https://qonnect.me/janedoe",
        photos: Array(9).fill(0).map((_, i) => ({ id: i, url: "https://placehold.co/400x400.png", hint: "portrait nature" })),
        videos: Array(3).fill(0).map((_, i) => ({ id: i, url: "https://placehold.co/400x400.png", hint: "travel video" })),
    };
    
    const [avatarPreview, setAvatarPreview] = useState<string>(user.avatarUrl);

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
    
    const handleCopyLink = () => {
        navigator.clipboard.writeText(user.profileUrl);
        toast({
            title: "Copied to clipboard!",
            description: "Your profile link has been copied.",
        });
    };

    return (
        <main className="flex-1 p-4 md:p-8">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">
                <div className="w-full">
                    <Card>
                        <CardHeader className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">
                                {/* QR Code Section */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-2 bg-white rounded-lg shadow-md">
                                        <Image src={user.qrCodeUrl} alt={`${user.name}'s QR Code`} width={128} height={128} />
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={handleCopyLink} className="text-muted-foreground">
                                        <Copy className="mr-2 h-3 w-3" />
                                        Copy Link
                                    </Button>
                                </div>

                                {/* Avatar Section */}
                                <div className="flex flex-col items-center order-first md:order-none">
                                    <div className="relative group">
                                        <Avatar className="h-32 w-32 border-4 border-background">
                                            <AvatarImage src={avatarPreview} alt={user.name} data-ai-hint="female portrait" />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                                </div>
                                
                                {/* User Info Section */}
                                <div className="flex flex-col items-center md:items-start gap-2">
                                     <div className="space-y-1 text-center md:text-left">
                                        <h1 className="text-2xl font-bold text-card-foreground font-headline">{user.name}</h1>
                                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground max-w-xs">{user.bio}</p>
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
                                    <TabsTrigger value="qrcode"><QrCode className="mr-2 h-4 w-4" /> QR Code</TabsTrigger>
                                </TabsList>
                                <TabsContent value="photos" className="mt-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {user.photos.map(photo => (
                                            <div key={photo.id} className="aspect-square overflow-hidden rounded-lg group">
                                                <Image src={photo.url} alt="User photo" width={400} height={400} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" data-ai-hint={photo.hint} />
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="videos" className="mt-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {user.videos.map(video => (
                                            <div key={video.id} className="aspect-square overflow-hidden rounded-lg group relative">
                                                <Image src={video.url} alt="User video" width={400} height={400} className="h-full w-full object-cover" data-ai-hint={video.hint} />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Video className="h-12 w-12 text-white" />
                                                </div>
                                            </div>
                                        ))}
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
                                                            {isPlaying && currentSongIndex === index ? <Music className="h-5 w-5 animate-pulse" /> : <Music className="h-5 w-5" />}
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
                                <TabsContent value="qrcode" className="mt-4 flex flex-col items-center justify-center text-center gap-4 py-8">
                                    <div className="p-4 bg-white rounded-lg shadow-lg">
                                        <Image src={user.qrCodeUrl} alt="Your QR Code" width={150} height={150} />
                                    </div>
                                    <h3 className="font-semibold">Your Unique Qonnectme Code</h3>
                                    <p className="text-muted-foreground max-w-xs">Share this with friends to connect instantly. You can also buy merchandise with your code in our store!</p>
                                    <Button onClick={handleCopyLink}>Share Code</Button>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default function ProfilePage() {
    return (
        <AppLayout>
            <ProfileContent />
        </AppLayout>
    );
}

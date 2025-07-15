
'use client';

import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMusic } from "@/context/music-context";
import { Edit, Music, QrCode, Video, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";

function ProfileContent() {
    const { songs, handleUploadSong, handlePlayPause, currentSongIndex, isPlaying } = useMusic();
    const [newSongFile, setNewSongFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const user = {
        name: "Jane Doe",
        username: "janedoe",
        avatarUrl: "https://placehold.co/128x128.png",
        bio: "Music lover, photographer, adventurer. Living life one day at a time. Exploring the world and connecting with amazing people. Let's create something beautiful together.",
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://qonnect.me/janedoe&bgcolor=1f1f1f&color=A080DD&qzone=1`,
        photos: Array(9).fill(0).map((_, i) => ({ id: i, url: "https://placehold.co/400x400.png", hint: "portrait nature" })),
        videos: Array(3).fill(0).map((_, i) => ({ id: i, url: "https://placehold.co/400x400.png", hint: "travel video" })),
    };

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

    return (
        <main className="flex-1 p-4 md:p-8">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">
                <div className="w-full">
                    <Card>
                        <CardHeader className="relative h-48 bg-secondary rounded-t-lg flex items-end p-4">
                            <Image src="https://placehold.co/1200x400.png" alt="Cover photo" layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint="abstract purple" />
                            <div className="relative flex items-end gap-4">
                                <Avatar className="h-24 w-24 border-4 border-background">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="female portrait" />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold text-card-foreground font-headline">{user.name}</h1>
                                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                            <p className="max-w-prose text-muted-foreground flex-1">{user.bio}</p>
                            <Button asChild variant="outline" size="sm">
                                    <Link href="/profile/edit"><Edit className="mr-2 h-4 w-4"/> Edit Profile</Link>
                            </Button>
                            </div>

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
                                    <Button>Share Code</Button>
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

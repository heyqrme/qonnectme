'use client';

import { AppHeader } from "@/components/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Music, QrCode, Video, Image as ImageIcon, PlayCircle, PauseCircle, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const user = {
        name: "Jane Doe",
        username: "janedoe",
        avatarUrl: "https://placehold.co/128x128.png",
        bio: "Music lover, photographer, adventurer. Living life one day at a time. Exploring the world and connecting with amazing people. Let's create something beautiful together.",
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://qonnect.me/janedoe&bgcolor=1f1f1f&color=A080DD&qzone=1`,
        music: ["Lo-fi beats", "Indie Pop", "Chillwave", "Ambient", "Future Funk"],
        songs: [
            { id: 1, title: "Groovy Morning", artist: "The Chillhop Collective", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
            { id: 2, title: "Sunset Vibes", artist: "Indie Pop Creators", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
            { id: 3, title: "Midnight Stroll", artist: "Synthwave Dreams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
        ],
        photos: Array(9).fill(0).map((_, i) => ({ id: i, url: "https://placehold.co/400x400.png", hint: "portrait nature" })),
        videos: Array(3).fill(0).map((_, i) => ({ id: i, url: "https://placehold.co/400x400.png", hint: "travel video" })),
    };

    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = (index: number) => {
        if (currentSongIndex === index) {
            if (isPlaying) {
                audioRef.current?.pause();
            } else {
                audioRef.current?.play();
            }
        } else {
            setCurrentSongIndex(index);
        }
    };

    const handleNext = () => {
        if (user.songs && currentSongIndex !== null) {
            const nextIndex = (currentSongIndex + 1) % user.songs.length;
            setCurrentSongIndex(nextIndex);
        }
    };

    const handlePrev = () => {
         if (user.songs && currentSongIndex !== null) {
            const prevIndex = (currentSongIndex - 1 + user.songs.length) % user.songs.length;
            setCurrentSongIndex(prevIndex);
        }
    };

    useEffect(() => {
        if (currentSongIndex !== null && audioRef.current) {
            audioRef.current.src = user.songs[currentSongIndex].url;
            audioRef.current.play().catch(e => {
                console.error("Audio play failed:", e);
                setIsPlaying(false);
            });
        }
    }, [currentSongIndex, user.songs]);


    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <AppHeader />
            <main className="flex-1 p-4 md:p-8">
                <Card className="w-full max-w-5xl mx-auto">
                    <CardHeader className="relative h-48 bg-secondary rounded-t-lg flex items-end p-4">
                         <Image src="https://placehold.co/1200x400.png" alt="Cover photo" fill objectFit="cover" className="rounded-t-lg" data-ai-hint="abstract purple" />
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
                        <div className="flex justify-between items-start flex-wrap gap-4">
                           <p className="max-w-prose text-muted-foreground flex-1">{user.bio}</p>
                           <Button asChild variant="outline" size="sm">
                                <Link href="/profile/edit"><Edit className="mr-2 h-4 w-4"/> Edit Profile</Link>
                           </Button>
                        </div>

                        <Tabs defaultValue="photos" className="mt-6">
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
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4 font-headline">My Vibe</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {user.music.map(genre => <Badge key={genre} variant="outline" className="text-md py-2 px-4 border-accent text-accent bg-accent/10">{genre}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4 font-headline">My Playlist</h3>
                                        <div className="rounded-lg border bg-card-foreground/5">
                                            <div className="p-4 bg-secondary/30 flex items-center justify-between rounded-t-lg">
                                                <div>
                                                    <p className="font-semibold">{currentSongIndex !== null ? user.songs[currentSongIndex].title : 'Select a song'}</p>
                                                    <p className="text-sm text-muted-foreground">{currentSongIndex !== null ? user.songs[currentSongIndex].artist : '...'}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentSongIndex === null}>
                                                        <SkipBack className="h-5 w-5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => currentSongIndex !== null && handlePlayPause(currentSongIndex)} disabled={currentSongIndex === null} className="w-10 h-10">
                                                        {isPlaying ? <PauseCircle className="h-8 w-8 text-accent" /> : <PlayCircle className="h-8 w-8 text-accent" />}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentSongIndex === null}>
                                                        <SkipForward className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                                                {user.songs.map((song, index) => (
                                                    <button key={song.id} onClick={() => handlePlayPause(index)} className={cn("w-full text-left p-2 rounded-md hover:bg-secondary flex items-center gap-4 transition-colors", currentSongIndex === index && 'bg-secondary')}>
                                                        {currentSongIndex === index && isPlaying ? <PauseCircle className="h-5 w-5 text-accent" /> : <PlayCircle className="h-5 w-5 text-muted-foreground/50" />}
                                                        <div>
                                                            <p className="font-medium">{song.title}</p>
                                                            <p className="text-sm text-muted-foreground">{song.artist}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <audio ref={audioRef} onEnded={handleNext} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                                    </div>
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
            </main>
        </div>
    );
}
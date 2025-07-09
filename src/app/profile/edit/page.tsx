'use client';

import { AppHeader } from "@/components/app-header";
import { ThemeSuggester } from "@/components/theme-suggester";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Upload } from "lucide-react";
import { useState, useRef } from "react";

const initialSongs = [
    { id: 1, title: "Groovy Morning", artist: "The Chillhop Collective" },
    { id: 2, title: "Sunset Vibes", artist: "Indie Pop Creators" },
    { id: 3, title: "Midnight Stroll", artist: "Synthwave Dreams" },
];

export default function EditProfilePage() {
    const [songs, setSongs] = useState(initialSongs);
    const [newSongFile, setNewSongFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDeleteSong = (id: number) => {
        setSongs(songs.filter(song => song.id !== id));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setNewSongFile(event.target.files[0]);
        }
    };

    const handleUploadSong = () => {
        if (newSongFile) {
            const newSong = {
                id: songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1,
                title: newSongFile.name.replace(/\.[^/.]+$/, ""),
                artist: "Uploaded Artist",
            };
            setSongs([...songs, newSong]);
            setNewSongFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };


    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <AppHeader />
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Music</CardTitle>
                            <CardDescription>Upload songs to feature on your profile playlist.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Current Playlist</Label>
                                <div className="border rounded-lg">
                                    <div className="p-2 space-y-2">
                                    {songs.map((song) => (
                                        <div key={song.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary">
                                            <div>
                                                <p className="text-sm font-medium">{song.title}</p>
                                                <p className="text-xs text-muted-foreground">{song.artist}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDeleteSong(song.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="music-upload">Upload New Song</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="music-upload" 
                                        type="file" 
                                        accept="audio/*" 
                                        className="flex-grow"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <Button onClick={handleUploadSong} disabled={!newSongFile}>
                                        <Upload className="mr-2 h-4 w-4" /> Upload
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">.mp3, .wav, .ogg supported. Max 10MB.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <ThemeSuggester />
                     <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

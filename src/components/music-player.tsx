
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, PauseCircle, SkipBack, SkipForward, Music, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMusic } from "@/context/music-context";

export function MusicPlayer() {
    const {
        songs,
        currentSongIndex,
        isPlaying,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleDeleteSong,
    } = useMusic();
    
    const [isExpanded, setIsExpanded] = useState(false);
    
    const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

    if (songs.length === 0) {
        return null;
    }

    return (
        <>
            <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-24 right-4 z-50 w-80"
                >
                <Card className="shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between p-3">
                        <CardTitle className="text-base font-headline">My Playlist</CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(false)}>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="border rounded-lg mt-1 max-h-48 overflow-y-auto">
                            <div className="p-1 space-y-1">
                            {songs.length > 0 ? songs.map((song, index) => (
                                <div key={song.id} className={cn("flex items-center justify-between p-1.5 rounded-md hover:bg-secondary", currentSongIndex === index && 'bg-secondary')}>
                                    <button onClick={() => handlePlayPause(index)} className="text-left flex-1 group overflow-hidden">
                                        <p className="text-xs font-medium truncate flex items-center gap-2">
                                            {currentSongIndex === index && isPlaying ? <PauseCircle className="h-3 w-3 text-accent"/> : <PlayCircle className="h-3 w-3 text-muted-foreground group-hover:text-accent"/>}
                                            {song.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate pl-5">{song.artist}</p>
                                    </button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteSong(song.id)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            )) : <p className="text-xs text-muted-foreground p-4 text-center">No songs yet. Upload one!</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </motion.div>
            )}
            </AnimatePresence>

            <Card className="fixed bottom-4 right-4 z-50 shadow-2xl w-80">
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                         <Music className="h-5 w-5 text-accent flex-shrink-0" />
                        <div className="flex-1 text-left overflow-hidden">
                            <p className="font-semibold text-sm truncate">{currentSong ? currentSong.title : 'Select a song'}</p>
                            <p className="text-xs text-muted-foreground truncate">{currentSong ? currentSong.artist : '...'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrev} disabled={currentSongIndex === null}>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handlePlayPause()} disabled={currentSongIndex === null}>
                            {isPlaying ? <PauseCircle className="h-6 w-6 text-accent" /> : <PlayCircle className="h-6 w-6 text-accent" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext} disabled={currentSongIndex === null}>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                           {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    );
}

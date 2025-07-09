
'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface Song {
    id: number;
    title: string;
    artist: string;
    url: string;
}

interface MusicContextType {
    songs: Song[];
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
    currentSongIndex: number | null;
    setCurrentSongIndex: React.Dispatch<React.SetStateAction<number | null>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    handlePlayPause: (index?: number) => void;
    handleNext: () => void;
    handlePrev: () => void;
    handleDeleteSong: (id: number) => void;
    handleUploadSong: (file: File) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const initialSongs: Song[] = [
    { id: 1, title: "Groovy Morning", artist: "The Chillhop Collective", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, title: "Sunset Vibes", artist: "Indie Pop Creators", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, title: "Midnight Stroll", artist: "Synthwave Dreams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [songs, setSongs] = useState<Song[]>(initialSongs);
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handlePlayPause = (index?: number) => {
        const targetIndex = index ?? currentSongIndex;
        if (targetIndex === null) return;

        if (currentSongIndex === targetIndex && audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        } else {
            setCurrentSongIndex(targetIndex);
        }
    };

    const handleNext = () => {
        if (songs.length > 0 && currentSongIndex !== null) {
            const nextIndex = (currentSongIndex + 1) % songs.length;
            setCurrentSongIndex(nextIndex);
        }
    };

    const handlePrev = () => {
        if (songs.length > 0 && currentSongIndex !== null) {
            const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            setCurrentSongIndex(prevIndex);
        }
    };

    const handleDeleteSong = (id: number) => {
        const newSongs = songs.filter(song => song.id !== id);
        setSongs(newSongs);

        if (currentSongIndex !== null && songs[currentSongIndex]?.id === id) {
            if (newSongs.length === 0) {
                setCurrentSongIndex(null);
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = "";
                }
            } else {
                // If the deleted song was the current one, play the next one
                 setCurrentSongIndex(currentSongIndex % newSongs.length);
            }
        }
    };

    const handleUploadSong = (file: File) => {
        const newSong: Song = {
            id: songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Uploaded Artist",
            url: URL.createObjectURL(file)
        };
        setSongs(prevSongs => [...prevSongs, newSong]);
    };

    useEffect(() => {
        if (currentSongIndex !== null && audioRef.current) {
            const song = songs[currentSongIndex];
            if (song) {
                audioRef.current.src = song.url;
                audioRef.current.play().catch(e => {
                    console.error("Audio play failed:", e);
                    setIsPlaying(false);
                });
            } else if (songs.length > 0) {
                setCurrentSongIndex(0);
            } else {
                setCurrentSongIndex(null);
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = "";
                }
            }
        }
    }, [currentSongIndex, songs]);

    const value = {
        songs,
        setSongs,
        currentSongIndex,
        setCurrentSongIndex,
        isPlaying,
        setIsPlaying,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleDeleteSong,
        handleUploadSong
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
            <audio ref={audioRef} onEnded={handleNext} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};

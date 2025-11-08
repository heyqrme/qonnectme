
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
    { id: 3, title: "Midnight Stroll", artist: "Synthwave Dreams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mpj" },
];

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [songs, setSongs] = useState<Song[]>(initialSongs);
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const isPlayingRef = useRef(isPlaying);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    const handlePlayPause = (index?: number) => {
        const targetIndex = index ?? currentSongIndex;
        if (targetIndex === null) return;
    
        const audio = audioRef.current;
        if (!audio) return;
    
        const isNewSong = currentSongIndex !== targetIndex;

        if (isNewSong) {
            setCurrentSongIndex(targetIndex);
            // The useEffect will handle loading the new song
        } else {
            // Toggle play/pause for the current song
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play().catch(e => console.error("Audio play failed:", e));
                setIsPlaying(true);
            }
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
        
        if (currentSongIndex !== null && songs[currentSongIndex]?.id === id) {
             if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
             }
            if (newSongs.length === 0) {
                setCurrentSongIndex(null);
                setIsPlaying(false);
            } else {
                 const newIndex = currentSongIndex % newSongs.length;
                 setCurrentSongIndex(newIndex);
            }
        }
        setSongs(newSongs);
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
        const audio = audioRef.current;
        if (!audio) return;

        if (currentSongIndex !== null && songs[currentSongIndex]) {
            const song = songs[currentSongIndex];
            if (audio.src !== song.url) {
                audio.src = song.url;
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        setIsPlaying(true);
                    }).catch(error => {
                        console.error("Audio play failed on new song:", error);
                        setIsPlaying(false);
                    });
                }
            }
        } else {
            audio.pause();
            audio.src = "";
            setIsPlaying(false);
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

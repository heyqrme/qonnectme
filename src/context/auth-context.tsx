'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    isUserLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { auth, firestore } = useFirebase();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsUserLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        // If user is loaded and exists, and they are on a public page, redirect to profile
        if (!isUserLoading && user) {
            const isAuthPage = pathname === '/login' || pathname === '/signup';
            if (isAuthPage) {
                router.push('/profile');
            }
        }
    }, [user, isUserLoading, pathname, router]);

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // The useEffect hook will handle redirection
        } catch (error: any) {
            console.error("Login failed:", error);
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message || 'An unknown error occurred.',
            });
        }
    };
    
    const signup = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Create a new user profile in Firestore
            const userRef = doc(firestore, 'users', newUser.uid);
            await setDoc(userRef, {
                id: newUser.uid,
                name: name,
                username: email.split('@')[0],
                email: newUser.email,
                qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=https://qonnect.me/u/${newUser.uid}`,
                profileUrl: `/u/${newUser.uid}`,
                bio: `Welcome to my Qonnectme profile!`,
                avatarUrl: `https://placehold.co/128x128.png`,
                photos: [],
                videos: [],
            });

             // The useEffect hook will handle redirection
        } catch (error: any) {
            console.error("Signup failed:", error);
            toast({
                variant: 'destructive',
                title: 'Signup Failed',
                description: error.message || 'An unknown error occurred.',
            });
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error: any) {
            console.error("Logout failed:", error);
            toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: error.message || 'An unknown error occurred.',
            });
        }
    };

    const value = { user, isUserLoading, login, signup, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

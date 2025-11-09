'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, writeBatch } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    isUserLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { auth, firestore } = useFirebase();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsUserLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);
    
    const reloadUser = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await currentUser.reload();
            // The onAuthStateChanged listener will automatically update the user state
            // but we can force a re-render by setting the user state again.
            setUser(auth.currentUser);
        }
    }, [auth]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error: any) {
            console.error("Login failed:", error);
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message || 'An unknown error occurred.',
            });
            return false;
        }
    };
    
    const signup = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            
            await updateProfile(newUser, { displayName: name, photoURL: `https://placehold.co/128x128.png` });

            const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const profileUrl = `/u/${username}`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${window.location.origin}${profileUrl}`;

            // Use a batch to write to both collections atomically
            const batch = writeBatch(firestore);

            const profileRef = doc(firestore, 'users', newUser.uid, 'profile', 'main');
            batch.set(profileRef, {
                id: newUser.uid,
                name: name,
                username: username,
                email: newUser.email,
                qrCodeUrl: qrCodeUrl,
                profileUrl: profileUrl,
                bio: `Welcome to my Qonnectme profile!`,
                avatarUrl: `https://placehold.co/128x128.png`,
            });
            
            const usernameRef = doc(firestore, 'usernames', username);
            batch.set(usernameRef, { uid: newUser.uid });
            
            await batch.commit();
            
            await newUser.reload();
            setUser(auth.currentUser);

            return true;
        } catch (error: any) {
            console.error("Signup failed:", error);
            toast({
                variant: 'destructive',
                title: 'Signup Failed',
                description: error.message || 'An unknown error occurred.',
            });
            return false;
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

    const value = { user, isUserLoading, login, signup, logout, reloadUser };

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

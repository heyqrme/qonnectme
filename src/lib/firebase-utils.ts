'use client';

import { doc, getDoc, Firestore } from 'firebase/firestore';

/**
 * Checks if a username is available by checking for its existence in the top-level `usernames` collection.
 * @param firestore The Firestore instance.
 * @param username The username to check.
 * @returns A promise that resolves to `true` if the username is available, and `false` otherwise.
 */
export async function isUsernameAvailable(firestore: Firestore, username: string): Promise<boolean> {
    if (!username) {
        return false; // Cannot claim an empty username
    }
    try {
        const usernameRef = doc(firestore, 'usernames', username);
        const docSnap = await getDoc(usernameRef);
        return !docSnap.exists();
    } catch (error) {
        console.error("Error checking username availability:", error);
        // Fail safe: assume username is not available if there's an error.
        return false;
    }
}

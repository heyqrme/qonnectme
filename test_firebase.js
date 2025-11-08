
require('dotenv').config({ path: './.env.local' });
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('--- Firebase Test Script ---');
console.log('Attempting to initialize with the following configuration:');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('API Key:', firebaseConfig.apiKey ? 'Exists' : 'MISSING!'); // Don't log the key itself

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('\nERROR: API Key or Project ID is missing from your .env.local file.');
    process.exit(1);
}

try {
    console.log('\nInitializing Firebase app...');
    const app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully!');

    console.log('Getting Firebase auth instance...');
    getAuth(app);
    console.log('Firebase auth instance obtained successfully!');
    console.log('\n✅ SUCCESS: Your Firebase credentials are correct!');

} catch (error) {
    console.error('\n❌ FAILED: There is an error with your Firebase credentials.');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('\nPlease double-check ALL values in your .env.local file and try again.');
}
console.log('--- End of Script ---');

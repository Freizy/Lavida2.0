'use client';

const firebaseEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfig = {
  apiKey: firebaseEnv.apiKey || '',
  authDomain: firebaseEnv.authDomain || '',
  projectId: firebaseEnv.projectId || '',
  storageBucket: firebaseEnv.storageBucket || '',
  messagingSenderId: firebaseEnv.messagingSenderId || '',
  appId: firebaseEnv.appId || '',
};

export const isFirebaseAuthConfigured = Object.values(firebaseEnv).every((value) => {
  if (typeof value !== 'string') return false;
  return value.trim().length > 0 && !value.trim().startsWith('mock-');
});

export const firebaseAuthStatusMessage =
  'Sign in is unavailable until the Firebase client environment variables are configured. Add NEXT_PUBLIC_FIREBASE_* values and reload the page.';

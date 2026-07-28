import { FirebaseError } from "firebase/app";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/internal-error":
    "Could not reach Firebase Auth servers. Check your OAuth consent screen at https://console.cloud.google.com/apis/credentials/consent?project=lavidawebmobile — make sure it has your email filled in and a publishing status of 'Testing'. Also try disabling your browser's pop-up blocker for this site.",
  "auth/operation-not-allowed":
    "Google sign-in is not enabled. Go to Firebase Console → Authentication → Sign-in method → enable Google.",
  "auth/unauthorized-domain":
    "This domain is not authorized. Add it to Firebase Console → Authentication → Settings → Authorized domains.",
  "auth/popup-blocked":
    "Pop-up was blocked by your browser. Allow pop-ups for this site and try again.",
  "auth/popup-closed-by-user":
    "Sign-in cancelled. The pop-up was closed before completing.",
  "auth/network-request-failed":
    "Network error. Check your internet connection and try again.",
  "auth/too-many-requests":
    "Too many attempts. Please wait a few minutes and try again.",
  "auth/user-disabled":
    "This account has been disabled. Contact support.",
  "auth/invalid-api-key":
    "Invalid API key. Check your NEXT_PUBLIC_FIREBASE_API_KEY in .env.",
  "auth/quota-exceeded":
    "Firebase Auth quota exceeded. Try again later.",
};

export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    const message = AUTH_ERROR_MESSAGES[err.code];
    if (message) return message;
    if (err.code.includes("api-key")) {
      return "Invalid API key. Check your NEXT_PUBLIC_FIREBASE_API_KEY in .env.";
    }
    return `Sign-in failed (${err.code}). Check your Firebase Console configuration.`;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred during sign-in.";
}

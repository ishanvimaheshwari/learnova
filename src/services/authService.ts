import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Provider with OAuth scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
googleProvider.addScope("openid");

// Ensure account selection prompt
googleProvider.setCustomParameters({
  prompt: "select_account",
});

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const getCachedAccessToken = () => cachedAccessToken;

/**
 * Trigger Real Google Sign-In popup with Firebase Auth
 */
export const signInWithGoogleReal = async (): Promise<{
  user: User;
  token: string | null;
  profile: {
    id: string;
    name: string;
    email: string;
    photoUrl: string;
  };
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    cachedAccessToken = accessToken;

    const firebaseUser = result.user;
    const profile = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Google Scholar",
      email: firebaseUser.email || "",
      photoUrl:
        firebaseUser.photoURL ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.email || "scholar")}`,
    };

    return {
      user: firebaseUser,
      token: accessToken,
      profile,
    };
  } catch (error: any) {
    console.error("Google sign in popup error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Sign out from Firebase Auth
 */
export const logOutGoogle = async () => {
  cachedAccessToken = null;
  await firebaseSignOut(auth);
};

/**
 * Listen to real authentication state changes
 */
export const subscribeToAuthState = (
  onUserLoggedIn: (profile: { id: string; name: string; email: string; photoUrl: string }) => void,
  onUserLoggedOut: () => void
) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      onUserLoggedIn({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Google Scholar",
        email: firebaseUser.email || "",
        photoUrl:
          firebaseUser.photoURL ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.email || "scholar")}`,
      });
    } else {
      onUserLoggedOut();
    }
  });
};

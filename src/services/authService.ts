import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
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
googleProvider.setCustomParameters({
  prompt: "select_account",
});

let cachedAccessToken: string | null = null;
export const getCachedAccessToken = () => cachedAccessToken;

declare global {
  interface Window {
    google?: any;
  }
}

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  accessToken?: string | null;
}

/**
 * Safely parse standard JWT returned by Google Identity Services ID token
 */
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT from Google:", e);
    return null;
  }
};

/**
 * Fetch real user details using an OAuth access token from Google
 */
export const fetchGoogleUserInfo = async (accessToken: string): Promise<GoogleUserProfile> => {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google profile: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    id: data.sub || `google-${Date.now()}`,
    name: data.name || data.given_name || "Google Scholar",
    email: data.email || "",
    photoUrl:
      data.picture ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.email || "scholar")}`,
    accessToken,
  };
};

/**
 * Try authentication via Google Identity Services (GIS) Token Client
 */
export const signInWithGISTokenClient = (): Promise<GoogleUserProfile> => {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error("Google Identity Services script not available"));
      return;
    }

    const clientId = firebaseConfig.oAuthClientId;
    if (!clientId) {
      reject(new Error("OAuth Client ID is not configured"));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }
          if (tokenResponse.access_token) {
            try {
              cachedAccessToken = tokenResponse.access_token;
              const profile = await fetchGoogleUserInfo(tokenResponse.access_token);
              resolve(profile);
            } catch (fetchErr) {
              reject(fetchErr);
            }
          } else {
            reject(new Error("No access token returned by Google"));
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err?.message || "Google OAuth client error"));
        },
      });

      client.requestAccessToken({ prompt: "select_account" });
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Render official Google Sign In button directly into a container DOM element
 */
export const renderGoogleIdentityButton = (
  containerElement: HTMLElement,
  onSuccess: (profile: GoogleUserProfile) => void,
  onError?: (err: any) => void
) => {
  if (!window.google?.accounts?.id) {
    console.warn("Google Identity accounts.id not ready");
    return;
  }

  const clientId = firebaseConfig.oAuthClientId;
  if (!clientId) return;

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential: string }) => {
        if (!response.credential) {
          if (onError) onError(new Error("No credential received"));
          return;
        }
        const payload = parseJwt(response.credential);
        if (payload) {
          const profile: GoogleUserProfile = {
            id: payload.sub || `google-${Date.now()}`,
            name: payload.name || payload.given_name || "Google Scholar",
            email: payload.email || "",
            photoUrl:
              payload.picture ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(payload.email || "scholar")}`,
            accessToken: response.credential,
          };
          onSuccess(profile);
        }
      },
    });

    window.google.accounts.id.renderButton(containerElement, {
      type: "standard",
      theme: "filled_blue",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: 320,
    });
  } catch (err) {
    console.warn("Could not render official Google button:", err);
  }
};

/**
 * Primary Google Sign-In runner:
 * Tries Google Identity Services first, then Firebase Auth popup.
 */
export const signInWithGoogleReal = async (): Promise<{
  token: string | null;
  profile: GoogleUserProfile;
}> => {
  // Strategy 1: Google Identity Services (GIS)
  if (window.google?.accounts?.oauth2) {
    try {
      const profile = await signInWithGISTokenClient();
      return {
        token: profile.accessToken || null,
        profile,
      };
    } catch (gisError: any) {
      console.warn("GIS token client attempt failed, falling back to Firebase popup:", gisError);
    }
  }

  // Strategy 2: Firebase Auth Popup
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    cachedAccessToken = accessToken;

    const firebaseUser = result.user;
    const profile: GoogleUserProfile = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Google Scholar",
      email: firebaseUser.email || "",
      photoUrl:
        firebaseUser.photoURL ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.email || "scholar")}`,
      accessToken,
    };

    return {
      token: accessToken,
      profile,
    };
  } catch (firebaseError: any) {
    console.error("Firebase auth popup error:", firebaseError);
    throw firebaseError;
  }
};

/**
 * Sign out from Firebase and clear tokens
 */
export const logOutGoogle = async () => {
  cachedAccessToken = null;
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn("Firebase signout error:", err);
  }
};

/**
 * Listen to real authentication state changes
 */
export const subscribeToAuthState = (
  onUserLoggedIn: (profile: GoogleUserProfile) => void,
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

import { firebaseConfig, isFirebaseConfigured } from "./firebase-config";

const FIREBASE_VERSION = "10.14.1";
const USER_STORAGE_KEY = "voltpass.firebaseUser";

export interface FirebaseUserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
}

let authInstance: any = null;
let authModulePromise: Promise<any> | null = null;

// Firebase's modular browser SDK is loaded from Google's official CDN so this app
// can authenticate without bundling a half-installed package dependency.
async function loadFirebaseModules() {
  const isBrowser = typeof window !== "undefined";
  const [appModule, authModule, analyticsModule] = await Promise.all([
    import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`) as Promise<any>,
    import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`) as Promise<any>,
    isBrowser
      ? import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-analytics.js`) as Promise<any>
      : Promise.resolve(null),
  ]);

  return { appModule, authModule, analyticsModule };
}

async function getAuthModule() {
  authModulePromise ??= loadFirebaseModules().then(({ authModule }) => authModule);
  return authModulePromise;
}

export async function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Add your VITE_FIREBASE_* values first.");
  }

  if (authInstance) return authInstance;

  const { appModule, authModule, analyticsModule } = await loadFirebaseModules();
  const app = appModule.getApps().length
    ? appModule.getApp()
    : appModule.initializeApp(firebaseConfig);

  // Initialize analytics on the client side if measurementId is provided
  if (typeof window !== "undefined" && analyticsModule && firebaseConfig.measurementId) {
    try {
      analyticsModule.getAnalytics(app);
    } catch (e) {
      console.warn("Firebase analytics failed to initialize:", e);
    }
  }

  authInstance = authModule.getAuth(app);
  await authModule.setPersistence(authInstance, authModule.browserLocalPersistence);

  return authInstance;
}

export function mapFirebaseUser(user: any | null): FirebaseUserProfile | null {
  if (!user) return null;

  return {
    uid: user.uid,
    name: user.displayName ?? "Google User",
    email: user.email ?? "",
    photoURL: user.photoURL ?? "",
  };
}

export function saveAuthenticatedUser(user: any | null) {
  const profile = mapFirebaseUser(user);
  if (!profile) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export function getStoredAuthenticatedUser(): FirebaseUserProfile | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as FirebaseUserProfile;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export async function signInWithGoogle() {
  const [auth, authModule] = await Promise.all([getFirebaseAuth(), getAuthModule()]);
  const provider = new authModule.GoogleAuthProvider();

  // Force account chooser so users can select the intended Google identity.
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await authModule.signInWithPopup(auth, provider);
  return saveAuthenticatedUser(result.user);
}

export async function signOutOfGoogle() {
  const [auth, authModule] = await Promise.all([getFirebaseAuth(), getAuthModule()]);
  await authModule.signOut(auth);
  saveAuthenticatedUser(null);
}

export async function waitForAuthState() {
  const [auth, authModule] = await Promise.all([getFirebaseAuth(), getAuthModule()]);

  return new Promise<FirebaseUserProfile | null>((resolve) => {
    const unsubscribe = authModule.onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(saveAuthenticatedUser(user));
    });
  });
}

export async function onFirebaseAuthChange(
  callback: (profile: FirebaseUserProfile | null) => void,
) {
  const [auth, authModule] = await Promise.all([getFirebaseAuth(), getAuthModule()]);

  return authModule.onAuthStateChanged(auth, (user) => {
    callback(saveAuthenticatedUser(user));
  });
}

export function getFriendlyAuthError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  const messages: Record<string, string> = {
    "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
    "auth/cancelled-popup-request": "Another Google sign-in window is already open.",
    "auth/popup-blocked": "Your browser blocked the Google sign-in window. Please allow popups and try again.",
    "auth/network-request-failed": "Network trouble interrupted Google sign-in. Please try again.",
    "auth/unauthorized-domain": "This domain is not authorized in Firebase Authentication settings.",
  };

  return messages[code] ?? "Google sign-in could not be completed. Please try again.";
}

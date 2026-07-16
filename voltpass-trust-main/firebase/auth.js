import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

const USER_STORAGE_KEY = "voltpass.firebaseUser";
const app = isFirebaseConfigured() ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const analytics = app && firebaseConfig.measurementId ? getAnalytics(app) : null;

if (auth) {
  await setPersistence(auth, browserLocalPersistence);
}

export function mapFirebaseUser(user) {
  if (!user) return null;

  return {
    uid: user.uid,
    name: user.displayName || "Google User",
    email: user.email || "",
    photoURL: user.photoURL || "",
  };
}

export function saveAuthenticatedUser(user) {
  const profile = mapFirebaseUser(user);
  if (!profile) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export function getStoredAuthenticatedUser() {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase is not configured.");

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return saveAuthenticatedUser(result.user);
}

export async function logout() {
  if (!auth) throw new Error("Firebase is not configured.");

  await signOut(auth);
  saveAuthenticatedUser(null);
}

export function listenToAuthState(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => callback(saveAuthenticatedUser(user)));
}

export function getFriendlyAuthError(error) {
  const messages = {
    "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
    "auth/cancelled-popup-request": "Another Google sign-in window is already open.",
    "auth/popup-blocked": "Your browser blocked the Google sign-in window. Please allow popups and try again.",
    "auth/network-request-failed": "Network trouble interrupted Google sign-in. Please try again.",
    "auth/unauthorized-domain": "This domain is not authorized in Firebase Authentication settings.",
  };

  return messages[error?.code] || error?.message || "Google sign-in could not be completed.";
}

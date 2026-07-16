// Replace each placeholder with values from Firebase Console > Project settings > Web app.
export const firebaseConfig = {
  apiKey: "AIzaSyDbpjbNr1ZTEgxg3x9uejZ4R2y5KimBMjc",
  authDomain: "voltpass-508ec.firebaseapp.com",
  projectId: "voltpass-508ec",
  storageBucket: "voltpass-508ec.firebasestorage.app",
  messagingSenderId: "916917743336",
  appId: "1:916917743336:web:b095ca49e622ec51e2635d",
  measurementId: "G-KBCD0ZNJSZ"
};

export function isFirebaseConfigured() {
  const { measurementId, ...rest } = firebaseConfig;
  return Object.values(rest).every((value) => value && !value.startsWith("YOUR_"));
}

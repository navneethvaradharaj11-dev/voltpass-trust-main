import {
  getFriendlyAuthError,
  listenToAuthState,
  signInWithGoogle,
} from "../firebase/auth.js";

const googleButton = document.querySelector("[data-google-login]");
const errorMessage = document.querySelector("[data-auth-error]");

function setLoading(isLoading) {
  if (!googleButton) return;

  googleButton.disabled = isLoading;
  googleButton.classList.toggle("auth-loading", isLoading);
  googleButton.textContent = isLoading ? "Opening Google..." : "Continue with Google";
}

function showError(message) {
  if (!errorMessage) return;

  errorMessage.textContent = message;
  errorMessage.hidden = !message;
}

listenToAuthState((user) => {
  if (user) window.location.replace("./dashboard.html");
});

googleButton?.addEventListener("click", async () => {
  setLoading(true);
  showError("");

  try {
    await signInWithGoogle();
    window.location.replace("./dashboard.html");
  } catch (error) {
    showError(getFriendlyAuthError(error));
  } finally {
    setLoading(false);
  }
});

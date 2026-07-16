import {
  getStoredAuthenticatedUser,
  listenToAuthState,
  logout,
} from "../firebase/auth.js";

const logoutButton = document.querySelector("[data-logout]");
const nameElement = document.querySelector("[data-user-name]");
const emailElement = document.querySelector("[data-user-email]");
const photoElement = document.querySelector("[data-user-photo]");

function renderUser(user) {
  if (!user) return;

  if (nameElement) nameElement.textContent = user.name;
  if (emailElement) emailElement.textContent = user.email;
  if (photoElement && user.photoURL) {
    photoElement.src = user.photoURL;
    photoElement.alt = `${user.name}'s Google profile photo`;
  }
}

renderUser(getStoredAuthenticatedUser());

listenToAuthState((user) => {
  if (!user) {
    window.location.replace("./login.html");
    return;
  }

  renderUser(user);
});

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;

  try {
    await logout();
    window.location.replace("./login.html");
  } finally {
    logoutButton.disabled = false;
  }
});

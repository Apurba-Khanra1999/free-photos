// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByFQdF3fh__ud9G4DTq5GxK_wGSqHdl1U",
  authDomain: "flex-photos-2025.firebaseapp.com",
  projectId: "flex-photos-2025",
  storageBucket: "flex-photos-2025.firebasestorage.app",
  messagingSenderId: "403656569919",
  appId: "1:403656569919:web:e63391126730b0a462b48a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

// DOM elements
const googleLogin = document.getElementById("google-login-btn");
const profileContainer = document.getElementById("profile-container");
const loginContainer = document.getElementById("login-container");
const profileImage = document.getElementById("profile");
const modal = document.getElementById("profile-modal");
const modalUsername = document.getElementById("modal-username");
const modalUseremail = document.getElementById("modal-useremail");
const logoutBtn = document.getElementById("logout-btn");

// Store user data in local storage
function storeUserData(user) {
  localStorage.setItem("userName", user.displayName);
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userProfilePicture", user.photoURL);
}

// Retrieve user data from local storage
function getUserDataFromLocalStorage() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userProfilePicture = localStorage.getItem("userProfilePicture");

  // Update the modal content
  modalUsername.textContent = userName;
  modalUseremail.textContent = userEmail;
  profileImage.src = userProfilePicture;
}

// Recursive function to ensure successful login
async function ensureLogin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    storeUserData(user);
    getUserDataFromLocalStorage();

    // Switch UI
    loginContainer.classList.add("hidden");
    profileContainer.classList.remove("hidden");
  } catch (error) {
    console.error("Login failed or popup closed, retrying...");
    ensureLogin(); // Retry login
  }
}

// Open modal on profile image click
profileImage.addEventListener("click", () => {
  // Update the modal content dynamically
  const userProfilePicture = localStorage.getItem("userProfilePicture");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  document.getElementById("profile-modal-img").src = userProfilePicture;
  modalUsername.textContent = userName;
  modalUseremail.textContent = userEmail;

  modal.classList.remove("hidden"); // Show modal
});

// Close modal when clicking outside or on close button
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.id === "modal-close") {
    modal.classList.add("hidden");
  }
});

// Logout event
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Clear local storage
      localStorage.clear();

      // Switch UI
      profileContainer.classList.add("hidden");
      loginContainer.classList.remove("hidden");
      modal.classList.add("hidden");

      // Restart login process
      ensureLogin();
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
    });
});

// Initialize UI on page load
window.onload = function () {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      ensureLogin(); // Start login process if not logged in
    } else {
      // User is already logged in
      storeUserData(user);
      getUserDataFromLocalStorage();

      // Switch UI
      loginContainer.classList.add("hidden");
      profileContainer.classList.remove("hidden");
      console.log("User is already logged in:", user);
    }
  });
};

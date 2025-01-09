// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

// Store user data in local storage
function storeUserData(user) {
    localStorage.setItem('userName', user.displayName);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userProfilePicture', user.photoURL);
  }
  
  // Retrieve user data from local storage
  function getUserDataFromLocalStorage() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userProfilePicture = localStorage.getItem('userProfilePicture');
  
    // Update the UI 
    document.getElementById('username').textContent = userName;
    document.getElementById('useremail').textContent = userEmail;
    document.getElementById('profile').src = userProfilePicture;
  }
  
  // Check if user data exists in local storage on page load
  window.onload = () => {
    if (localStorage.getItem('userName')) {
      getUserDataFromLocalStorage(); 
    }
  };

const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener('click', function() {
    signInWithPopup(auth, provider).then((result)=>{
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        storeUserData(user);
        updateUserProfile(user);
        // window.location.href = "../index.html"
    }).catch((error)=> {
        const errorCode = error.code;
        const errorMessage = error.message; 
    });
})

function updateUserProfile(user){
    const userName = user.displayName;
    const userEmail = user.email;
    const userProfilePicture = user.photoURL;

    document.getElementById('username').textContent = userName;
    document.getElementById('useremail').textContent = userEmail;
    document.getElementById('profile').src = userProfilePicture;
}
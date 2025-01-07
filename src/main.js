// Plugin imports
import { registerPlugins } from '@/plugins';

// Component imports
import App from './App.vue';

// Composable imports
import { createApp } from 'vue';

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgacUgsHu_lG6fOzYDZgieAp7IO8Io6EI",
  authDomain: "coinpulse-login-signup.firebaseapp.com",
  projectId: "coinpulse-login-signup",
  storageBucket: "coinpulse-login-signup.appspot.com", // Corrected the storage bucket domain
  messagingSenderId: "758592257205",
  appId: "1:758592257205:web:8d3b8e06ace5d0b094d2fc",
  measurementId: "G-F9VR6LPVPG"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(firebaseApp);

// Create the Vue app
const app = createApp(App);

// Register plugins
registerPlugins(app);

// Mount the Vue app
app.mount('#app');
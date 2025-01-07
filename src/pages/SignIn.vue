<template>
    <div class="d-flex align-center justify-center h-100 mx-3">
        <div>
            <v-img class="mx-auto my-6" max-width="95" src="/src/assets/logo.png"></v-img>

            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                <div class="text-subtitle-1 text-medium-emphasis">Account</div>

                <!-- Email field -->
                <v-text-field
                    v-model="email"
                    density="compact"
                    placeholder="Email address"
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                    type="email"
                    :error="touched.email && !emailValid"
                    :error-messages="touched.email && !emailValid ? 'Invalid email address' : ''"
                    @blur="touched.email = true"
                ></v-text-field>

                <!-- Password field -->
                <v-text-field
                    v-model="password"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'"
                    density="compact"
                    placeholder="Enter your password"
                    prepend-inner-icon="mdi-lock-outline"
                    variant="outlined"
                    :error="touched.password && !passwordValid"
                    :error-messages="touched.password && !passwordValid ? 'Password must be at least 6 characters long' : ''"
                    @blur="touched.password = true"
                    @click:append-inner="visible = !visible"
                ></v-text-field>

                <!-- Error message field -->
                <v-alert v-if="errorMessage" type="error" dismissible>
                    {{ errorMessage }}
                </v-alert>

                <v-card class="mb-12" color="surface-variant" variant="tonal">
                    <v-card-text class="text-medium-emphasis text-caption">
                        Warning: After 3 consecutive failed login attempts, your account will be temporarily locked for
                        three hours. If you must login now, you can also click "Forgot login password?" below to reset
                        the login password.
                    </v-card-text>
                </v-card>

                <!-- Login button -->
                <v-btn @click="SignIn" class="mb-8" color="pink-darken-2" size="large" variant="tonal" block>
                    Log In
                </v-btn>

                <v-card-text class="text-center">
                    <RouterLink to="/Register" class="text-pink text-decoration-none">
                        Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
                    </RouterLink>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import { useUserStore } from "@/stores/userStore";
import router from "@/router";

// State variables
const email = ref("");
const password = ref("");
const visible = ref(false);
const touched = ref({ email: false, password: false }); // Touched fields
const errorMessage = ref(""); // Variable to store error message

// Validations
const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const passwordValid = computed(() => password.value.length >= 6);

// User store
const userStore = useUserStore();

// Sign in function
const SignIn = async () => {
    // Clear error message before trying
    errorMessage.value = "";

    // Mark fields as "touched" when attempting to login
    touched.value.email = true;
    touched.value.password = true;

    // Check if fields are valid
    if (!emailValid.value || !passwordValid.value) {
        return;
    }

    try {
        // Perform authentication
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

        const db = getDatabase();

        // At this point, the user is authenticated
        const user = userCredential.user;
        console.log("Success, you're logged in:", user.uid);

        // Fetch user data from Realtime Database
        const userRef = dbRef(db, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log(userData);
            userStore.setUser(userData);
            router.push("/User");
        } else {
            console.log("No data available");
            errorMessage.value = "User not found";
        }
    } catch (error) {
        console.error(error.code, error.message);

        // Error handling
        if (error.code === "auth/wrong-password") {
            errorMessage.value = "Incorrect password. Please try again.";
        } else if (error.code === "auth/user-not-found") {
            errorMessage.value = "No user found with this email.";
        } else if (error.code === "auth/too-many-requests") {
            errorMessage.value = "Too many failed login attempts. Try again later.";
        } else if (error.code === "auth/invalid-credential") {
            errorMessage.value = "Invalid email or password. Please check your credentials.";
        } else {
            errorMessage.value = "Error: " + error.message;
        }
    }
};
</script>
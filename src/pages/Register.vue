<template>
    <div class="d-flex align-center justify-center h-100 ma-0">
        <v-card class="mx-auto" max-width="344" title="User Registration">
            <v-container>
                <v-text-field 
                    v-model="username" 
                    color="pink-darken-2" 
                    label="Username" 
                    variant="underlined"
                    :error="touched.username && !usernameValid" 
                    :error-messages="touched.username && !usernameValid ? 'Username is required' : ''"
                ></v-text-field>

                <v-text-field 
                    v-model="first" 
                    color="pink-darken-2" 
                    label="First name" 
                    variant="underlined"
                    :error="touched.first && !firstValid" 
                    :error-messages="touched.first && !firstValid ? 'First name is required' : ''"
                ></v-text-field>

                <v-text-field 
                    v-model="last" 
                    color="pink-darken-2" 
                    label="Last name" 
                    variant="underlined"
                    :error="touched.last && !lastValid" 
                    :error-messages="touched.last && !lastValid ? 'Last name is required' : ''"
                ></v-text-field>

                <v-text-field 
                    v-model="email" 
                    color="pink-darken-2" 
                    label="Email" 
                    variant="underlined"
                    :error="touched.email && !emailValid" 
                    :error-messages="touched.email && !emailValid ? 'Invalid email address' : ''"
                ></v-text-field>

                <v-text-field 
                    v-model="password" 
                    color="pink-darken-2" 
                    label="Password" 
                    type="password"
                    placeholder="Enter your password" 
                    variant="underlined" 
                    :error="touched.password && !passwordValid"
                    :error-messages="touched.password && !passwordValid ? 'Password must be at least 6 characters long' : ''"
                ></v-text-field>

                <v-checkbox 
                    v-model="terms" 
                    color="pink-darken-2" 
                    :error="touched.terms && !terms"
                    :error-messages="touched.terms && !terms ? 'You must agree to the terms' : ''" 
                    label="I agree to site terms and conditions"
                ></v-checkbox>

                <!-- Success and Error Messages -->
                <v-alert v-if="registrationSuccess" type="success" color="green">
                    You have been registered successfully!
                </v-alert>
                <v-alert v-if="emailExists" type="error" color="red">
                    This email is already registered.
                </v-alert>
                <v-alert v-if="registrationError" type="error" color="red">
                    Error registering user: {{ registrationError }}
                </v-alert>
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="register" color="pink-darken-2">
                    Complete Registration
                    <v-icon icon="mdi-chevron-right" end></v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref as dbRef, set } from "firebase/database";

// User input fields
const username = ref("");
const first = ref("");
const last = ref("");
const email = ref("");
const password = ref("");
const terms = ref(false);

// Track individual field interaction
const touched = ref({
    username: false,
    first: false,
    last: false,
    email: false,
    password: false,
    terms: false,
});

// Validation computed properties
const usernameValid = computed(() => username.value.trim() !== "");
const firstValid = computed(() => first.value.trim() !== "");
const lastValid = computed(() => last.value.trim() !== "");
const emailValid = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
);
const passwordValid = computed(() => password.value.length >= 6);

// Feedback variables
const registrationSuccess = ref(false);
const emailExists = ref(false);
const registrationError = ref(null);

// Register function
const register = () => {
    // Reset previous feedback
    registrationSuccess.value = false;
    emailExists.value = false;
    registrationError.value = null;

    // Mark all fields as touched when trying to submit
    Object.keys(touched.value).forEach((key) => (touched.value[key] = true));

    if (
        usernameValid.value &&
        firstValid.value &&
        lastValid.value &&
        emailValid.value &&
        passwordValid.value &&
        terms.value
    ) {
        const auth = getAuth();
        const db = getDatabase();

        // Attempt to create the user
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const userId = userCredential.user.uid;

                // Save additional user data in the database
                set(dbRef(db, "users/" + userId), {
                    username: username.value,
                    firstName: first.value,
                    lastName: last.value,
                    email: email.value
                });

                registrationSuccess.value = true;
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    emailExists.value = true;
                } else {
                    registrationError.value = error.message;
                }
            });
    }
};
</script>
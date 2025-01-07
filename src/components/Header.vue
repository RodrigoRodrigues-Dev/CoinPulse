<template>
    <v-app-bar v-if="smAndDown" class="px-5" :style="{ backgroundColor: backgroundColor }">
        <!-- Hamburger Button -->
        <v-app-bar-nav-icon @click="toggleIsModalVisible"></v-app-bar-nav-icon>

        <!-- Title Page -->
        <v-app-bar-title class="font-weight-bold text-h5">
            Coin<span style="color: #E91E63;">Pulse</span>
        </v-app-bar-title>

        <!-- Toggle Theme -->
        <div class="d-flex justify-center align-center">
            <v-icon class="mr-4" color="pink-accent-3" size="25">
                {{ themeFunction.darkMode ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny' }}
            </v-icon>
            <v-switch v-model="themeFunction.switchActive" color="pink-accent-4"
                class="switch d-flex align-center justify-center" @click="toggleTheme"></v-switch>
        </div>
    </v-app-bar>
</template>

<script setup>
import { useAppStore } from '@/stores/app.js';
import { useDisplay } from 'vuetify';
import { useTheme } from 'vuetify';
import { useThemeFunction } from '@/stores/themeFunction';

const { smAndDown } = useDisplay();
const appStore = useAppStore();
const themeFunction = useThemeFunction();
const theme = useTheme();

// Computed property to change background color based on theme
const backgroundColor = computed(() => themeFunction.darkMode ? '#000000' : '#fff');

const toggleIsModalVisible = () => {
    appStore.isModalVisible = !appStore.isModalVisible;
};

const toggleTheme = () => {
    themeFunction.toggleTheme();
    theme.global.name.value = themeFunction.darkMode ? 'dark' : 'light';
};
</script>
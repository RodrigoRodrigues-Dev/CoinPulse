<template>
  <v-app>
    <!-- Navigation Page -->
    <NavBar />

    <!-- Header Page -->
    <Header />

    <!-- Main Page -->
    <v-main :style="backgroundStyle">
      <LogoutAlert />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
// Imports
import { computed } from 'vue';
import { useTheme } from 'vuetify';

// Component Imports
import NavBar from './components/NavBar.vue';
import Header from './components/Header.vue';
import LogoutAlert from './components/LogoutAlert.vue';

// Theme Setup
const theme = useTheme();

// Background Style Computation
const backgroundStyle = computed(() => {
  if (theme.global.name.value === 'dark') {
    return 'background: linear-gradient(180deg, #111111 0%, #442e43 100%);';
  } else {
    return 'background: linear-gradient(180deg, #ffffff 0%, #eda8d9 100%);';
  }
});
</script>

<style scoped>
/* Additional scoped styles can go here */
</style>
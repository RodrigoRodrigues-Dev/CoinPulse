<template>
    <v-navigation-drawer :width="110" class="py-5 border-none" mobile-breakpoint="md" v-model="appStore.isModalVisible">

        <!-- Menu Logo -->
        <template v-slot:prepend>
            <v-list-item>
                <v-img class="mx-auto" :width="50" src="/src/assets/logo.png"></v-img>
            </v-list-item>
        </template>

        <!-- Top Menu -->
        <RouterLink style="color: inherit;" v-for="(item, index) in menuItemsTop" :key="index"
            :to="item.name === 'Home' ? '/' : `/${item.name}`">
            <v-list-item @click="renameSelectPage(item)" @mouseover="hoveredItem = item.name"
                @mouseleave="hoveredItem = null" class="d-flex justify-center mt-5">
                <v-icon :class="{ 'icon-hover': hoveredItem === item.name || appStore.selectPage === item.name }">
                    {{ item.icon }}
                </v-icon>
            </v-list-item>
        </RouterLink>

        <!-- Bottom Menu -->
        <template v-slot:append>
            <!-- Toggle Theme -->
            <v-list-item v-if="mdAndUp" class="d-flex justify-center align-center">
                <div class="d-flex justify-center align-center flex-column">
                    <v-icon class="mb-5" color="pink-accent-3" size="20">
                        {{ themeFunction.darkMode ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny' }}
                    </v-icon>
                    <v-switch v-model="themeFunction.switchActive" color="pink-accent-4"
                        class="switch d-flex align-center justify-center" inset @click="toggleTheme" />
                </div>
            </v-list-item>

            <!-- User -->
            <v-list-item v-for="(item, index) in menuItemsBottom" :key="index" @mouseover="hoveredItem = item.icon"
                @mouseleave="hoveredItem = null" class="d-flex justify-center" link>
                <v-icon :class="{ 'icon-hover': hoveredItem === item.icon }">
                    {{ item.icon }}
                </v-icon>
            </v-list-item>
        </template>

    </v-navigation-drawer>
</template>

<script setup>
// Imports
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';
import { useDisplay } from 'vuetify';
import { useTheme } from 'vuetify';
import { useThemeFunction } from '@/stores/themeFunction';

// Store
const appStore = useAppStore();
const themeFunction = useThemeFunction();
const { mdAndUp } = useDisplay();
const theme = useTheme();

// Reactive State
const hoveredItem = ref(null);

// Menu items configuration
const menuItemsTop = [
    { icon: 'mdi-earth-box', name: 'Home' },
    { icon: 'mdi-view-dashboard', name: 'DashBoard' },
    { icon: 'mdi-finance', name: 'Graphics' },
    { icon: 'mdi-source-fork', name: 'Fork' },
    { icon: 'mdi-database-outline', name: 'DataBase' }
];

const menuItemsBottom = [
    { icon: 'mdi-account-outline' },
    { icon: 'mdi-login' }
];

// Toggle Theme function
const toggleTheme = () => {
    themeFunction.toggleTheme();
    theme.global.name.value = themeFunction.darkMode ? 'dark' : 'light';
};

// Rename page on selection
const renameSelectPage = (item) => {
    appStore.selectPage = item.name;
};
</script>

<style scoped>
.icon-hover {
    color: #e6007a;
    transition: color 0.3s ease;
}

.switch {
    transform: rotate(90deg);
}

.v-list-item {
    padding: 10px 0;
}
</style>
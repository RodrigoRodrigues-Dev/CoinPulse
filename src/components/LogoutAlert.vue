<template>
    <v-card
        v-if="showLogoutMessage"
        class="d-flex align-center position-absolute right-0 ma-2"
        max-width="400"
        height="75"
        style="z-index: 9999;"
    >
        <v-card-title class="headline">You have successfully logged out</v-card-title>
    </v-card>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { ref, watch } from 'vue';

const userStore = useUserStore();
const showLogoutMessage = ref(false);

// Monitoring the login state change
watch(() => userStore.userIsLoggedIn, (newVal) => {
    if (!newVal) {
        showLogoutMessage.value = true;
        setTimeout(() => {
            showLogoutMessage.value = false;
        }, 2000);
    }
});

// Initialize authentication
onMounted(() => {
    userStore.initAuth();
});
</script>

<style scoped>
.headline {
    font-weight: bold;
    font-size: 16px;

    @media (max-width: 960px) {
        font-size: 14px;
    }
}
</style>
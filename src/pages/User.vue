<template>
    <div v-if="userStore.user" class="ma-4">
        <h1 class="mb-5">{{ userStore.username }}</h1>
        <v-row class="charts">
            <!-- Bar Chart -->
            <v-col>
                <v-card class="mx-auto h-100 w-auto" elevation="16">
                    <v-card-item>
                        <canvas ref="myChartBar"></canvas>
                    </v-card-item>
                </v-card>
            </v-col>

            <!-- Doughnut Chart -->
            <v-col>
                <v-card class="mx-auto h-100 w-auto d-flex justify-center align-center" elevation="16">
                    <v-card-item>
                        <canvas ref="myChartDoughnut"></canvas>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="my-10">
            <!-- Notifications Section -->
            <v-card style="max-width: 600px;" class="mx-auto pa-3 rounded-lg" elevation="16">
                <v-card-title>Notifications</v-card-title>
                <v-card-text>Stay tuned for the latest updates on your favorite coins.</v-card-text>
            </v-card>
        </v-row>

        <!-- Favorites Section -->
        <v-card style="max-width: 1600px;" class="mx-auto my-4 pa-3 rounded-lg" elevation="16">
            <v-card-title>Favorites</v-card-title>
            <v-card-text v-if="favoriteCoins.length">
                <v-list style="max-height: 600px; overflow-y: auto;">
                    <v-list-item v-for="(item, index) in favoriteCoins" :key="index">
                        <div class="d-flex align-center justify-space-between my-2">
                            <div class="d-flex align-center">
                                <div v-if="item.market.logo">
                                    <img :height="20" :width="20" :src="item.market.logo" alt="" />
                                </div>
                                <v-img v-if="item.market.logo" :src="item.market.logo" :alt="item.market.name"
                                    max-height="20" max-width="20" class="mr-2" />
                                <v-list-item-title>{{ item.market.name }}</v-list-item-title>
                                <v-list-item-subtitle class="ml-2">
                                    {{ item.base }}/{{ item.target }}
                                </v-list-item-subtitle>
                            </div>
                            <v-list-item-action style="position: sticky; right: 0; z-index: 999;">
                                <v-btn icon @click="removeFavorite(item)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </div>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-text v-else>
                <span>Your favorites is empty add coins in</span>
                <router-link to="/">Home</router-link>
            </v-card-text>
        </v-card>
    </div>

    <div v-else class="d-flex flex-column align-center justify-center ma-4" style="height: 100vh;">
        <v-card class="mx-auto my-4 pa-3 rounded-xl" elevation="16">
            <v-card-title>Access Restricted</v-card-title>
            <v-card-text>
                <h1 class="mb-3">Please log in to access your account</h1>
                <router-link to="/SignIn">
                    <v-btn color="black">Go to Sign In</v-btn>
                </router-link>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';
import { useUserStore } from '@/stores/userStore';
import { getDatabase, ref as dbRef, onValue, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// References and Instances
const myChartBar = ref(null);
const myChartDoughnut = ref(null);
let barChartInstance = null;
let doughnutChartInstance = null;

// State Management
const favoriteCoins = ref([]);
const userStore = useUserStore();

// Remove coin from favorites
const removeFavorite = (item) => {
    const db = getDatabase();
    const user = userStore.user;
    const sanitizedTickerName = `${item.market.name}_${item.base}_${item.target}`.replace(/[.#$[\]]/g, '_');
    const favoritesRef = dbRef(db, `favorites/${user.uid}/${sanitizedTickerName}`);

    remove(favoritesRef)
        .then(() => {
            favoriteCoins.value = favoriteCoins.value.filter((coin) => coin !== item);
        })
        .catch((error) => {
            console.error('Error removing ticker from favorites:', error);
        });
};

// Fetch favorite tickers from Firebase
const fetchFavoriteTickers = () => {
    const db = getDatabase();
    const user = userStore.user;
    const favoritesRef = dbRef(db, `favorites/${user.uid}`);

    onValue(favoritesRef, (snapshot) => {
        if (snapshot.exists()) {
            favoriteCoins.value = Object.values(snapshot.val());
            updateCharts();
        } else {
            favoriteCoins.value = [];
            updateCharts();
        }
    });
};

// Update charts with favorite coins data
const updateCharts = () => {
    const favoriteNames = favoriteCoins.value.map((coin) => coin.market.name);
    const favoriteCounts = favoriteNames.reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(favoriteCounts);
    const data = Object.values(favoriteCounts);

    // Destroy previous chart instances if they exist
    barChartInstance?.destroy();
    doughnutChartInstance?.destroy();

    // Generate random colors
    const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const backgroundColors = data.map(getRandomColor);

    // Create Bar Chart
    if (myChartBar.value) {
        barChartInstance = new Chart(myChartBar.value, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Favorite Distribution',
                        data,
                        backgroundColor: backgroundColors,
                        borderColor: '#000',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: { y: { beginAtZero: true } },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}`,
                        },
                    },
                },
                layout: { padding: { top: 30, bottom: 30 } },
            },
        });
    }

    // Create Doughnut Chart
    if (myChartDoughnut.value) {
        doughnutChartInstance = new Chart(myChartDoughnut.value, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data,
                        backgroundColor: backgroundColors,
                        borderColor: '#fff',
                        borderWidth: 2,
                    },
                ],
                labels,
            },
            options: {
                responsive: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}`,
                        },
                    },
                },
            },
        });
    }
};

// Initialize charts when the component is mounted
onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userStore.setUser(user);
            fetchFavoriteTickers();
        }
    });
});
</script>

<style scoped>
.charts {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

@media (max-width: 1280px) {
    .charts {
        flex-direction: column;
    }
}
</style>
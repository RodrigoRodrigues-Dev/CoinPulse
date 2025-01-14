<template>
    <!-- Marquee container -->
    <div style="position: sticky; top: 0; z-index: 999;" :class="['marquee-container', theme.global.name.value === 'dark' ? 'dark-theme' : 'light-theme']">
        <div class="marquee-content" ref="marqueeContent">
            <!-- Coins displayed twice for smooth looping -->
            <div class="coin" v-for="coin in doubledCoins" :key="coin.id + Math.random()">
                <img :src="coin.image" alt="coin-logo" class="coin-logo" />
                <span class="coin-symbol">{{ coin.symbol.toUpperCase() }}</span>
                <span class="coin-price">${{ coin.current_price.toLocaleString() }}</span>
                <span :class="{
                    'price-change-positive': coin.price_change_percentage_24h > 0,
                    'price-change-negative': coin.price_change_percentage_24h < 0,
                }">
                    {{ coin.price_change_percentage_24h.toFixed(2) }}%
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTheme } from 'vuetify';
import axios from "axios";

const theme = useTheme();

// List of coins
const coins = ref([]); 

// Fetch coin data
const fetchCoins = async () => {
    try {
        const response = await axios.get(
            "https://api.coincap.io/v2/assets?limit=10"
        );
        coins.value = response.data.data.map(coin => ({
            id: coin.id,
            symbol: coin.symbol,
            current_price: parseFloat(coin.priceUsd),
            price_change_percentage_24h: parseFloat(coin.changePercent24Hr),
            image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`
        }));
    } catch (error) {
        console.error("Error fetching coin data:", error);
    }
};

const doubledCoins = computed(() => Array.isArray(coins.value) ? [...coins.value, ...coins.value] : []);

onMounted(() => {
    fetchCoins();
});
</script>

<style scoped>
/* Container for the marquee */
.marquee-container {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    padding: 10px 0;
    position: relative;
    background-color: transparent;
}

.dark-theme {
    color: #ffffff;
    background-color: #212121;
}

.light-theme {
    color: #000000;
    background-color: #fff;
}

.marquee-content {
    display: flex;
    align-items: center;
    animation: marquee 45s linear infinite;
}

.coin {
    display: flex;
    align-items: center;
    margin-right: 40px;
    font-size: 16px;
}

.coin-logo {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.coin-symbol {
    font-weight: bold;
    margin-right: 8px;
}

.coin-price {
    margin-right: 8px;
}

.price-change-positive {
    color: #4caf50;
}

.price-change-negative {
    color: #f44336;
}

@keyframes marquee {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-112%);
    }
}
</style>
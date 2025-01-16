<template>
  <v-container>
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="purple"></v-progress-circular>
        <p>Loading data...</p>
      </v-col>
    </v-row>
    <v-row v-else>
      <!-- General Summary -->
      <v-col cols="12" md="4">
        <v-card class="pa-3" outlined>
          <h3 class="mb-2">Global Market Cap</h3>
          <p>{{ marketCapGlobal }}</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-3" outlined>
          <h3 class="mb-2">24h Volume</h3>
          <p>{{ volume24h }}</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-3" outlined>
          <h3 class="mb-2">Total Cryptos</h3>
          <p>{{ totalCryptos }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Top 5 Cryptocurrencies -->
    <v-row>
      <v-col cols="12">
        <h2 class="mb-5">Top 5 Cryptocurrencies</h2>
        <v-row>
          <v-col cols="12" md="3" v-for="coin in topCoins" :key="coin.id">
            <v-card class="pa-3 rounded" outlined>
              <h4 class="d-flex align-center mb-3">
                <img class="mr-2" :src="coin.image" alt="coin.name" width="20" height="20" />
                {{ coin.name }}
              </h4>
              <p>Price: {{ coin.price }}</p>
              <p>Change: {{ coin.change24h }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-5" outlined>
          <h3>Market Cap Dominance</h3>
          <div class="chart-container d-flex align-center justify-center my-10">
            <canvas ref="marketCapChart"></canvas>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-5" outlined>
          <h3>24h Volume</h3>
          <div class="chart-container d-flex align-center justify-center my-10">
            <canvas ref="volumeChart"></canvas>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cryptocurrency Table -->
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Cryptocurrency List</h2>
        <v-data-table :items="cryptoList" :headers="tableHeaders" outlined hide-default-footer>
          <template v-slot:item.name="{ item }">
            <div class="d-flex">
              <img class="mr-2" :src="item.image" alt="item.name" width="20" height="20" />
              {{ item.name }}
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import axios from "axios";

const marketCapGlobal = ref("");
const volume24h = ref("");
const totalCryptos = ref(0);

const topCoins = ref([]);

const cryptoList = ref([]);

const tableHeaders = [
  { text: "Name", value: "name" },
  { text: "Price", value: "price" },
  { text: "Market Cap", value: "marketCap" },
  { text: "Change", value: "change" },
];

const marketCapChart = ref(null);
const volumeChart = ref(null);

const loading = ref(true);

const initializeCharts = (data) => {
  if (!marketCapChart.value || !volumeChart.value) {
    console.error("Chart elements are not available");
    return;
  }

  const marketCapData = data.map(coin => ({
    label: coin.name,
    value: coin.quotes.USD.market_cap,
  }));

  const volumeData = data.map(coin => ({
    label: coin.name,
    value: coin.quotes.USD.volume_24h,
  }));

  const marketCapCtx = marketCapChart.value.getContext('2d');
  new Chart(marketCapCtx, {
    type: 'pie',
    data: {
      labels: marketCapData.map(item => item.label),
      datasets: [{
        data: marketCapData.map(item => item.value),
        backgroundColor: ['#6a4c6f', '#8c6c8f', '#4d3b56', '#442e43', '#2e1f2d'],
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });

  const volumeCtx = volumeChart.value.getContext('2d');
  new Chart(volumeCtx, {
    type: 'bar',
    data: {
      labels: volumeData.map(item => item.label),
      datasets: [{
        label: '24h Volume',
        data: volumeData.map(item => item.value),
        backgroundColor: '#6a4c6f',
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
};

const fetchCryptoData = async () => {
  const apiUrl = "https://api.coinpaprika.com/v1/tickers";

  const fetchWithRetry = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url);
        if (!response.data) throw new Error("Failed to fetch");
        return response.data;
      } catch (error) {
        console.log(error)
      }
    }
  };

  try {
    const data = await fetchWithRetry(apiUrl);
    if (Array.isArray(data)) {
      const top5Coins = data.slice(0, 5);
      marketCapGlobal.value = `$${top5Coins.reduce((acc, coin) => acc + coin.quotes.USD.market_cap, 0).toLocaleString()}`;
      volume24h.value = `$${top5Coins.reduce((acc, coin) => acc + coin.quotes.USD.volume_24h, 0).toLocaleString()}`;
      totalCryptos.value = top5Coins.length;
      topCoins.value = top5Coins.map(coin => ({
        id: coin.id,
        name: coin.name,
        image: `https://static.coinpaprika.com/coin/${coin.id}/logo.png`,
        price: `$${coin.quotes.USD.price.toLocaleString()}`,
        change24h: `${coin.quotes.USD.percent_change_24h.toFixed(2)}%`,
      }));
      cryptoList.value = top5Coins.map(coin => ({
        name: coin.name,
        image: `https://static.coinpaprika.com/coin/${coin.id}/logo.png`,
        price: `$${coin.quotes.USD.price.toLocaleString()}`,
        marketCap: `$${coin.quotes.USD.market_cap.toLocaleString()}`,
        change: `${coin.quotes.USD.percent_change_24h.toFixed(2)}%`,
      }));
      initializeCharts(top5Coins);
      loading.value = false;
    } else {
      console.error("Error: Data is not an array");
      loading.value = false;
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    } else {
      console.error("Error fetching crypto data:", error);
    }
    loading.value = false;
  }
};

const fetchWithDelay = (fn, delay) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      await fn();
      resolve();
    }, delay);
  });
};

onMounted(async () => {
  await fetchWithDelay(fetchCryptoData, 1000); // Delay of 1 second
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}
</style>
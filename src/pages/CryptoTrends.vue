<template>
  <v-container class="pa-5">
    <v-row>
      <v-col cols="12">
        <h1>Popular Cryptocurrencies</h1>
        <p>
          Check out the latest prices, market caps, volumes, and 24-hour changes of popular cryptocurrencies.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card outlined class="pa-5">
          <h3 class="mb-5">Price Trends</h3>
          <canvas id="price-trend-chart"></canvas>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field v-model="searchQuery" label="Search for a cryptocurrency" outlined></v-text-field>
      </v-col>
    </v-row>


    <v-row>
      <v-col cols="12">
        <v-select v-model="selectedCategory" :items="categories" label="Select Category" outlined></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" v-for="coin in paginatedCoins" :key="coin.id">
        <v-card outlined class="pa-3">
          <v-card-title>
            <h3>{{ coin.name }}</h3>
          </v-card-title>
          <v-card-text>
            <p>Rank: {{ coin.rank }}</p>
            <p>Price: ${{ parseFloat(coin.priceUsd).toFixed(2) }}</p>
            <p>Market Cap: ${{ parseFloat(coin.marketCapUsd).toLocaleString() }}</p>
            <p>Volume (24h): ${{ parseFloat(coin.volumeUsd24Hr).toLocaleString() }}</p>
            <p>Supply: {{ parseFloat(coin.supply).toLocaleString() }}</p>
            <p :class="coin.changePercent24Hr > 0 ? 'text-success' : 'text-error'">
              24h Change: {{ parseFloat(coin.changePercent24Hr).toFixed(2) }}%
            </p>
            <p>Related Projects: {{ coin.relatedProjects }}</p>
            <p>Upcoming Events: {{ coin.upcomingEvents }}</p>
            <p>News: {{ coin.news }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text :href="'https://coincap.io/assets/' + coin.id" target="_blank">
              More Info
            </v-btn>
            <v-btn color="secondary" text :href="coin.explorer" target="_blank">
              Official Website
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card outlined class="pa-5">
          <h3 class="mb-5">Sector Growth</h3>
          <canvas id="sector-growth-chart"></canvas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const coins = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('All');
const categories = ref(['All', 'DeFi', 'Stablecoins', 'NFT-related']);
const page = ref(1);
const itemsPerPage = 9;

// Fetch coins data from API
const fetchCoins = async () => {
  try {
    const response = await axios.get(`https://rest.coincap.io/v3/assets?apiKey=${import.meta.env.VITE_COINCAP_API_KEY}`);
    coins.value = response.data.data.map(coin => ({
      ...coin,
      category: getCategory(coin), // Assign category to each coin
      relatedProjects: coin.relatedProjects || 'N/A',
      upcomingEvents: coin.upcomingEvents || 'N/A',
      news: coin.news || 'N/A',
    }));
    renderCharts();
  } catch (error) {
    console.error('Error fetching coin data:', error);
  }
};

// Determine category for each coin
const getCategory = (coin) => {
  if (coin.name.toLowerCase().includes('defi')) return 'DeFi';
  if (coin.name.toLowerCase().includes('usd')) return 'Stablecoins';
  if (coin.name.toLowerCase().includes('nft')) return 'NFT-related';
  return 'Other';
};

// Filter coins based on search query and selected category
const filteredCoins = computed(() => {
  return coins.value.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (selectedCategory.value === 'All' || coin.category === selectedCategory.value)
  );
});

// Paginate filtered coins
const paginatedCoins = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCoins.value.slice(start, end);
});

// Calculate total pages for pagination
const pageCount = computed(() => {
  return Math.ceil(filteredCoins.value.length / itemsPerPage);
});

// Fetch sector growth data from API
const fetchSectorGrowthData = async () => {
  try {
    const response = await axios.get(`https://rest.coincap.io/v3/assets?apiKey=${import.meta.env.VITE_COINCAP_API_KEY}`);
    const data = response.data.data;
    const sectorGrowth = {
      DeFi: data.filter(coin => getCategory(coin) === 'DeFi').length,
      Stablecoins: data.filter(coin => getCategory(coin) === 'Stablecoins').length,
      NFT: data.filter(coin => getCategory(coin) === 'NFT-related').length,
    };
    return [sectorGrowth.DeFi, sectorGrowth.Stablecoins, sectorGrowth.NFT];
  } catch (error) {
    console.error('Error fetching sector growth data:', error);
    return [0, 0, 0];
  }
};

// Render charts for price trends and sector growth
const renderCharts = async () => {
  const priceTrendCtx = document.getElementById('price-trend-chart').getContext('2d');
  const sectorGrowthCtx = document.getElementById('sector-growth-chart').getContext('2d');

  const priceTrendData = coins.value.map(coin => ({
    label: coin.name,
    data: [parseFloat(coin.priceUsd), parseFloat(coin.priceUsd) * 1.05], // Example data points
    borderColor: getRandomColor(),
    fill: false,
  }));

  new Chart(priceTrendCtx, {
    type: 'line',
    data: {
      labels: ['Current', 'Future'], // Example labels
      datasets: priceTrendData,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Price (USD)',
          },
        },
      },
    },
  });

  const sectorGrowthData = await fetchSectorGrowthData();

  new Chart(sectorGrowthCtx, {
    type: 'bar',
    data: {
      labels: ['DeFi', 'Stablecoins', 'NFT-related'],
      datasets: [{
        label: 'Growth',
        data: sectorGrowthData,
        backgroundColor: ['#6a4c6f', '#8c6c8f', '#4d3b56'],
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Sector',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Growth (%)',
          },
        },
      },
    },
  });
};

// Generate random color for chart lines
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Fetch coins data on component mount
onMounted(() => {
  fetchCoins();
});
</script>

<style scoped>
h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.text-success {
  color: #6a4c6f;
}
.text-error {
  color: #f44336;
}
.v-card {
  margin-bottom: 1rem;
}
</style>

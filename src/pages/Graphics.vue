<template>
  <div class="d-flex justify-center align-center" style="height: 100vh;">
    <v-container class="d-flex flex-column justify-center align-center">
      <h2 class="text-h5 mb-3">Price Forecasts</h2>

      <!-- Currency Selection -->
      <v-row style="width: 100%;">
        <v-col cols="12" md="6">
          <v-select
            v-model="selectedCoin"
            :items="coins"
            label="Select a Cryptocurrency"
          ></v-select>
        </v-col>

        <!-- Interval Selection -->
        <v-col cols="12" md="6">
          <v-select
            v-model="forecastPeriod"
            :items="forecastPeriods"
            label="Select Forecast Period"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Forecast Chart -->
      <v-card outlined class="pa-4 mt-4" style="width: 100%;">
        <canvas id="forecast-chart" style="width: 100%;"></canvas>
      </v-card>

      <!-- Summary -->
      <v-card style="width: 100%;" class="mt-4" outlined>
        <v-card-text>
          <h3 class="text-h6">Forecast Summary</h3>
          <p>
            Estimated Price for {{ selectedCoin }} after {{ forecastPeriod }}:
            <strong>${{ forecastedPrice }}</strong>
          </p>
          <p>
            Expected Change: 
            <span :class="forecastChange > 0 ? 'text-success' : 'text-error'">
              {{ forecastChange > 0 ? '+' : '' }}{{ forecastChange }}%
            </span>
          </p>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
Chart.register(...registerables);

const coins = ref(["Bitcoin", "Ethereum", "Tether", "Litecoin", "Ripple", "Cardano", "Polkadot", "Chainlink"]);
const selectedCoin = ref("Bitcoin");
const forecastPeriods = ref(["7d", "30d", "90d"]);
const forecastPeriod = ref("30d");
const forecastedPrice = ref(0);
const forecastChange = ref(0);
const historicalData = ref([]);
let chart = null;
const apiKey = import.meta.env.VITE_COIN_API_KEY;

const fetchHistoricalData = async () => {
  const coinSymbol = selectedCoin.value === "Bitcoin" ? "BTC" :
                     selectedCoin.value === "Ethereum" ? "ETH" :
                     selectedCoin.value === "Tether" ? "USDT" :
                     selectedCoin.value === "Litecoin" ? "LTC" :
                     selectedCoin.value === "Ripple" ? "XRP" :
                     selectedCoin.value === "Cardano" ? "ADA" :
                     selectedCoin.value === "Polkadot" ? "DOT" :
                     selectedCoin.value === "Chainlink" ? "LINK" : "";
  const url = `https://rest.coinapi.io/v1/exchangerate/${coinSymbol}/USD/history?period_id=1DAY&time_start=${new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    historicalData.value = response.data.map(item => ({
      date: new Date(item.time_period_start),
      price: item.rate_close,
    }));
  } catch (error) {
    console.error(`Error fetching historical data: ${error.message}`);
    historicalData.value = [];
  }
};

const generateForecast = () => {
  fetchHistoricalData().then(() => {
    const lastPrice = historicalData.value.at(-1)?.price || 0;
    const growthRate = forecastPeriod.value === "7d" ? 0.05 : forecastPeriod.value === "30d" ? 0.15 : 0.4;
    forecastedPrice.value = (lastPrice * (1 + growthRate)).toFixed(2);
    forecastChange.value = (growthRate * 100).toFixed(2);

    renderChart();
  });
};

const renderChart = () => {
  const ctx = document.getElementById('forecast-chart').getContext('2d');
  if (chart) {
    chart.destroy();
  }
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + parseInt(forecastPeriod.value));

  const forecastData = [...historicalData.value, { date: futureDate, price: forecastedPrice.value }];

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: forecastData.map(d => d.date),
      datasets: [{
        label: 'Price',
        data: forecastData.map(d => d.price),
        borderColor: '#9c27b0',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price (USD)'
          }
        }
      }
    }
  });
};

watch([selectedCoin, forecastPeriod], generateForecast);

onMounted(generateForecast);
</script>

<style scoped>
#forecast-chart {
  width: 100%;
}
.text-success {
  color: green;
}
.text-error {
  color: red;
}
</style>

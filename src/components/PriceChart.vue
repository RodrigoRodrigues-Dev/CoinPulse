<template>
  <v-card class="pa-5 price-chart" outlined>
    <h3>{{ coinName }} - Price Chart</h3>
    <div class="chart-container">
      <canvas ref="priceChart"></canvas>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  coinId: { type: String, required: true },
  coinName: { type: String, required: true },
});

const priceChart = ref(null);
const chartInstance = ref(null);

const fetchData = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${props.coinId}/market_chart?vs_currency=usd&days=1`
  );
  const data = await response.json();
  return data.prices.map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleTimeString(),
    price,
  }));
};

onMounted(async () => {
  const chartData = await fetchData();
  chartInstance.value = new Chart(priceChart.value, {
    type: "line",
    data: {
      labels: chartData.map((d) => d.time),
      datasets: [
        {
          data: chartData.map((d) => d.price),
          borderColor: "#6a4c6f",
          backgroundColor: "rgba(106, 76, 111, 0.2)",
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time",
          },
        },
        y: {
          title: {
            display: true,
            text: "Price (USD)",
          },
        },
      },
    },
  });
});
</script>

<style scoped>
.price-chart {
  margin: 40px 0;

  @media (max-width: 960px) {
    margin: 0 0 10px 0;
  }
}

.chart-container {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.chart-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

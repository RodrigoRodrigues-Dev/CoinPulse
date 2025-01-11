<template>
  <v-container>
    <!-- Card container for displaying cryptocurrency details -->
    <v-card class="pa-5 rounded-xl" outlined>
      <!-- Section: Header with coin image and basic info -->
      <v-row justify="space-between">
        <v-col cols="3">
          <!-- Coin image -->
          <v-img :src="coinImage" :width="75" />
        </v-col>
        <v-col cols="9">
          <!-- Coin name, symbol, price, and market cap rank -->
          <h2>{{ coinData.name }} ({{ coinData.symbol?.toUpperCase() }})</h2>
          <h3 :class="priceClass">${{ currentPrice }} USD</h3>
          <p>Market Cap Rank: #{{ coinData.market_cap_rank }}</p>
        </v-col>
      </v-row>

      <!-- Divider between header and stats -->
      <v-divider class="my-5" />

      <!-- Section: Market Cap -->
      <v-row>
        <v-col>
          <p><strong>Market Cap:</strong></p>
        </v-col>
        <v-col class="text-end">
          <p>${{ marketCap }}</p>
        </v-col>
      </v-row>

      <!-- Divider -->
      <v-divider class="my-4" />

      <!-- Section: 24-hour trading volume -->
      <v-row>
        <v-col>
          <p><strong>24h Volume:</strong></p>
        </v-col>
        <v-col class="text-end">
          <p>${{ volume }}</p>
        </v-col>
      </v-row>

      <!-- Divider -->
      <v-divider class="my-4" />

      <!-- Section: 24-hour high/low prices -->
      <v-row>
        <v-col>
          <p><strong>24h High/Low:</strong></p>
        </v-col>
        <v-col class="text-end">
          <p>${{ high24h }} / ${{ low24h }}</p>
        </v-col>
      </v-row>

      <!-- Divider between stats and tickers table -->
      <v-divider class="my-5" />

      <!-- Section: Tickers table -->
      <v-row>
        <TickersTable :tickers="tickers" />
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
// Import the TickersTable component
import TickersTable from "@/components/TickersTable.vue";

// Define the props accepted by the component
defineProps({
  coinImage: {
    type: String,
    required: true,
  },
  coinData: {
    type: Object,
    required: true,
  },
  tickers: {
    type: Array,
    required: true,
  },
  currentPrice: {
    type: String,
    required: true,
  },
  marketCap: {
    type: String,
    required: true,
  },
  volume: {
    type: String,
    required: true,
  },
  high24h: {
    type: String,
    required: true,
  },
  low24h: {
    type: String,
    required: true,
  },
  priceClass: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.text-success {
  color: #4caf50 !important;
}

.text-error {
  color: #f44336 !important;
}

.text-start {
  text-align: left;
}

.d-flex {
  display: flex;
  align-items: center;
}
</style>
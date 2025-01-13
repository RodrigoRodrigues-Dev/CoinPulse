<template>
  <CoinPriceMarquee />
  <PriceChart coinId="bitcoin" coinName="Bitcoin"/>
  <CoinDetails
    :coinImage="coinImage"
    :coinData="coinData"
    :tickers="tickers"
    :currentPrice="currentPrice"
    :marketCap="marketCap"
    :volume="volume"
    :high24h="high24h"
    :low24h="low24h"
    :priceClass="priceClass"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import CoinPriceMarquee from "@/components/CoinPriceMarquee.vue";
import CoinDetails from "@/components/CoinDetails.vue";
import PriceChart from "@/components/PriceChart.vue";

const coinData = ref({});
const tickers = ref([]);
const API_URL =
  "https://api.coingecko.com/api/v3/coins/bitcoin?community_data=false&developer_data=false&include_exchange_logo=true&tickers=true";

const currentPrice = computed(() =>
  coinData.value.market_data?.current_price?.usd?.toLocaleString() || "0.00"
);
const marketCap = computed(() =>
  coinData.value.market_data?.market_cap?.usd?.toLocaleString() || "0.00"
);
const volume = computed(() =>
  coinData.value.market_data?.total_volume?.usd?.toLocaleString() || "0.00"
);
const high24h = computed(() =>
  coinData.value.market_data?.high_24h?.usd?.toLocaleString() || "0.00"
);
const low24h = computed(() =>
  coinData.value.market_data?.low_24h?.usd?.toLocaleString() || "0.00"
);
const coinImage = computed(() => coinData.value.image?.large || "");
const priceClass = computed(() =>
  coinData.value.market_data?.price_change_percentage_24h > 0
    ? "text-success"
    : "text-error"
);

const fetchCryptoData = async () => {
  try {
    const response = await axios.get(API_URL);
    coinData.value = response.data;
    tickers.value = response.data.tickers.slice(0, 99);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchCryptoData();
});
</script>
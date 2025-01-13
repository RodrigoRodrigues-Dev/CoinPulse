<template>
    <v-col> 
        <h4 class="py-4">Tickers</h4>
        <v-table dense width="100%" style="height: 500px;">
            <thead>
                <tr>
                    <th class="text-start"><span class="mdi mdi-menu-up"></span>#</th>
                    <th class="text-start">Exchange</th>
                    <th class="text-start">Pair</th>
                    <th class="text-start">Price</th>
                    <th class="text-start">Volume</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ticker, index) in tickers" :key="ticker.market.name + ticker.last">
                    <td>
                        <span class="mdi mdi-star-outline mr-3"></span>
                        <span :style="{ display: index > 7 ? 'none' : 'inline-block' }">0</span>
                        <span>{{ index + 2 }}</span>
                    </td>
                    <td class="text-start d-flex align-center">
                        <v-img v-if="ticker.market.logo" :src="ticker.market.logo" :alt="ticker.market.name"
                            max-height="20" max-width="20" class="mr-2" />
                        {{ ticker.market.name }}
                    </td>
                    <td class="text-start">{{ ticker.base }}/{{ ticker.target }}</td>
                    <td class="text-start">${{ ticker.last.toLocaleString() }}</td>
                    <td class="text-start">${{ ticker.volume.toLocaleString() }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-col>
</template>

<script setup>
defineProps({
    tickers: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped>
.text-start {
    text-align: left;
}

.d-flex {
    display: flex;
    align-items: center;
}
</style>
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
                        <span style="cursor: pointer;" :class="favorites[sanitizeTickerName(ticker)] ? 'mdi mdi-star star-yellow' : 'mdi mdi-star-outline'" class="mr-3" v-if="userCredential" @click="toggleFavorite(ticker)"></span>
                        <router-link to="/SignIn" v-else>
                            <span style="cursor: pointer; color: #fff;" class="mdi mdi-star-outline mr-3"></span>
                        </router-link>
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
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import { reactive, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getDatabase();
const favorites = reactive({});
let userCredential = null;

// Helper function to sanitize ticker name
const sanitizeTickerName = (item) => {
    return `${item.market.name}_${item.base}_${item.target}`.replace(/[.#$[\]]/g, '_');
};

// Fetch favorites on mount
onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userCredential = user;
            const favoritesRef = dbRef(db, `favorites/${user.uid}`);
            
            get(favoritesRef).then((snapshot) => {
                if (snapshot.exists()) {
                    Object.assign(favorites, snapshot.val());
                }
            }).catch((error) => {
                console.error("Error fetching favorites:", error);
            });
        }
    });
});

// Toggle favorite status
const toggleFavorite = (item) => {
    const user = userCredential;
    const sanitizedTickerName = sanitizeTickerName(item);
    const favoritesRef = dbRef(db, `favorites/${user.uid}/${sanitizedTickerName}`);
    
    if (favorites[sanitizedTickerName]) {
        set(favoritesRef, null)
            .then(() => {
                delete favorites[sanitizedTickerName];
            })
            .catch((error) => {
                console.error("Error removing ticker from favorites:", error);
            });
    } else {
        set(favoritesRef, item)
            .then(() => {
                favorites[sanitizedTickerName] = item;
            })
            .catch((error) => {
                console.error("Error adding ticker to favorites:", error);
            });
    }
};

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

.star-yellow {
    color: yellow;
}
</style>
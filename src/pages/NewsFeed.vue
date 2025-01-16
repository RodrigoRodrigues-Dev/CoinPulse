<template>
    <v-container>
        <!-- Filters and Categories -->
        <v-row class="my-5">
            <v-col cols="12">
                <h1 class="text-h4 font-weight-bold text-center my-10">Latest Crypto News</h1>
                <v-text-field
                    v-model="searchQuery"
                    label="Search"
                    class="mb-4"
                ></v-text-field>
            </v-col>
        </v-row>

        <!-- Highlighted News -->
        <v-row v-if="highlightedNews.length > 0">
            <v-col cols="12">
                <h2 class="text-h5 font-weight-bold mb-10">Top News</h2>
                <v-carousel hide-delimiters>
                    <v-carousel-item
                        v-for="(article, index) in highlightedNews"
                        :key="index"
                    >
                        <v-img :src="article.urlToImage" height="400px"></v-img>
                        <v-container>
                            <h3>{{ article.title }}</h3>
                            <p>{{ article.description }}</p>
                        </v-container>
                    </v-carousel-item>
                </v-carousel>
            </v-col>
        </v-row>

        <!-- Display news in grid format -->
        <v-row v-if="filteredNews.length > 0">
            <template v-for="(article, index) in filteredNews" :key="index">
                <v-col cols="12" md="6" lg="4" v-if="article && article.urlToImage">
                    <v-card outlined class="mb-4">
                        <v-img :src="article.urlToImage" height="200px"></v-img>
                        <v-card-title>{{ article.title }}</v-card-title>
                        <v-card-subtitle>{{ article.source.name }}</v-card-subtitle>
                        <v-card-text>
                            <v-expand-transition>
                                <div v-if="expandedArticle === index">
                                    {{ article.content }}
                                    <v-btn text @click="expandedArticle = null">Show Less</v-btn>
                                </div>
                                <div v-else>
                                    {{ article.description || "No description available." }}
                                </div>
                            </v-expand-transition>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="purple" text :href="article.url" target="_blank">Read More</v-btn>
                            <v-btn icon @click="shareArticle(article.url, 'twitter')">
                                <v-icon>mdi-twitter</v-icon>
                            </v-btn>
                            <v-btn icon @click="shareArticle(article.url, 'linkedin')">
                                <v-icon>mdi-linkedin</v-icon>
                            </v-btn>
                            <v-btn icon @click="shareArticle(article.url, 'facebook')" />
                                <v-icon>mdi-facebook</v-icon>
                            </v-card-actions>
                    </v-card>
                </v-col>
            </template>
        </v-row>

        <!-- Loading message -->
        <v-row v-else>
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="purple"></v-progress-circular>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            news: [],
            highlightedNews: [],
            searchQuery: "",
            expandedArticle: null,
            categories: [],
        };
    },
    computed: {
        filteredNews() {
            let filtered = this.news;
            if (this.searchQuery) {
                filtered = filtered.filter(article => article.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
            }
            filtered = filtered.filter(article => !article.title.includes("[Removed]"));
            return filtered;
        },
    },
    methods: {
        async fetchNews() {
            try {
                const response = await axios.get(
                    "https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=f97161fd547e430ebd7cc9ca70600a82"
                );
                this.news = response.data.articles.filter(article => 
                    !article.title.includes("[Removed]") && article.urlToImage
                );
                this.highlightedNews = this.news.slice(0, 5);
                this.categories = [...new Set(this.news.map(article => article.category))];
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        },
        shareArticle(url, platform) {
            const shareUrls = {
                twitter: `https://twitter.com/share?url=${url}`,
                linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            };
            window.open(shareUrls[platform], "_blank");
        },
    },
    mounted() {
        this.fetchNews();
    },
};
</script>

<style scoped>
h1 {
    color: #fff;
}
</style>
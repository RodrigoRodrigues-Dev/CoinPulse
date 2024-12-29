import { defineStore } from "pinia";

export const useThemeFunction = defineStore('themeFunction', {
    state: () => ({
        darkMode: true,
        switchActive: false
    }),
    actions: {
        toggleTheme() {
            this.darkMode = !this.darkMode;
        },
    },
})
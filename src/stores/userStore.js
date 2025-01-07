// src/stores/userStore.js
import { defineStore } from 'pinia';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: '',
    userIsLoggedIn: null,
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
      this.userIsLoggedIn = !!userData;
    },
    initAuth() {
      const auth = getAuth();
      onAuthStateChanged(auth, (currentUser) => {
        this.setUser(currentUser);
      });
    },
  },
  persist: true,
});
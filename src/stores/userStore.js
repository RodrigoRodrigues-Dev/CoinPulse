import { defineStore } from 'pinia';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    userIsLoggedIn: null,
    username: null,
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
      this.userIsLoggedIn = !!userData;

      if (userData) {
        this.fetchUsername(userData.uid);
      }
    },
    initAuth() {
      const auth = getAuth();
      onAuthStateChanged(auth, (currentUser) => {
        this.setUser(currentUser);
      });
    },
    async fetchUsername(uid) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + uid);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        this.username = userData.username;
      }
    },
  },
  persist: true,
});
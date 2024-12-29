import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    isModalVisible: true,
    selectPage: 'Home',
  }),
  persist: true,
});
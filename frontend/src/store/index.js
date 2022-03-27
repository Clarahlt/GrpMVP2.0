import { createStore } from "vuex";

export default createStore({
  state: {
  },
  getters: {
    postDateTime: () => {
      const currentYear = Date().getDate()

      return `Publié le ${currentYear}`
    }
  },
  mutations: {},
  actions: {},
  modules: {},
});

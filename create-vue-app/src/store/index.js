import { createStore } from "vuex"

const store = createStore({
  state() {
    return {
      userData: null,
    }
  },
  mutations: {
    setUserData(state, userData) {
      state.userData = userData
    },
  },
  getters: {
    getUserData(state) {
      return state.userData
    },
  },
})

export default store

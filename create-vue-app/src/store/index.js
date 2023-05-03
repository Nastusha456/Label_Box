import { createStore } from "vuex"

const store = createStore({
  state() {
    return {
      userData: null,
      // classifierPath: "/try_classifier.json",
      classifierPath:
        "http://192.168.84.178:5000/classificator/2/classifier/1?format=json",
      // annotationPath: "/try_annotation.json",
      annotationPath:
        "http://192.168.84.178:5000/ann/2/annotation/1?format=json",
      loginPath: "http://192.168.84.178:5000/users/login",
      registrationPath: "http://192.168.84.178:5000/users/register?format=json",
      accountPath: "http://192.168.84.178:5000/users/change",
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
    getClassifierPath(state) {
      return state.classifierPath
    },
    getAnnotationPath(state) {
      return state.annotationPath
    },
    getLoginPath(state) {
      return state.loginPath
    },
    getRegistrationPath(state) {
      return state.registrationPath
    },
    getAccountPath(state) {
      return state.accountPath
    },
  },
})

export default store

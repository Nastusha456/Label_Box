import { createApp } from "vue"
import App from "./App"
import router from "@/router/router"
import store from "@/store/index"

const app = createApp(App)

app.use(router).use(store).mount("#app")

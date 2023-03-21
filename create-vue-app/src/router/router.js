import SignIn from "@/pages/SignIn"
import Registration from "@/pages/Registration"
import Main from "@/pages/Main"
import Account from "@/pages/Account"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    component: SignIn,
  },
  {
    path: "/registration",
    component: Registration,
  },
  {
    path: "/main",
    component: Main,
  },
  {
    path: "/account",
    component: Account,
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
})

export default router

import SignIn from "@/pages/SignIn"
import Registration from "@/pages/Registration"
import Main from "@/pages/Main"
import Account from "@/pages/Account"
import Work from "@/pages/Work"
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
  {
    path: "/work",
    component: Work,
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
})

export default router

import SignIn from "@/pages/SignIn"
import Registration from "@/pages/Registration"
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("accessToken")
  if (to.path === "/account" || to.path === "/work") {
    if (isAuthenticated) {
      next()
    } else {
      next("/")
    }
  } else {
    next()
  }
})

export default router
